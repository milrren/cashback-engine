export type Success<T> = { readonly tag: 'success'; readonly value: T };
export type Failure<E> = { readonly tag: 'failure'; readonly error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export const success = <T>(value: T): Success<T> => ({ tag: 'success', value });
export const failure = <E>(error: E): Failure<E> => ({ tag: 'failure', error });

export type UserTier = 'STANDARD' | 'VIP';

export interface Wallet {
  readonly _id?: string;
  readonly user_id: string;
  readonly balance: number;
  readonly tier: UserTier;
  readonly last_update: Date;
}

export interface Transaction {
  readonly transaction_id: string;
  readonly user_id: string;
  readonly amount: number;
  readonly type: 'CREDIT' | 'DEBIT';
  readonly timestamp: Date;
}

export interface FailoverEvent {
  readonly original_event: object;
  readonly error_message: string;
  readonly stack_trace: string;
  readonly retry_count: number;
  readonly status: 'PENDING' | 'PROCESSED' | 'FATAL';
}
