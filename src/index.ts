import dotenv from 'dotenv';
import express from 'express';
import { initMongo } from './infrastructure/mongodb';
import { initKafka, ensureTopics } from './infrastructure/kafka';
import { processCashback } from './application/use-cases';
import { getWallet, getMonthlyReport, postRedeem } from './interface/routes';

dotenv.config();

const start = async () => {
  const repos = await initMongo(
    process.env.MONGO_URI || 'mongodb://localhost:27017', 
    'cashback_db'
  );
  
  const { admin, producer, consumer } = initKafka(
    'cashback-engine', 
    [process.env.KAFKA_BROKERS || 'localhost:9092']
  );

  await ensureTopics(admin, ['purchase.events.confirmed', 'cashback.events.granted']);

  await producer.connect();
  const purchaseConsumer = consumer('cashback-group');
  await purchaseConsumer.connect();
  await purchaseConsumer.subscribe({ topic: 'purchase.events.confirmed', fromBeginning: false });

  // Kafka Consumer Logic
  await purchaseConsumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const rawData = JSON.parse(message.value.toString());
      
      await processCashback(repos, producer)({
        trace_id: rawData.trace_id,
        user_id: rawData.user_id,
        amount: rawData.purchase_value,
        status: rawData.status,
        transaction_id: rawData.transaction_id
      });
    },
  });

  // REST API
  const app = express();
  app.use(express.json());

  app.get('/v1/wallets/:userId', getWallet(repos));
  app.get('/v1/reports/monthly', getMonthlyReport(repos));
  app.post('/v1/wallets/redeem', postRedeem(repos, producer));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Cashback Engine running on port ${PORT}`));
};

start().catch(console.error);
