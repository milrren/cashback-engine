import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const produceTestEvent = async () => {
  const kafka = new Kafka({
    clientId: 'test-producer',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
  });

  const producer = kafka.producer();
  await producer.connect();

  const message = {
    trace_id: uuidv4(),
    user_id: 'user_456',
    purchase_value: 200.00,
    status: 'Confirmed',
    transaction_id: `txn_${Date.now()}`
  };

  await producer.send({
    topic: 'purchase.events.confirmed',
    messages: [{ value: JSON.stringify(message) }]
  });

  console.log('Test event sent:', message);
  await producer.disconnect();
};

produceTestEvent().catch(console.error);
