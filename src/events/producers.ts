import { Kafka,Producer } from "kafkajs";

import dotenv from "dotenv"

dotenv.config()

let BROKER_1 = process.env.BROKER_1||''
let BROKER_2 = process.env.BROKER_2||''
let BROKER_3 = process.env.BROKER_3||''


let kafka:Kafka = new Kafka({
    brokers:[BROKER_1,BROKER_2],
    clientId:process.env.SERVER_ID
})

let producer:Producer = kafka.producer({
    
})

type TransferCommodityParams = {
    senderAddress: string;
    recipientAddress: string;
    amount: number;
    date:Date
};

export async function runTransferCommodityProducer(value:TransferCommodityParams){
    try{
        await producer.connect()
        producer.send({
            topic:"TRANSFER_COMMODITY",
            messages:[{value:JSON.stringify({...value,serverId:process.env.SERVER_ID})}]
        })
        await producer.disconnect()

    }catch(err){
        console.log(err)
    }

}


export async function runBuyProductProducer(value:any){
    try{
        await producer.connect()
        producer.send({
            topic:"BUY_PRODUCT",
            messages:[{value:JSON.stringify({...value,serverId:process.env.SERVER_ID})}]
        })
        await producer.disconnect()

    }catch(err){
        console.log(err)
    }
}

type BuyCommodityParams = {
    address:number|string
    amount:number
    date:Date
}

export async function runBuyCommodityProducer(value:BuyCommodityParams){
    try{
        await producer.connect()
        producer.send({
            topic:"BUY_COMMODITY",
            messages:[{value:JSON.stringify({...value,serverId:process.env.SERVER_ID})}]
        })
        await producer.disconnect()

    }catch(err){
        console.log(err)
    }

}

export async function runBuyDeleteTransactionProducer(value:{transactionId:number|string}){
    try{
        await producer.connect()
        producer.send({
            topic:"DELETE_TRANSACTION",
            messages:[{value:JSON.stringify({...value,serverId:process.env.SERVER_ID})}]
        })
        await producer.disconnect()

    }catch(err){
        console.log(err)
    }

}


