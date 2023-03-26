import express from "express"
import { Commodity } from "../models/Commodities"
import { CommodityTransaction } from "../models/ComTransactions"
import { CommodityUser } from "../models/ComUsers"
import { responseStatus, responseStatusCode } from "../utils/Utils"
import {v4} from "uuid"
import { CommodityNotificationDetail } from "../models/ComNotificationDetails"
import { CommodityNotification } from "../models/ComNotifications"
import NotificationService from "../services/NotificationService"



let notification = new NotificationService()

export default (router:express.Application)=>{
    router.post("/api/transactions/sendcommodity",async(request:express.Request,response:express.Response)=>{
        try{
            let {transfereeAccountNumber,transferorAccountNumber,amount:_amount} = request.body
            let amount = Math.abs(_amount)
            let transfereeEmail = (await CommodityUser.findOne({where:{accountNumber:transfereeAccountNumber}}))?.getDataValue('email')
            let transferorEmail = (await CommodityUser.findOne({where:{accountNumber:transferorAccountNumber}}))?.getDataValue("email")
            if(!transfereeEmail){
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status:responseStatus.UNPROCESSED,
                        message:`The transferee account number ${transfereeAccountNumber} does not exist.`
                        })
                        return
              }

            if(!transferorEmail){
                response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                    status:responseStatus.UNPROCESSED,
                    message:`The transferor account number ${transferorAccountNumber} does not exist.`
                    })
                        return
              }

            // let transfereeNotificationTokens = JSON.parse((await CommodityNotificationDetail.findOne({where:{email:transfereeAccountNumber}}))?.getDataValue("notificationToken"))
            let transfereeNotificationBody = `You have seccessfully received an amount of ${amount} from an account account ${transferorAccountNumber}`
            let transferorNotificationBody = `You have seccessfully sent an amount of ${amount} to the account number ${transfereeAccountNumber}`
            let responseMessage = `You have seccessfully sent an amount of ${amount} from the account number ${transferorAccountNumber} to the account number ${transfereeAccountNumber}`
            
            let notificationTitle = "Transaction"

            let createdAt =  new Date()
            try{
                
                let transfereeAcc = await Commodity.findOne({where:{email:transfereeEmail}})
                let transferorAcc = await Commodity.findOne({where:{email:transferorEmail}})
                if(transferorAcc){
                    let balance:number = Number(transferorAcc.get('balance'))
                    console.log(balance)
                    if(balance >= amount){
                        if(transfereeAcc){
                            let newTransfereeBalance
                            let newTransferorBalance
                            let transferorNotDetailRecord
                            let transfereeNotDetailRecord
                            let transactionRecord
                            try{
                                 newTransfereeBalance = await transfereeAcc.increment('balance',{by:amount})
                                 newTransferorBalance = await transferorAcc.decrement("balance",{by:amount})
                                 let transactionId = v4()
                                 console.log("Transaction ID: ",transactionId)
                                 transactionRecord = new CommodityTransaction({transfereeAccountNumber,transferorAccountNumber,amount:String(amount),transactionId,createdAt})
                                 transferorNotDetailRecord = new CommodityNotification({email:transferorEmail,message:transferorNotificationBody,title:notificationTitle,createdAt})
                                 transfereeNotDetailRecord = new CommodityNotification({email:transfereeEmail,message:transfereeNotificationBody,title:notificationTitle,createdAt})
                                 
                                 let transfereeBalance = await newTransfereeBalance.save()
                                 let transferorBalance = await newTransferorBalance.save()
                                 await transactionRecord.save()
                                 await transferorNotDetailRecord.save()
                                 await transfereeNotDetailRecord.save()
                                 await notification.sendNotification()

                                 response.status(responseStatusCode.ACCEPTED).json({
                                 status:responseStatus.SUCCESS,
                                 message:responseMessage,
                                 data:{transferorBalance:{...transferorBalance.dataValues,balance:transferorBalance.getDataValue("balance") - amount},transfereeBalance:{...transfereeBalance.dataValues,balance:transfereeBalance.getDataValue("balance") + amount}}})
                               
                            }catch(err){
                                console.log(err)
                                await newTransfereeBalance?.reload()
                                await newTransfereeBalance?.reload()
                                await transactionRecord?.reload()
                                await transferorNotDetailRecord?.reload()
                                await transfereeNotDetailRecord?.reload()
                                response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                                status:responseStatus.UNPROCESSED,
                                message:err,
                           
                             })
                            }
                           
                        }
                        else{
                          let newTransfereeBalance
                          let newTransferorBalance
                          let transferorNotDetailRecord
                          let transfereeNotDetailRecord
                          let transactionRecord

                            try{
                                 newTransfereeBalance = new Commodity({email:transfereeEmail,balance:amount,createdAt})
                                 newTransferorBalance = await transferorAcc.decrement("balance",{by:amount})
                                 let transactionId = v4()
                                 console.log("Transaction ID: ",transactionId)
                                 transactionRecord = new CommodityTransaction({transfereeAccountNumber,transferorAccountNumber,amount:String(amount),transactionId,createdAt})
                                 transferorNotDetailRecord = new CommodityNotification({email:transferorEmail,message:transferorNotificationBody,title:"Transaction",createdAt})
                                 transfereeNotDetailRecord = new CommodityNotification({email:transfereeEmail,message:transfereeNotificationBody,title:"Transaction",createdAt})
                                 

                                 let _newTransfereeBalance = await newTransfereeBalance.save()
                                 let _newTransferorBalance = await newTransferorBalance.save()
                                 await transactionRecord.save()
                                 await transferorNotDetailRecord.save()
                                 await transfereeNotDetailRecord.save()
                                 await notification.sendNotification()

                                response.status(responseStatusCode.ACCEPTED).json({
                                status:responseStatus.SUCCESS,
                                message:responseMessage,
                                data:{transferorBalance:{..._newTransferorBalance.dataValues,balance:_newTransferorBalance.getDataValue("balance")},transfereeBalance:{..._newTransfereeBalance.dataValues,balance:_newTransfereeBalance.getDataValue("balance") + amount}}})
                                 
                            }catch(err){
                                console.log(err)
                                await newTransfereeBalance?.reload()
                                await newTransfereeBalance?.reload()
                                await transactionRecord?.reload()
                                await transferorNotDetailRecord?.reload()
                                await transfereeNotDetailRecord?.reload()
                                response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                                status:responseStatus.UNPROCESSED,
                                message:err
                                })
                            }

                            }

                    }else{
                        response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status:responseStatus.UNPROCESSED,
                        message:`You have insufficinet amount to transfer the amount ${amount}`
                    })

                    }
                }else{
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status:responseStatus.UNPROCESSED,
                        message:`Transferor account with ${transferorEmail} have C 0.00 balance`
                    })

                }
               
            }catch(err){
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });

            }
         
        }catch(err){
            console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
        }

    })

}