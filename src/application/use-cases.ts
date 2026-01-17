import { Repositories, updateWalletBalance } from '../infrastructure/mongodb';
import { produceCashbackEvent } from '../infrastructure/kafka';
import { calculateCashback, isPurchaseConfirmed } from '../domain/logic';
import { Result, success, failure } from '../domain/types';
import { Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

interface ProcessPurchaseInput {
  readonly trace_id: string;
  readonly user_id: string;
  readonly amount: number;
  readonly status: string;
  readonly transaction_id: string;
}

export const processCashback = (repos: Repositories, producer: Producer) => 
  async (input: ProcessPurchaseInput): Promise<Result<string, string>> => {
    try {
      const confirmation = isPurchaseConfirmed(input.status);
      if (confirmation.tag === 'failure') return confirmation;

      const wallet = await repos.wallets.findOne({ user_id: input.user_id });
      const tier = wallet?.tier || 'STANDARD';
      const cashbackAmount = calculateCashback(input.amount, tier);

      // Atomic Update
      await updateWalletBalance(repos.wallets)(input.user_id, cashbackAmount);

      // Log Transaction
      await repos.transactions.insertOne({
        transaction_id: input.transaction_id,
        user_id: input.user_id,
        amount: cashbackAmount,
        type: 'CREDIT',
        timestamp: new Date()
      });

      const eventPayload = {
        trace_id: input.trace_id,
        user_id: input.user_id,
        amount_credited: cashbackAmount,
        transaction_id: input.transaction_id,
        timestamp: Date.now(),
        origin_service: 'cashback-engine'
      };

      try {
        await produceCashbackEvent(producer)('cashback.events.granted', eventPayload);
      } catch (err) {
        // Resilience Mechanism: Persist to Failover
        await repos.failover.insertOne({
          original_event: eventPayload,
          error_message: err instanceof Error ? err.message : 'Unknown Kafka Error',
          stack_trace: err instanceof Error ? (err.stack || '') : '',
          retry_count: 0,
          status: 'PENDING'
        });
      }

      return success('Cashback processed successfully');
    } catch (error) {
      return failure(error instanceof Error ? error.message : 'Unknown processing error');
    }
  };
