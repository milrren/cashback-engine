import { Collection, Db, MongoClient } from 'mongodb';
import { Wallet, Transaction, FailoverEvent } from '../domain/types';

export interface Repositories {
  readonly wallets: Collection<Wallet>;
  readonly transactions: Collection<Transaction>;
  readonly failover: Collection<FailoverEvent>;
}

export const initMongo = async (uri: string, dbName: string): Promise<Repositories> => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  
  return {
    wallets: db.collection<Wallet>('wallets'),
    transactions: db.collection<Transaction>('transactions'),
    failover: db.collection<FailoverEvent>('failover_events')
  };
};

export const updateWalletBalance = (wallets: Collection<Wallet>) => 
  async (userId: string, amount: number): Promise<void> => {
    await wallets.updateOne(
      { user_id: userId },
      { 
        $inc: { balance: amount },
        $set: { last_update: new Date() }
      },
      { upsert: true }
    );
  };
