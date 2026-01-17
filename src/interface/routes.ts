import { Repositories } from '../infrastructure/mongodb';
import { Request, Response } from 'express';

export const getWallet = (repos: Repositories) => async (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallet = await repos.wallets.findOne({ user_id: userId });
  
  return wallet 
    ? res.status(200).json({ balance: wallet.balance, tier: wallet.tier })
    : res.status(404).json({ error: 'Wallet not found' });
};

export const getMonthlyReport = (repos: Repositories) => async (_req: Request, res: Response) => {
  const pipeline = [
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" }
      }
    }
  ];
  
  const stats = await repos.transactions.aggregate(pipeline).toArray();
  const report = stats.reduce((acc: any, curr: any) => {
    acc[curr._id] = curr.total;
    return acc;
  }, { CREDIT: 0, DEBIT: 0 });

  return res.status(200).json({
    issued: report.CREDIT,
    reversed: report.DEBIT,
    net: report.CREDIT - report.DEBIT
  });
};
