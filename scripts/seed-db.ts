import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('cashback_db');
    const wallets = db.collection('wallets');

    await wallets.deleteMany({}); // Clear existing

    await wallets.insertMany([
      {
        user_id: 'user_123',
        balance: 100.00,
        tier: 'STANDARD',
        last_update: new Date()
      },
      {
        user_id: 'user_456',
        balance: 500.00,
        tier: 'VIP',
        last_update: new Date()
      }
    ]);

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
};

seed();
