import avro from 'avsc';

export const CashbackGrantedSchema = avro.Type.forSchema({
  type: "record",
  name: "CashbackGranted",
  namespace: "com.loyalty.engine",
  fields: [
    { name: "trace_id", type: "string" },
    { name: "user_id", type: "string" },
    { name: "amount_credited", type: "double" },
    { name: "transaction_id", type: "string" },
    { name: "timestamp", type: "long" },
    { name: "origin_service", type: "string" }
  ]
});
