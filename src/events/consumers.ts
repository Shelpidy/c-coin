import { Kafka, Consumer } from "kafkajs";
import dotenv from "dotenv";
import { buyCommodity, transferCommodity } from "../utils/Utils";

dotenv.config();

const BROKER_1 = process.env.BROKER_1 || "";
const BROKER_2 = process.env.BROKER_2 || "";
const BROKER_3 = process.env.BROKER_3 || "";
const SERVER_ID = process.env.SERVER_ID || "";

const kafka: Kafka = new Kafka({
  brokers: [BROKER_1,BROKER_2],
  clientId: SERVER_ID,
});

const consumer: Consumer = kafka.consumer({ groupId: SERVER_ID });

type TransferCommodityParams = {
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  date: Date;
};

export async function runCommodityConsumer() {
  try {
    console.log("Connecting consumer...");
    await consumer.connect();
    console.log("Subscribing to topics...");
    await consumer.subscribe({
      topics: ["TRANSFER_COMMODITY", "BUY_COMMODITY", "BUY_PRODUCT", "DELETE_TRANSACTION"],
      fromBeginning: true,
    });
    console.log("Successfully subscribed to topics!");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { serverId, ...data } = JSON.parse(message.value?.toString() || "{}");

        console.log("Data from producer", { topic, partition,data,serverId });

        if (serverId === SERVER_ID) {
          // Do nothing if the message originated from this server
        } else {
          switch (topic) {
            case "TRANSFER_COMMODITY":
              await transferCommodity(data as TransferCommodityParams);
              break;
            case "BUY_COMMODITY":
              const { address, amount, date } = data ;
              await buyCommodity(address, amount, date);
              break;
            default:
              // Handle other topics if necessary
              break;
          }
        }
      },
    });
  } catch (err) {
    console.error("Failed to run commodity consumer:", err);
  }
}
