import type { EmailParameter } from "./Utils.d";
import dotenv from "dotenv";
import { Commodity } from "../models/Commodities";
import { CommodityTransaction } from "../models/ComTransactions";
import cryptoJs from "crypto-js"


dotenv.config();

export async function getPhoneNumberCompany(
    phoneNumber: string
): Promise<"africell" | "orange" | "qcell"> {
    let code = phoneNumber.slice(0, 6);
    // console.log(code);
    let companiesCode: Record<string, string[]> = {
        africell: [
            "+23277",
            "+23233",
            "+23230",
            "+23288",
            "+23299",
            "+23270",
            "+23280",
            "+23290",
        ],
        orange: [
            "+23271",
            "+23272",
            "+23273",
            "+23274",
            "+23275",
            "+23276",
            "+23278",
            "+23279",
        ],
        qcell: ["+23231", "+23232", "+23234"],
    };
    for (let key of Object.keys(companiesCode)) {
        let codes = companiesCode[key];
        if (codes.includes(code)) {
            return key == "africell"
                ? "africell"
                : key == "qcell"
                ? "qcell"
                : "orange";
        }
    }
    return "qcell";
}

export const getResponseBody = (
    status: string,
    message?: string,
    data?: any
) => {
    return {
        status,
        message,
        data,
    };
};

export const responseStatusCode = {
    UNATHORIZED: 401,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    DELETED:203,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNPROCESSIBLE_ENTITY: 422,
};

export const responseStatus = {
    SUCCESS: "success",
    ERROR: "error",
    UNATHORIZED: "unathorized",
    WARNING: "warning",
    UNPROCESSED: "unprocessed",
};

type TransferCommodityParams = {
    recipientAddress: string;
    senderAddress: string;
    amount: number;
    date:Date
};


export const buyCommodity = async(address:number|string,amount:number,date:Date)=>{
    try{
        let commodity = await Commodity.findOne({where:{address}})
        // let notificationBody = `You have seccessfully bought an amount of ${amount}`;
        // let notificationTitle = 'Commodity'
        if(commodity){
        let newCommodity =  await commodity.increment("balance",{by:Number(amount)})
        let transObj = {
            recipientAddress:address,
            senderAddress:"mexu",
            amount: String(amount),
            createdAt:date
        }
        let previousTransactionHash = (await CommodityTransaction.findOne({
            order:[["createdAt","DESC"]]
        }))?.getDataValue("hash")
        let hash = cryptoJs.SHA256(JSON.stringify(transObj)).toString();
        console.log("Transaction Hash: ", hash);
        await CommodityTransaction.create({
            recipientAddress:address,
            senderAddress:"mexu",
            amount: String(amount),
            hash,
            previousTransactionHash,
            createdAt:date,
        });

        //SEND A NOTIFICATION CREATION EVENT


        // await CommodityNotification.create({
        //                             userId,
        //                             notificationFrom:userId,
        //                             message: notificationBody,
        //                             title: notificationTitle,
        //                             notificationType: "transaction",
        //                         });
        // await notification.sendNotification()
        
    }
    else{
        await Commodity.create({balance:amount,address})
        let transObj = {
            recipientAddress:address,
            senderAddress:"mexu",
            amount: String(amount),
            createdAt:date
        }
        let previousTransactionHash = (await CommodityTransaction.findOne({
            order:[["createdAt","DESC"]]
        }))?.getDataValue("hash")
        let hash = cryptoJs.SHA256(JSON.stringify(transObj)).toString();
        console.log("Transaction Hash: ", hash);
        await CommodityTransaction.create({
            recipientAddress:address,
            senderAddress:"mexu",
            amount: String(amount),
            hash,
            previousTransactionHash,
            createdAt:date,
        });
        // await CommodityNotification.create({
        //                             userId,
        //                             notificationFrom:userId,
        //                             message: notificationBody,
        //                             title: notificationTitle,
        //                             notificationType: "transaction",
        //                         });
        // await notification.sendNotification()
    }

    }catch(err){
        throw err
    }
      
}


export function hasPassedOneMonth(date: Date): boolean {
    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    return date < oneMonthAgo;
  }
  
  // Example usage
  const inputDate = new Date("2023-06-01");
  const result = hasPassedOneMonth(inputDate);
  console.log(result); // true or false
  


export const transferCommodity = async (
    commodityObj: TransferCommodityParams
) => {
    try {
        let {
            recipientAddress,
            senderAddress,
            amount: _amount,
            date
        } = commodityObj;
        let amount = Math.abs(_amount);
       
        let responseMessage = `You have seccessfully sent an amount of ${amount} from the account number ${senderAddress} to the account number ${recipientAddress}`;

        // let notificationTitle = "Transaction";

        // let createdAt = new Date();
        try {
            let recipientAcc = await Commodity.findOne({
                where: { address: recipientAddress },
            });
            let senderAcc = await Commodity.findOne({
                where: { address: senderAddress },
            });
            if (senderAcc) {
                let balance: number = Number(senderAcc.get("balance"));
                console.log(balance);
                if (balance >= amount) {
                    if (recipientAcc) {
                        let newTransfereeBalance;
                        let newTransferorBalance;
                        // let transferorNotDetailRecord;
                        // let transfereeNotDetailRecord;
                        let transactionRecord;
                        try {
                            newTransfereeBalance =
                                await recipientAcc.increment("balance", {
                                    by: amount,
                                });
                            newTransferorBalance =
                                await senderAcc.decrement("balance", {
                                    by: amount,
                                });
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
                         
                           
                        } catch (err) {
                            console.log(err);
                            await newTransfereeBalance?.reload();
                            await newTransfereeBalance?.reload();
                            await transactionRecord?.reload();
                            // await transferorNotDetailRecord?.reload();
                            // await transfereeNotDetailRecord?.reload();
                          
                        }
                    } else {
                        let newTransfereeBalance;
                        let newTransferorBalance;
                        let transferorNotDetailRecord;
                        let transfereeNotDetailRecord;
                        let transactionRecord;

                        try {
                            newTransfereeBalance = new Commodity({
                                address: recipientAddress,
                                balance: amount,
                                date,
                            });
                            newTransferorBalance =
                                await senderAcc.decrement("balance", {
                                    by: amount,
                                });
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
                          
                           
                        } catch (err) {
                            console.log(err);
                            await newTransfereeBalance?.reload();
                            await newTransfereeBalance?.reload();
                            await transactionRecord?.reload();  
                        }
                    }
                }else {
                   throw new Error(`You have insufficinet amount to transfer the amount ${amount}`)
                      
                }
            } else {
                throw new Error(`Transferor account with ${senderAddress} have C 0.00 balance`)
               
            }
        } catch (err) {
            throw new Error(String(err))
        }
    } catch (err) {
        console.log(err);
        throw new Error(String(err))
    }
};

type MakePurchaseParams = {
    productId: number;
    affiliateId?: number;
    userId: number;
    buyerId: number;
};

// export const makePurchacePayment = async (
//     request: express.Request,
//     response: express.Response,
//     commodityObj: MakePurchaseParams
// ) => {
//     try {
//         let affiliateId = commodityObj?.affiliateId;
//         let { productId, userId, buyerId } = commodityObj;
//         let product = await CommodityProduct.findOne({
//             where: { id: productId },
//         });
//         if (!product) {
//             return response
//                 .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
//                 .json(
//                     getResponseBody(
//                         responseStatus.UNATHORIZED,
//                         "You have insufficient amount"
//                     )
//                 );
//         }
//         console.log(product?.dataValues);
//         let price = Number(product?.getDataValue("price"));
//         let affiliatedPrice = Number(product?.getDataValue("affiliatePrice"));
//         console.log(price, affiliatedPrice);
//         let amount = affiliateId ? price - affiliatedPrice : price;
//         let buyerBalance = (
//             await Commodity.findOne({ where: { userId: buyerId } })
//         )?.getDataValue("balance");
//         if (buyerBalance < price) {
//             response
//                 .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
//                 .json(
//                     getResponseBody(
//                         responseStatus.UNPROCESSED,
//                         "Your balance is insufficient"
//                     )
//                 );
//             return;
//         }
//         let recipientAddress = (
//             await CommodityUser.findOne({ where: { id: userId } })
//         )?.getDataValue("accountNumber");
//         if (!recipientAddress) {
//             response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
//                 status: responseStatus.UNPROCESSED,
//                 message: `The transferor account number ${recipientAddress} does not exist.`,
//             });
//             return;
//         }
//         let senderAddress = (
//             await CommodityUser.findOne({ where: { id: buyerId } })
//         )?.getDataValue("accountNumber");
//         if (!senderAddress) {
//             response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
//                 status: responseStatus.UNPROCESSED,
//                 message: `The transferor account number ${senderAddress} does not exist.`,
//             });
//             return;
//         }
//         let affiliateAccountNumber = null;
//         if (commodityObj.affiliateId) {
//             affiliateAccountNumber = (
//                 await CommodityUser.findOne({
//                     where: { id: commodityObj.affiliateId },
//                 })
//             )?.getDataValue("accountNumber");
//         }

//         let transfereeId = (
//             await CommodityUser.findOne({
//                 where: { accountNumber: recipientAddress },
//             })
//         )?.getDataValue("id");
//         let transferorId = (
//             await CommodityUser.findOne({
//                 where: { accountNumber: senderAddress },
//             })
//         )?.getDataValue("id");
//         if (!transfereeId) {
//             response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
//                 status: responseStatus.UNPROCESSED,
//                 message: `The transferee account number ${recipientAddress} does not exist.`,
//             });
//             return;
//         }

//         if (!transferorId) {
//             response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
//                 status: responseStatus.UNPROCESSED,
//                 message: `The transferor account number ${senderAddress} does not exist.`,
//             });
//             return;
//         }

//         // let transfereeNotificationTokens = JSON.parse((await CommodityNotificationDetail.findOne({where:{userId:recipientAddress}}))?.getDataValue("notificationToken"))
//         let transfereeNotificationBody = `You have seccessfully received an amount of ${amount} from an account ${senderAddress} for a product bought`;
//         let affiliateNotificationBody = `You have seccessfully received an amount of ${affiliatedPrice} from an account ${senderAddress} for your affiliated product bought`;
//         let transferorNotificationBody = `You have seccessfully sent an amount of ${amount} to the account number ${recipientAddress} and an amount of ${affiliatedPrice} to the account number ${affiliateAccountNumber}`;
//         let responseMessage = affiliateId
//             ? `You have seccessfully sent an amount of ${amount} from the account number ${senderAddress} to the account numbers ${recipientAddress} and amount of ${affiliatedPrice} to ${affiliateAccountNumber} for buying a product`
//             : `You have seccessfully sent an amount of ${amount} from the account number ${senderAddress} to the account numbers ${recipientAddress} for buying a product`;

//         let notificationTitle = "Buy Transaction";

//         let createdAt = new Date();
//         try {
//             let recipientAcc = await Commodity.findOne({
//                 where: { userId: transfereeId },
//             });
//             let senderAcc = await Commodity.findOne({
//                 where: { userId: transferorId },
//             });
//             let affiliateAcc = await Commodity.findOne({
//                 where: { userId: affiliateId },
//             });
//             if (senderAcc) {
//                 let balance: number = Number(senderAcc.get("balance"));
//                 console.log(balance);
//                 if (balance >= amount) {
//                     if (recipientAcc) {
//                         let newTransfereeBalance;
//                         let newTransferorBalance;
//                         let newAffiliateBalance;
//                         let transferorNotDetailRecord;
//                         let transfereeNotDetailRecord;
//                         let affiliateNotDetailRecord;
//                         let transactionRecord;
//                         try {
//                             newTransfereeBalance =
//                                 await recipientAcc.increment("balance", {
//                                     by: amount,
//                                 });
//                             if (affiliateAcc) {
//                                 newAffiliateBalance =
//                                     await affiliateAcc.increment("balance", {
//                                         by: affiliatedPrice,
//                                     });
//                             } else if (affiliateId) {
//                                 newAffiliateBalance = await Commodity.create({
//                                     balance: affiliatedPrice,
//                                     userId: affiliateId,
//                                     createdAt,
//                                 });
//                             }

//                             newTransferorBalance =
//                                 await senderAcc.decrement("balance", {
//                                     by: amount,
//                                 });
//                             let transactionId = v4();
//                             let transactionId2 = v4() + "1";
//                             console.log("Transaction ID:", transactionId);

//                             let createdList = newAffiliateBalance
//                                 ? [
//                                       {
//                                           recipientAddress,
//                                           senderAddress,
//                                           amount: String(amount),
//                                           transactionId,
//                                           createdAt,
//                                       },
//                                       {
//                                           recipientAddress:
//                                               affiliateAccountNumber,
//                                           senderAddress,
//                                           amount: String(affiliatedPrice),
//                                           transactionId2,
//                                           createdAt,
//                                       },
//                                   ]
//                                 : [
//                                       {
//                                           recipientAddress,
//                                           senderAddress,
//                                           amount: String(amount),
//                                           transactionId,
//                                           createdAt,
//                                       },
//                                   ];

//                             transactionRecord =
//                                 await CommodityTransaction.bulkCreate(
//                                     createdList
//                                 );

//                             transferorNotDetailRecord =
//                                 new CommodityNotification({
//                                     userId: transferorId,
//                                     message: transferorNotificationBody,
//                                     title: notificationTitle,
//                                     notificationType: "transaction",
//                                     notificationFrom: productId,
//                                     createdAt,
//                                 });

//                             transfereeNotDetailRecord =
//                                 new CommodityNotification({
//                                     userId: transfereeId,
//                                     message: transfereeNotificationBody,
//                                     title: notificationTitle,
//                                     notificationType: "transaction",
//                                     notificationFrom: productId,
//                                     createdAt,
//                                 });
//                             if (affiliateId) {
//                                 affiliateNotDetailRecord =
//                                     new CommodityNotification({
//                                         userId: affiliateId,
//                                         message: affiliateNotificationBody,
//                                         title: notificationTitle,
//                                         notificationType: "transaction",
//                                         notificationFrom: productId,
//                                         createdAt,
//                                     });
//                             }

//                             let transfereeBalance =
//                                 await newTransfereeBalance.save();
//                             let transferorBalance =
//                                 await newTransferorBalance.save();
//                             let affiliateBalance =
//                                 await newAffiliateBalance?.save();
//                             // await transactionRecord.save();
//                             await transferorNotDetailRecord.save();
//                             await transfereeNotDetailRecord.save();
//                             await affiliateNotDetailRecord?.save();

//                             if (affiliateId) {
//                                 let sale = await CommodityProductSale.create({
//                                     sellerId: affiliateId,
//                                     productId,
//                                     userId,
//                                     saleType: "affiliate",
//                                     createdAt,
//                                 });
//                                 await sale.save();
//                             } else {
//                                 let sale = await CommodityProductSale.create({
//                                     sellerId: userId,
//                                     productId,
//                                     userId,
//                                     saleType: "owner",
//                                     createdAt,
//                                 });
//                                 await sale.save();
//                             }

//                             await notification.sendNotification();

//                             response.status(responseStatusCode.ACCEPTED).json({
//                                 status: responseStatus.SUCCESS,
//                                 message: responseMessage,
//                                 data: {
//                                     transferorBalance: {
//                                         ...transferorBalance.dataValues,
//                                         balance:
//                                             transferorBalance.getDataValue(
//                                                 "balance"
//                                             ) - amount,
//                                     },
//                                     affiliateBalance: affiliateId
//                                         ? {
//                                               ...affiliateBalance?.dataValues,
//                                               balance:
//                                                   affiliateBalance?.getDataValue(
//                                                       "balance"
//                                                   ) + affiliatedPrice,
//                                           }
//                                         : {},
//                                     transfereeBalance: {
//                                         ...transfereeBalance.dataValues,
//                                         balance:
//                                             transfereeBalance.getDataValue(
//                                                 "balance"
//                                             ) + amount,
//                                     },
//                                 },
//                             });
//                         } catch (err) {
//                             console.log(err);
//                             await newTransfereeBalance?.reload();
//                             await newTransfereeBalance?.reload();
//                             // await transactionRecord?.reload();
//                             await transferorNotDetailRecord?.reload();
//                             await transfereeNotDetailRecord?.reload();
//                             await affiliateNotDetailRecord?.reload();
//                             response
//                                 .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
//                                 .json({
//                                     status: responseStatus.UNPROCESSED,
//                                     data: err,
//                                 });
//                         }
//                     } else {
//                         let newTransfereeBalance;
//                         let newAffiliateBalance;
//                         let newTransferorBalance;
//                         let transferorNotDetailRecord;
//                         let transfereeNotDetailRecord;
//                         let affiliateNotDetailRecord;
//                         let transactionRecord;

//                         try {
//                             newTransfereeBalance = new Commodity({
//                                 userId: transfereeId,
//                                 balance: amount,
//                                 createdAt,
//                             });
//                             if (affiliateAcc) {
//                                 newAffiliateBalance =
//                                     await affiliateAcc.increment("balance", {
//                                         by: affiliatedPrice,
//                                     });
//                             } else if (affiliateId) {
//                                 newAffiliateBalance = await Commodity.create({
//                                     balance: affiliatedPrice,
//                                     userId: affiliateId,
//                                     createdAt,
//                                 });
//                             }
//                             // newAffiliateBalance = new Commodity({
//                             //     userId: transfereeId,
//                             //     balance: affiliatedPrice,
//                             //     createdAt,
//                             // });
//                             newTransferorBalance =
//                                 await senderAcc.decrement("balance", {
//                                     by: amount,
//                                 });
//                             let transactionId = v4();
//                             let transactionId2 = v4() + "1";
//                             console.log("Transaction ID: ", transactionId);
//                             let createdList = newAffiliateBalance
//                                 ? [
//                                       {
//                                           recipientAddress,
//                                           senderAddress,
//                                           amount: String(amount),
//                                           transactionId,
//                                           createdAt,
//                                       },
//                                       {
//                                           recipientAddress:
//                                               affiliateAccountNumber,
//                                           senderAddress,
//                                           amount: String(affiliatedPrice),
//                                           transactionId2,
//                                           createdAt,
//                                       },
//                                   ]
//                                 : [
//                                       {
//                                           recipientAddress,
//                                           senderAddress,
//                                           amount: String(amount),
//                                           transactionId,
//                                           createdAt,
//                                       },
//                                   ];
//                             transactionRecord =
//                                 await CommodityTransaction.bulkCreate(
//                                     createdList
//                                 );
//                             transferorNotDetailRecord =
//                                 new CommodityNotification({
//                                     userId: transferorId,
//                                     message: transferorNotificationBody,
//                                     notificationFrom: productId,
//                                     title: notificationTitle,
//                                     notificationType: "transaction",
//                                     createdAt,
//                                 });
//                             transfereeNotDetailRecord =
//                                 new CommodityNotification({
//                                     userId: transfereeId,
//                                     message: transfereeNotificationBody,
//                                     notificationFrom: productId,
//                                     title: notificationTitle,
//                                     notificationType: "transaction",
//                                     createdAt,
//                                 });
//                             if (affiliateId) {
//                                 affiliateNotDetailRecord =
//                                     new CommodityNotification({
//                                         userId: affiliateId,
//                                         message: affiliateNotificationBody,
//                                         notificationFrom: productId,
//                                         title: notificationTitle,
//                                         notificationType: "transaction",
//                                         createdAt,
//                                     });
//                             }

//                             let _newTransfereeBalance =
//                                 await newTransfereeBalance.save();
//                             let _newTransferorBalance =
//                                 await newTransferorBalance.save();
//                             let _newAffiliateBalance =
//                                 await newAffiliateBalance?.save();
//                             // await transactionRecord.save();
//                             await transferorNotDetailRecord.save();
//                             await transfereeNotDetailRecord.save();
//                             if (affiliateId) {
//                                 let sale = await CommodityProductSale.create({
//                                     sellerId: affiliateId,
//                                     productId,
//                                     userId,
//                                     saleType: "affiliate",
//                                     createdAt,
//                                 });
//                                 await sale.save();
//                             } else {
//                                 let sale = await CommodityProductSale.create({
//                                     sellerId: userId,
//                                     productId,
//                                     userId,
//                                     saleType: "owner",
//                                     createdAt,
//                                 });
//                                 await sale.save();
//                             }
//                             await notification.sendNotification();

//                             response.status(responseStatusCode.ACCEPTED).json({
//                                 status: responseStatus.SUCCESS,
//                                 message: responseMessage,
//                                 data: {
//                                     transferorBalance: {
//                                         ..._newTransferorBalance.dataValues,
//                                         balance:
//                                             _newTransferorBalance.getDataValue(
//                                                 "balance"
//                                             ),
//                                     },
//                                     affiliateBalance: affiliateId
//                                         ? {
//                                               ..._newAffiliateBalance?.dataValues,
//                                               balance:
//                                                   _newAffiliateBalance?.getDataValue(
//                                                       "balance"
//                                                   ) + affiliatedPrice,
//                                           }
//                                         : {},
//                                     transfereeBalance: {
//                                         ..._newTransfereeBalance.dataValues,
//                                         balance:
//                                             _newTransfereeBalance.getDataValue(
//                                                 "balance"
//                                             ) + amount,
//                                     },
//                                 },
//                             });
//                         } catch (err) {
//                             console.log(err);
//                             await newTransfereeBalance?.reload();
//                             await newTransfereeBalance?.reload();
//                             await newAffiliateBalance?.reload();
//                             // await transactionRecord?.reload();
//                             await transferorNotDetailRecord?.reload();
//                             await transfereeNotDetailRecord?.reload();
//                             response
//                                 .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
//                                 .json({
//                                     status: responseStatus.UNPROCESSED,
//                                     data: err,
//                                 });
//                         }
//                     }
//                 } else {
//                     response
//                         .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
//                         .json({
//                             status: responseStatus.UNPROCESSED,
//                             message: `You have insufficinet amount to transfer the amount ${amount}`,
//                         });
//                 }
//             } else {
//                 response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
//                     status: responseStatus.UNPROCESSED,
//                     message: `Transferor account with ${transferorId} have C 0.00 balance`,
//                 });
//             }
//         } catch (err) {
//             console.log(err);
//             response.status(responseStatusCode.BAD_REQUEST).json({
//                 status: responseStatus.ERROR,
//                 data: err,
//             });
//         }
//     } catch (err) {
//         console.log(err);
//         response.status(responseStatusCode.BAD_REQUEST).json({
//             status: responseStatus.ERROR,
//             data: err,
//         });
//     }
// };
