import { UserTier, Result, success, failure } from './types';

export const calculateCashback = (amount: number, tier: UserTier): number => {
  const percentage = tier === 'VIP' ? 0.10 : 0.05;
  return Number((amount * percentage).toFixed(2));
};

export const calculateSafeBalanceDeduction = (currentBalance: number, deduction: number): number => {
  const newBalance = currentBalance - deduction;
  return Math.max(0, newBalance);
};

export const isPurchaseConfirmed = (status: string): Result<boolean, string> => {
  return status.toUpperCase() === 'CONFIRMED' 
    ? success(true) 
    : failure('Event status is not confirmed');
};

export const isRedemptionConfirmed = (status: string): Result<boolean, string> => {
  return status.toUpperCase() === 'CONFIRMED' 
    ? success(true) 
    : failure('Event status is not confirmed');
};

export const validateRedemption = (currentBalance: number, redemptionAmount: number): Result<boolean, string> => {
  return currentBalance - redemptionAmount >= 0
    ? success(true)
    : failure('Insufficient balance for redemption');
}
