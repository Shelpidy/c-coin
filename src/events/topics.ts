import { Kafka,Admin } from "kafkajs";
import dotenv from "dotenv"

dotenv.config()

let BROKER_1 = process.env.BROKER_1 ??''
let BROKER_2 = process.env.BROKER_2 ??''
let BROKER_3 = process.env.BROKER_3 ??''

let kafka:Kafka = new Kafka({
    brokers:[BROKER_1,BROKER_2,BROKER_3],
    clientId:process.env.SERVER_ID
})

let admin:Admin = kafka.admin({
    
})

export async function createTopics(){
    try{
        await admin.connect()
        console.log("Creating topics...")
        await admin.createTopics({
            topics:[{
                topic:"TRANSFER_COMMODITY"
            },{topic:"BUY_PRODUCT"},{topic:"BUY_COMMODITY"},{topic:"DELETE_TRANSACTION"}]
        })
        console.log("Topics created!!")
    
       await admin.disconnect()

    }catch(err){
        console.log(err)

    }
  
}

createTopics()