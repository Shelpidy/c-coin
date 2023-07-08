import { Kafka,Consumer } from "kafkajs";

import dotenv from "dotenv"
import { buyCommodity, transferCommodity } from "../utils/Utils";

dotenv.config()

let BROKER_1 = process.env.BROKER_1||''
let BROKER_2 = process.env.BROKER_2||''
let BROKER_3 = process.env.BROKER_3||''
let SERVER_ID = process.env.SERVER_ID||""

let kafka:Kafka = new Kafka({
    brokers:[BROKER_1,BROKER_2,BROKER_3],
    clientId:process.env.SERVER_ID
})

let consumer:Consumer = kafka.consumer({
    groupId:SERVER_ID
})


type TransferCommodityParams = {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    date:Date
};

export async function runCommodityConsumer(){
    try{
        await consumer.connect()
        await consumer.subscribe({topics:["TRANSFER_COMMODITY",'BUY_COMMODITY','BUY_PRODUCT','DELETE_TRANSACTION'],fromBeginning:false})
        consumer.run({
            eachMessage:async({topic,partition,message})=>{
                let {serverId,...data} = JSON.parse(String(message.value))
                if(serverId === process.env.SERVER_ID){
                    // DO NOTHING
                }
                else{
                    switch(topic){
                        case "TRANSFER_COMMODITY":
                            await transferCommodity(data)
                            break
                        case 'BUY_COMMODITY':
                            await buyCommodity(data.address,data.amount,data.date)
                            break
                        default:
                            
                    }
                }
            }
        })
    
    }catch(err){
        throw err

    }
    
}