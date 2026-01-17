import { Kafka, Producer, Admin } from 'kafkajs';
import { CashbackGrantedSchema, RedeemBalanceSchema } from './avro-schemas';

export const initKafka = (clientId: string, brokers: string[]) => {
  const kafka = new Kafka({ clientId, brokers });
  return {
    admin: kafka.admin(), // Adicionado Admin
    producer: kafka.producer(),
    consumer: (groupId: string) => kafka.consumer({ groupId })
  };
};

export const ensureTopics = async (admin: Admin, topics: string[]) => {
  await admin.connect();
  const existingTopics = await admin.listTopics();
  const topicsToCreate = topics
    .filter(topic => !existingTopics.includes(topic))
    .map(topic => ({ topic }));

  if (topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate,
      waitForLeaders: true,
    });
    console.log(`✅ Topics created: ${topicsToCreate.map(t => t.topic).join(', ')}`);
  }
  await admin.disconnect();
};

export const produceCashbackEvent = (producer: Producer) => 
  async (topic: string, payload: any): Promise<void> => {
    const buffer = CashbackGrantedSchema.toBuffer(payload);
    await producer.send({
      topic,
      messages: [{ value: buffer }]
    });
  };

export const produceRedeemBalanceEvent = (producer: Producer) => 
  async (topic: string, payload: any): Promise<void> => {
    const buffer = RedeemBalanceSchema.toBuffer(payload);
    await producer.send({
      topic,
      messages: [{ value: buffer }]
    });
  };
