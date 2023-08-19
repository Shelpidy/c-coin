import { Kafka, Admin, KafkaConfig, ITopicConfig } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

const BROKER_1 = process.env.BROKER_1 ?? "";
const BROKER_2 = process.env.BROKER_2 ?? "";

const kafkaConfig: KafkaConfig = {
  brokers: [BROKER_2],
  clientId: process.env.SERVER_ID,
};

const kafka = new Kafka(kafkaConfig);
const admin:Admin = kafka.admin();

async function createTopics() {
  try {
    await admin.connect();
    console.log("Creating topics...");

    const topicConfigs: ITopicConfig[] = [
      {
        topic: "TRANSFER_COMMODITY",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "BUY_PRODUCT",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "BUY_COMMODITY",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "DELETE_TRANSACTION",
        numPartitions: 3,
        replicationFactor: 1,
      },
      {
        topic: "ADD_TRANSACTION",
        numPartitions: 3,
        replicationFactor: 1,
      },
    ];

    await admin.createTopics({
      topics: topicConfigs,
    });

    console.log("Topics created!!");
    await admin.disconnect();
  } catch (err) {
    throw err;
  }
}

createTopics().catch(err =>{
  console.log(err)
});
