import express from "express";
import { Commodity } from "../models/Commodities";
import { CommodityTransaction } from "../models/ComTransactions";
import {
    buyCommodity,
    getPhoneNumberCompany,
    responseStatus,
    responseStatusCode,
} from "../utils/Utils";

import NotificationService from "../services/NotificationService";

import { Op } from "sequelize";
import cryptoJs from "crypto-js"
import { runBuyCommodityProducer, runTransferCommodityProducer } from "../events/producers";

let notification = new NotificationService();

export default (router: express.Application) => {
    router.post(
        "/tx/sendcommodity",
        async (request: express.Request, response: express.Response) => {
            try {
                let {
                    senderAddress,
                    recipientAddress,
                    amount: _amount,
                } = request.body;
                console.log({
                    senderAddress,
                    recipientAddress,
                    amount: _amount,
                })
                let amount = Math.abs(_amount);
                let date = new Date()
               
                // let transfereeNotificationTokens = JSON.parse((await CommodityNotificationDetail.findOne({where:{address:senderAddress}}))?.getDataValue("notificationToken"))

                let responseMessage = `You have seccessfully sent an amount of C${amount} from the account number ${recipientAddress} to the account number ${senderAddress}`;

                let createdAt = new Date();
                try {
                    let transfereeAcc = await Commodity.findOne({
                        where: { address: recipientAddress },
                    });
                    let transferorAcc = await Commodity.findOne({
                        where: { address: senderAddress },
                    });
                    if (transferorAcc) {
                        let balance: number = Number(
                            transferorAcc.get("balance")
                        );
                        console.log(balance);
                        if (balance >= amount) {
                            if (transfereeAcc) {
                                let newTransfereeBalance;
                                let newTransferorBalance;
                                let transactionRecord;
                                try {
                                    newTransfereeBalance =
                                        await transfereeAcc.increment(
                                            "balance",
                                            { by: amount }
                                        );
                                    newTransferorBalance =
                                        await transferorAcc.decrement(
                                            "balance",
                                            { by: amount }
                                        );
                                        let transObj = {
                                            recipientAddress,
                                            senderAddress,
                                            amount: String(amount),
                                            date
                                        }
                                        let previousTransactionHash = (await CommodityTransaction.findOne({
                                            order:[["createdAt","DESC"]]
                                        }))?.getDataValue("hash")
                                        let hash = cryptoJs.SHA256(JSON.stringify(transObj)).toString();
                                        console.log("Transaction Hash: ", hash);
                                        transactionRecord = new CommodityTransaction({
                                            recipientAddress,
                                            senderAddress,
                                            amount: String(amount),
                                            hash,
                                            previousTransactionHash,
                                            createdAt:date,
                                        });

                                    let transfereeBalance =
                                        await newTransfereeBalance.save();
                                    let transferorBalance =
                                        await newTransferorBalance.save();
                                    await transactionRecord.save();


                                    //// SEND AN EVENTS TO THE OTHER SERVERS
                                    try{
                                        await runTransferCommodityProducer({senderAddress,recipientAddress,amount:Number(amount),date})
                                    }
                                    catch(err){
                                        console.log("Error from other servers",err)
                                    }
                                    response
                                        .status(responseStatusCode.CREATED)
                                        .json({
                                            status: responseStatus.SUCCESS,
                                            message: responseMessage,
                                            item: {
                                                transferorBalance: {
                                                    ...transferorBalance.dataValues,
                                                    balance:
                                                        transferorBalance.getDataValue(
                                                            "balance"
                                                        ) - amount,
                                                },
                                                transfereeBalance: {
                                                    ...transfereeBalance.dataValues,
                                                    balance:
                                                        transfereeBalance.getDataValue(
                                                            "balance"
                                                        ) + amount,
                                                },
                                            },
                                        });
                                } catch (err) {
                                    console.log(err);
                                    await newTransfereeBalance?.reload();
                                    await newTransfereeBalance?.reload();
                                    await transactionRecord?.reload();
                                    response
                                        .status(
                                            responseStatusCode.UNPROCESSIBLE_ENTITY
                                        )
                                        .json({
                                            status: responseStatus.UNPROCESSED,
                                            message:String(err),
                                        });
                                }
                            } else {
                                let newTransfereeBalance;
                                let newTransferorBalance;
                                let transactionRecord;

                                try {
                                    newTransfereeBalance = new Commodity({
                                        address: recipientAddress,
                                        balance: amount,
                                        createdAt,
                                    });
                                    newTransferorBalance =
                                        await transferorAcc.decrement(
                                            "balance",
                                            { by: amount }
                                        );
                                        let transObj = {
                                            recipientAddress,
                                            senderAddress,
                                            amount: String(amount),
                                            date
                                        }
                                        let previousTransactionHash = (await CommodityTransaction.findOne({
                                            order:[["createdAt","DESC"]]
                                        }))?.getDataValue("hash")
                                        let hash = cryptoJs.SHA256(JSON.stringify(transObj)).toString();
                                        console.log("Transaction Hash: ", hash);
                                        transactionRecord = new CommodityTransaction({
                                            recipientAddress,
                                            senderAddress,
                                            amount: String(amount),
                                            hash,
                                            previousTransactionHash,
                                            createdAt:date,
                                        });

                                    let _newTransfereeBalance =
                                        await newTransfereeBalance.save();
                                    let _newTransferorBalance =
                                        await newTransferorBalance.save();
                                    await transactionRecord.save();
                                    await notification.sendNotification();

                                     //// SEND AN EVENTS TO THE OTHER SERVERS

                                     try{
                                        await runTransferCommodityProducer({senderAddress,recipientAddress,amount:Number(amount),date})

                                    }
                                    catch(err){
                                        console.log("Error from other servers",err)
                                    }


                                    response
                                        .status(responseStatusCode.CREATED)
                                        .json({
                                            status: responseStatus.SUCCESS,
                                            message: responseMessage,
                                            item: {
                                                transferorBalance: {
                                                    ..._newTransferorBalance.dataValues,
                                                    balance:
                                                        _newTransferorBalance.getDataValue(
                                                            "balance"
                                                        ),
                                                },
                                                transfereeBalance: {
                                                    ..._newTransfereeBalance.dataValues,
                                                    balance:
                                                        _newTransfereeBalance.getDataValue(
                                                            "balance"
                                                        ) + amount,
                                                },
                                            },
                                        });
                                } catch (err) {
                                    console.log(err);
                                    await newTransfereeBalance?.reload();
                                    await newTransfereeBalance?.reload();
                                    await transactionRecord?.reload();
                                    response
                                        .status(
                                            responseStatusCode.UNPROCESSIBLE_ENTITY
                                        )
                                        .json({
                                            status: responseStatus.UNPROCESSED,
                                            message:String(err),
                                        });
                                }
                            }
                        } else {
                            response
                                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                                .json({
                                    status: responseStatus.UNPROCESSED,
                                    message: `You have insufficinet amount to transfer the amount ${amount}`,
                                });
                        }
                    } else {
                        response
                            .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                            .json({
                                status: responseStatus.UNPROCESSED,
                                message: `Transferor account with ${senderAddress} have C 0.00 balance`,
                            });
                    }
                } catch (err) {
                    console.log(err);
                    response.status(responseStatusCode.BAD_REQUEST).json({
                        status: responseStatus.ERROR,
                        message:String(err),
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:String(err),
                });
            }
        }
    )

    //////////////////////// GET ALL TRANSACTIONS ///////////////////////////////////

    router.get(
        "/tx/",
        async (request: express.Request, response: express.Response) => {
            try {
                let transactions = await CommodityTransaction.findAll();
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: transactions,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message: err,
                });
            }
        }
    );

    /////////////////// GET TRANSACTIONS BY ADDRESS //////////////////////////

    router.get(
        "/tx/:address",
        async (request: express.Request, response: express.Response) => {
            try {
                let address = request.params.address;
               
                let transactions = await CommodityTransaction.findAll({
                    where:{[Op.or]:[{senderAddress:address},{recipientAddress:address}]},
                });
               
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: transactions,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message: err,
                });
            }
        }
    );

    ////////////////////////// DELETE A TRANSACTION HISTORY ///////////////////////

    router.delete(
        "/tx/:transactionId",
        async (request: express.Request, response: express.Response) => {
            try {
                let transactionId = request.params.transactionId;
                let deleteObj = await CommodityTransaction.destroy({
                    where: { transactionId },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.DELETED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a transaction record",
                        item:{
                            rowAffected:deleteObj
                        }
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `Failed to delete transaction with Id ${transactionId}`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:String(err),
                });
            }
        }
    );

    ////////////////////////////////////// BUY COMMODITY WITH ORANGE MONEY,AFRICELL MONEY OR QMONEY //////////////////
    


    router.post(
        "/tx/buycommodity/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { phoneNumber, address,amount,pinCode} = request.body;
                let phoneNumberCompany = await getPhoneNumberCompany(
                    phoneNumber
                );
                let date = new Date()
                let message = `You have seccessfully bought an amount of c${amount} from the number ${phoneNumber} and telecommunication company ${phoneNumberCompany}`;
                if (phoneNumberCompany == "africell") {
                    // 1. CONTACT TELECOMMUNICATION COMPANY TO DO THE CURENCY EXCHANGE
                    // 2. COMMODITY BALANCE UPDATED
                    await buyCommodity(address,amount,date)

                    //// SEND AN EVENT TO THE OTHER SERVERS 
                    try{
                        await runBuyCommodityProducer({address,amount,date})
                    }
                    catch(err){
                        console.log("Error from other servers",err)
                    }

                    response.status(responseStatusCode.CREATED).json({
                        status: responseStatus.SUCCESS,
                        message,
                    });
                } else if (phoneNumberCompany == "qcell") {

                    await buyCommodity(address,amount,date)
                    //// SEND AN EVENT TO THE OTHER SERVERS 
                    await runBuyCommodityProducer({address,amount,date})

                    response.status(responseStatusCode.CREATED).json({
                        status: responseStatus.SUCCESS,
                        message,
                    });
                } else {
                    await buyCommodity(address,amount,date)

                    //// SEND AN EVENT TO THE OTHER SERVERS 
                    try{
                        await runBuyCommodityProducer({address,amount,date})
                    }
                    catch(err){
                        console.log("Error from other servers",err)
                    }
                 

                    response.status(responseStatusCode.CREATED).json({
                        status: responseStatus.SUCCESS,
                        message,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:String(err),
                });
            }
        }
    );

    /////////////////////////////////////////// BUY COMMODITY WITH BANK CARD ///////////////////////////////////

    router.post(
        "/tx/buy",
        async (request: express.Request, response: express.Response) => {}
    );
};
