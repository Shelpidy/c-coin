import type { EmailParameter } from "./Utils.d";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import { Commodity } from "../models/Commodities";
import { CommodityTransaction } from "../models/ComTransactions";
import { CommodityUser } from "../models/ComUsers";
import { v4 } from "uuid";
import { CommodityNotificationDetail } from "../models/ComNotificationDetails";
import { CommodityNotification } from "../models/ComNotifications";
import NotificationService from "../services/NotificationService";
import { compareSync } from "bcrypt";
import CommodityProduct from "../models/ComProducts";
import { CommodityProductSale } from "../models/ComProductSales";

let notification = new NotificationService();

dotenv.config();

export async function generateAccountNumber(id: string | any) {
    let numOfDigit: number = String(id).length;
    if (numOfDigit === 2) {
        return numOfDigit.toString() + "COM" + (id * 100000000).toString();
    } else if (numOfDigit === 3) {
        return numOfDigit.toString() + "COM" + (id * 10000000).toString();
    } else if (numOfDigit === 4) {
        return numOfDigit.toString() + "COM" + (id * 1000000).toString();
    } else if (numOfDigit === 5) {
        return numOfDigit.toString() + "COM" + (id * 100000).toString();
    } else if (numOfDigit === 6) {
        return numOfDigit.toString() + "COM" + (id * 10000).toString();
    } else if (numOfDigit === 7) {
        return numOfDigit.toString() + "COM" + (id * 1000).toString();
    } else if (numOfDigit === 8) {
        return numOfDigit.toString() + "COM" + (id * 100).toString();
    } else if (numOfDigit === 9) {
        return numOfDigit.toString() + "COM" + (id * 10).toString();
    } else if (numOfDigit === 10) {
        return numOfDigit.toString() + "COM" + id.toString();
    } else {
        return numOfDigit.toString() + "COM" + (id * 1000000000).toString();
    }
}

export async function getIdFromAccountNumber(accountNumber: any | string) {
    let c = accountNumber.split("COM")[1];
    let numOfDigit: number = parseInt(accountNumber.split("COM")[0]);
    if (numOfDigit === 2) {
        return c / 100000000;
    } else if (numOfDigit === 3) {
        return c / 10000000;
    } else if (numOfDigit === 4) {
        return c / 1000000;
    } else if (numOfDigit === 5) {
        return c / 100000;
    } else if (numOfDigit === 6) {
        return c / 10000;
    } else if (numOfDigit === 7) {
        return c / 1000;
    } else if (numOfDigit === 8) {
        return c / 100;
    } else if (numOfDigit === 9) {
        return c / 10;
    } else if (numOfDigit === 10) {
        return c;
    } else {
        return c / 1000000000;
    }
    // return parseInt(c);
}

export async function smsConfirmationMessage() {
    let randCode = Math.floor(Math.random() * (9999 - 1000) + 10000);
    return {
        message: `Confirmation Code:${randCode}
Thank you for accessing Mexu Commodity Service (MCS).To confirm that you the owner of this phone number, copy the confirmation code given above and paste to the field provided.
    `,
        code: randCode,
    };
}

export async function generateEmailHTML({
    displayRandomCode,
    body,
    heading,
    title,
}: EmailParameter) {
    let randCode = Math.floor(Math.random() * (99999 - 10000) + 100000);
    if (displayRandomCode) {
        return {
            htmlPath: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap" rel="stylesheet">
       
            <title>MEXU|MAIL</title>
        </head>
        <body style="padding: 4px;font-family: 'Poppins', sans-serif;">
            <div>
                <h2 style="text-align: center;color:#18246b;">Email Confirmation</h2>
                <div style="height: 300px;">
                    <h3 style="text-align: center;font-family: 'Poppins', sans-serif;color:#18246b;font-weight:bold;font-size:16px;">Mexu Commodity Service (MCS)</h3>
                    <p style='text-align:center;font-family: "Poppins", sans-serif;color:#182444;letter-spacing:2px;font-size:16px;' >
                        Thank you for accessing Mexu Commodity Service.To confirm that you are owner of this email,use to confirmation code below to continue validating your account.
                    </p>
                    <h1 style="color:#18246b;text-align:center;letter-spacing:4px;">${randCode}</h1>     
                </div>
            </div>    
        </body>
        </html>`,
            code: randCode,
        };
    } else {
        return {
            htmlPath: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Bungee+Inline" rel="stylesheet">
       
            <title>MEXU|MAIL</title>
        </head>
        <body style="padding: 4px;font-family: serif">
            <div>
                <h2 style="text-align: center;color:#000;opacity:0.7">${title}</h2>
                <div style="background-color:#000;height: 300px;padding: 8px;">
                    <h3 style="color:white;text-align: center;">${heading}</h3>
                    <p style='text-align:center; font-family:serif;color:white;letter-spacing:2px;' >
                       ${body}
                    </p>     
                </div>
            </div>    
        </body>
        </html>`,
            code: null,
        };
    }
}

export async function jwtEncode(data: any) {
    let encodedData = jwt.sign(data, process.env.APP_SECRET_KEY + "");
    return encodedData;
}

export async function jwtDecode(token: string) {
    let decodedData = jwt.decode(token);
    return decodedData;
}

export async function encryptBankCardNumber(data: any) {
    let encryptedData = jwt.sign(data, process.env.APP_SECRET_KEY + "");
    return encryptedData;
}

export async function decryptBankCardNumber(token: string) {
    let decryptedData = jwt.decode(token);
    return decryptedData;
}

export async function hashData(_data: any) {
    let data = String(_data)
    let salt = await bcrypt.genSalt(10);
    let encryptedData = await bcrypt.hash(data, salt);
    return encryptedData;
}

export async function matchWithHashedData(_data: any, hashedData: string) {
    let data = String(_data)
    let isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
}

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
    transfereeAccountNumber: string;
    transferorAccountNumber: string;
    amount: number;
};


export const buyCommodity = async(userId:any,amount:number)=>{
    try{
        let commodity = await Commodity.findByPk(userId)
        let notificationBody = `You have seccessfully bought an amount of ${amount}`;
        let notificationTitle = 'Commodity'
        if(commodity){
        let newCommodity =  await commodity.increment("balance",{by:Number(amount)})
        await CommodityNotification.create({
                                    userId,
                                    notificationFrom:userId,
                                    message: notificationBody,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                });
        await notification.sendNotification()
        
    }
    else{
        await Commodity.create({balance:amount,userId})
        await CommodityNotification.create({
                                    userId,
                                    notificationFrom:userId,
                                    message: notificationBody,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                });
        await notification.sendNotification()
    }

    }catch(err){
        throw err
    }
   

    
    
}

export const transferCommodity = async (
    request: express.Request,
    response: express.Response,
    commodityObj: TransferCommodityParams
) => {
    try {
        let {
            transfereeAccountNumber,
            transferorAccountNumber,
            amount: _amount,
        } = commodityObj;
        let amount = Math.abs(_amount);
        let transfereeId = (
            await CommodityUser.findOne({
                where: { accountNumber: transfereeAccountNumber },
            })
        )?.getDataValue("id");
        let transferorId = (
            await CommodityUser.findOne({
                where: { accountNumber: transferorAccountNumber },
            })
        )?.getDataValue("id");
        if (!transfereeId) {
            response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                status: responseStatus.UNPROCESSED,
                message: `The transferee account number ${transfereeAccountNumber} does not exist.`,
            });
            return;
        }

        if (!transferorId) {
            response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                status: responseStatus.UNPROCESSED,
                message: `The transferor account number ${transferorAccountNumber} does not exist.`,
            });
            return;
        }

        // let transfereeNotificationTokens = JSON.parse((await CommodityNotificationDetail.findOne({where:{userId:transfereeAccountNumber}}))?.getDataValue("notificationToken"))
        let transfereeNotificationBody = `You have seccessfully received an amount of ${amount} from an account ${transferorAccountNumber}`;
        let transferorNotificationBody = `You have seccessfully sent an amount of ${amount} to the account number ${transfereeAccountNumber}`;
        let responseMessage = `You have seccessfully sent an amount of ${amount} from the account number ${transferorAccountNumber} to the account number ${transfereeAccountNumber}`;

        let notificationTitle = "Transaction";

        let createdAt = new Date();
        try {
            let transfereeAcc = await Commodity.findOne({
                where: { userId: transfereeId },
            });
            let transferorAcc = await Commodity.findOne({
                where: { userId: transferorId },
            });
            if (transferorAcc) {
                let balance: number = Number(transferorAcc.get("balance"));
                console.log(balance);
                if (balance >= amount) {
                    if (transfereeAcc) {
                        let newTransfereeBalance;
                        let newTransferorBalance;
                        let transferorNotDetailRecord;
                        let transfereeNotDetailRecord;
                        let transactionRecord;
                        try {
                            newTransfereeBalance =
                                await transfereeAcc.increment("balance", {
                                    by: amount,
                                });
                            newTransferorBalance =
                                await transferorAcc.decrement("balance", {
                                    by: amount,
                                });
                            let transactionId = v4();
                            console.log("Transaction ID: ", transactionId);
                            transactionRecord = new CommodityTransaction({
                                transfereeAccountNumber,
                                transferorAccountNumber,
                                amount: String(amount),
                                transactionId,
                                createdAt,
                            });
                            transferorNotDetailRecord =
                                new CommodityNotification({
                                    userId: transferorId,
                                    notificationFrom: transfereeId,
                                    message: transferorNotificationBody,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                    createdAt,
                                });
                            transfereeNotDetailRecord =
                                new CommodityNotification({
                                    userId: transfereeId,
                                    notificationFrom: transferorId,
                                    message: transfereeNotificationBody,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                    createdAt,
                                });

                            let transfereeBalance =
                                await newTransfereeBalance.save();
                            let transferorBalance =
                                await newTransferorBalance.save();
                            await transactionRecord.save();
                            await transferorNotDetailRecord.save();
                            await transfereeNotDetailRecord.save();
                            await notification.sendNotification();

                            response.status(responseStatusCode.ACCEPTED).json({
                                status: responseStatus.SUCCESS,
                                message: responseMessage,
                                data: {
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
                            await transferorNotDetailRecord?.reload();
                            await transfereeNotDetailRecord?.reload();
                            response
                                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                                .json({
                                    status: responseStatus.UNPROCESSED,
                                    data: err,
                                });
                        }
                    } else {
                        let newTransfereeBalance;
                        let newTransferorBalance;
                        let transferorNotDetailRecord;
                        let transfereeNotDetailRecord;
                        let transactionRecord;

                        try {
                            newTransfereeBalance = new Commodity({
                                userId: transfereeId,
                                balance: amount,
                                createdAt,
                            });
                            newTransferorBalance =
                                await transferorAcc.decrement("balance", {
                                    by: amount,
                                });
                            let transactionId = v4();
                            console.log("Transaction ID: ", transactionId);
                            transactionRecord = new CommodityTransaction({
                                transfereeAccountNumber,
                                transferorAccountNumber,
                                amount: String(amount),
                                transactionId,
                                createdAt,
                            });
                            transferorNotDetailRecord =
                                new CommodityNotification({
                                    userId: transferorId,
                                    message: transferorNotificationBody,
                                    title: "Transaction",
                                    createdAt,
                                });
                            transfereeNotDetailRecord =
                                new CommodityNotification({
                                    userId: transfereeId,
                                    message: transfereeNotificationBody,
                                    title: "Transaction",
                                    createdAt,
                                });

                            let _newTransfereeBalance =
                                await newTransfereeBalance.save();
                            let _newTransferorBalance =
                                await newTransferorBalance.save();
                            await transactionRecord.save();
                            await transferorNotDetailRecord.save();
                            await transfereeNotDetailRecord.save();
                            await notification.sendNotification();

                            response.status(responseStatusCode.ACCEPTED).json({
                                status: responseStatus.SUCCESS,
                                message: responseMessage,
                                data: {
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
                            await transferorNotDetailRecord?.reload();
                            await transfereeNotDetailRecord?.reload();
                            response
                                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                                .json({
                                    status: responseStatus.UNPROCESSED,
                                    data: err,
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
                response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                    status: responseStatus.UNPROCESSED,
                    message: `Transferor account with ${transferorId} have C 0.00 balance`,
                });
            }
        } catch (err) {
            console.log(err);
            response.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    } catch (err) {
        console.log(err);
        response.status(responseStatusCode.BAD_REQUEST).json({
            status: responseStatus.ERROR,
            data: err,
        });
    }
};

type MakePurchaseParams = {
    productId: number;
    affiliateId?: number;
    userId: number;
    buyerId: number;
};

export const makePurchacePayment = async (
    request: express.Request,
    response: express.Response,
    commodityObj: MakePurchaseParams
) => {
    try {
        let affiliateId = commodityObj?.affiliateId;
        let { productId, userId, buyerId } = commodityObj;
        let product = await CommodityProduct.findOne({
            where: { id: productId },
        });
        if (!product) {
            return response
                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                .json(
                    getResponseBody(
                        responseStatus.UNATHORIZED,
                        "You have insufficient amount"
                    )
                );
        }
        console.log(product?.dataValues);
        let price = Number(product?.getDataValue("price"));
        let affiliatedPrice = Number(product?.getDataValue("affiliatePrice"));
        console.log(price, affiliatedPrice);
        let amount = affiliateId ? price - affiliatedPrice : price;
        let buyerBalance = (
            await Commodity.findOne({ where: { userId: buyerId } })
        )?.getDataValue("balance");
        if (buyerBalance < price) {
            response
                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                .json(
                    getResponseBody(
                        responseStatus.UNPROCESSED,
                        "Your balance is insufficient"
                    )
                );
            return;
        }
        let transfereeAccountNumber = (
            await CommodityUser.findOne({ where: { id: userId } })
        )?.getDataValue("accountNumber");
        if (!transfereeAccountNumber) {
            response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                status: responseStatus.UNPROCESSED,
                message: `The transferor account number ${transfereeAccountNumber} does not exist.`,
            });
            return;
        }
        let transferorAccountNumber = (
            await CommodityUser.findOne({ where: { id: buyerId } })
        )?.getDataValue("accountNumber");
        if (!transferorAccountNumber) {
            response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                status: responseStatus.UNPROCESSED,
                message: `The transferor account number ${transferorAccountNumber} does not exist.`,
            });
            return;
        }
        let affiliateAccountNumber = null;
        if (commodityObj.affiliateId) {
            affiliateAccountNumber = (
                await CommodityUser.findOne({
                    where: { id: commodityObj.affiliateId },
                })
            )?.getDataValue("accountNumber");
        }

        let transfereeId = (
            await CommodityUser.findOne({
                where: { accountNumber: transfereeAccountNumber },
            })
        )?.getDataValue("id");
        let transferorId = (
            await CommodityUser.findOne({
                where: { accountNumber: transferorAccountNumber },
            })
        )?.getDataValue("id");
        if (!transfereeId) {
            response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                status: responseStatus.UNPROCESSED,
                message: `The transferee account number ${transfereeAccountNumber} does not exist.`,
            });
            return;
        }

        if (!transferorId) {
            response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                status: responseStatus.UNPROCESSED,
                message: `The transferor account number ${transferorAccountNumber} does not exist.`,
            });
            return;
        }

        // let transfereeNotificationTokens = JSON.parse((await CommodityNotificationDetail.findOne({where:{userId:transfereeAccountNumber}}))?.getDataValue("notificationToken"))
        let transfereeNotificationBody = `You have seccessfully received an amount of ${amount} from an account ${transferorAccountNumber} for a product bought`;
        let affiliateNotificationBody = `You have seccessfully received an amount of ${affiliatedPrice} from an account ${transferorAccountNumber} for your affiliated product bought`;
        let transferorNotificationBody = `You have seccessfully sent an amount of ${amount} to the account number ${transfereeAccountNumber} and an amount of ${affiliatedPrice} to the account number ${affiliateAccountNumber}`;
        let responseMessage = affiliateId
            ? `You have seccessfully sent an amount of ${amount} from the account number ${transferorAccountNumber} to the account numbers ${transfereeAccountNumber} and amount of ${affiliatedPrice} to ${affiliateAccountNumber} for buying a product`
            : `You have seccessfully sent an amount of ${amount} from the account number ${transferorAccountNumber} to the account numbers ${transfereeAccountNumber} for buying a product`;

        let notificationTitle = "Buy Transaction";

        let createdAt = new Date();
        try {
            let transfereeAcc = await Commodity.findOne({
                where: { userId: transfereeId },
            });
            let transferorAcc = await Commodity.findOne({
                where: { userId: transferorId },
            });
            let affiliateAcc = await Commodity.findOne({
                where: { userId: affiliateId },
            });
            if (transferorAcc) {
                let balance: number = Number(transferorAcc.get("balance"));
                console.log(balance);
                if (balance >= amount) {
                    if (transfereeAcc) {
                        let newTransfereeBalance;
                        let newTransferorBalance;
                        let newAffiliateBalance;
                        let transferorNotDetailRecord;
                        let transfereeNotDetailRecord;
                        let affiliateNotDetailRecord;
                        let transactionRecord;
                        try {
                            newTransfereeBalance =
                                await transfereeAcc.increment("balance", {
                                    by: amount,
                                });
                            if (affiliateAcc) {
                                newAffiliateBalance =
                                    await affiliateAcc.increment("balance", {
                                        by: affiliatedPrice,
                                    });
                            } else if (affiliateId) {
                                newAffiliateBalance = await Commodity.create({
                                    balance: affiliatedPrice,
                                    userId: affiliateId,
                                    createdAt,
                                });
                            }

                            newTransferorBalance =
                                await transferorAcc.decrement("balance", {
                                    by: amount,
                                });
                            let transactionId = v4();
                            let transactionId2 = v4() + "1";
                            console.log("Transaction ID:", transactionId);

                            let createdList = newAffiliateBalance
                                ? [
                                      {
                                          transfereeAccountNumber,
                                          transferorAccountNumber,
                                          amount: String(amount),
                                          transactionId,
                                          createdAt,
                                      },
                                      {
                                          transfereeAccountNumber:
                                              affiliateAccountNumber,
                                          transferorAccountNumber,
                                          amount: String(affiliatedPrice),
                                          transactionId2,
                                          createdAt,
                                      },
                                  ]
                                : [
                                      {
                                          transfereeAccountNumber,
                                          transferorAccountNumber,
                                          amount: String(amount),
                                          transactionId,
                                          createdAt,
                                      },
                                  ];

                            transactionRecord =
                                await CommodityTransaction.bulkCreate(
                                    createdList
                                );

                            transferorNotDetailRecord =
                                new CommodityNotification({
                                    userId: transferorId,
                                    message: transferorNotificationBody,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                    notificationFrom: productId,
                                    createdAt,
                                });

                            transfereeNotDetailRecord =
                                new CommodityNotification({
                                    userId: transfereeId,
                                    message: transfereeNotificationBody,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                    notificationFrom: productId,
                                    createdAt,
                                });
                            if (affiliateId) {
                                affiliateNotDetailRecord =
                                    new CommodityNotification({
                                        userId: affiliateId,
                                        message: affiliateNotificationBody,
                                        title: notificationTitle,
                                        notificationType: "transaction",
                                        notificationFrom: productId,
                                        createdAt,
                                    });
                            }

                            let transfereeBalance =
                                await newTransfereeBalance.save();
                            let transferorBalance =
                                await newTransferorBalance.save();
                            let affiliateBalance =
                                await newAffiliateBalance?.save();
                            // await transactionRecord.save();
                            await transferorNotDetailRecord.save();
                            await transfereeNotDetailRecord.save();
                            await affiliateNotDetailRecord?.save();

                            if (affiliateId) {
                                let sale = await CommodityProductSale.create({
                                    sellerId: affiliateId,
                                    productId,
                                    userId,
                                    saleType: "affiliate",
                                    createdAt,
                                });
                                await sale.save();
                            } else {
                                let sale = await CommodityProductSale.create({
                                    sellerId: userId,
                                    productId,
                                    userId,
                                    saleType: "owner",
                                    createdAt,
                                });
                                await sale.save();
                            }

                            await notification.sendNotification();

                            response.status(responseStatusCode.ACCEPTED).json({
                                status: responseStatus.SUCCESS,
                                message: responseMessage,
                                data: {
                                    transferorBalance: {
                                        ...transferorBalance.dataValues,
                                        balance:
                                            transferorBalance.getDataValue(
                                                "balance"
                                            ) - amount,
                                    },
                                    affiliateBalance: affiliateId
                                        ? {
                                              ...affiliateBalance?.dataValues,
                                              balance:
                                                  affiliateBalance?.getDataValue(
                                                      "balance"
                                                  ) + affiliatedPrice,
                                          }
                                        : {},
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
                            // await transactionRecord?.reload();
                            await transferorNotDetailRecord?.reload();
                            await transfereeNotDetailRecord?.reload();
                            await affiliateNotDetailRecord?.reload();
                            response
                                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                                .json({
                                    status: responseStatus.UNPROCESSED,
                                    data: err,
                                });
                        }
                    } else {
                        let newTransfereeBalance;
                        let newAffiliateBalance;
                        let newTransferorBalance;
                        let transferorNotDetailRecord;
                        let transfereeNotDetailRecord;
                        let affiliateNotDetailRecord;
                        let transactionRecord;

                        try {
                            newTransfereeBalance = new Commodity({
                                userId: transfereeId,
                                balance: amount,
                                createdAt,
                            });
                            if (affiliateAcc) {
                                newAffiliateBalance =
                                    await affiliateAcc.increment("balance", {
                                        by: affiliatedPrice,
                                    });
                            } else if (affiliateId) {
                                newAffiliateBalance = await Commodity.create({
                                    balance: affiliatedPrice,
                                    userId: affiliateId,
                                    createdAt,
                                });
                            }
                            // newAffiliateBalance = new Commodity({
                            //     userId: transfereeId,
                            //     balance: affiliatedPrice,
                            //     createdAt,
                            // });
                            newTransferorBalance =
                                await transferorAcc.decrement("balance", {
                                    by: amount,
                                });
                            let transactionId = v4();
                            let transactionId2 = v4() + "1";
                            console.log("Transaction ID: ", transactionId);
                            let createdList = newAffiliateBalance
                                ? [
                                      {
                                          transfereeAccountNumber,
                                          transferorAccountNumber,
                                          amount: String(amount),
                                          transactionId,
                                          createdAt,
                                      },
                                      {
                                          transfereeAccountNumber:
                                              affiliateAccountNumber,
                                          transferorAccountNumber,
                                          amount: String(affiliatedPrice),
                                          transactionId2,
                                          createdAt,
                                      },
                                  ]
                                : [
                                      {
                                          transfereeAccountNumber,
                                          transferorAccountNumber,
                                          amount: String(amount),
                                          transactionId,
                                          createdAt,
                                      },
                                  ];
                            transactionRecord =
                                await CommodityTransaction.bulkCreate(
                                    createdList
                                );
                            transferorNotDetailRecord =
                                new CommodityNotification({
                                    userId: transferorId,
                                    message: transferorNotificationBody,
                                    notificationFrom: productId,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                    createdAt,
                                });
                            transfereeNotDetailRecord =
                                new CommodityNotification({
                                    userId: transfereeId,
                                    message: transfereeNotificationBody,
                                    notificationFrom: productId,
                                    title: notificationTitle,
                                    notificationType: "transaction",
                                    createdAt,
                                });
                            if (affiliateId) {
                                affiliateNotDetailRecord =
                                    new CommodityNotification({
                                        userId: affiliateId,
                                        message: affiliateNotificationBody,
                                        notificationFrom: productId,
                                        title: notificationTitle,
                                        notificationType: "transaction",
                                        createdAt,
                                    });
                            }

                            let _newTransfereeBalance =
                                await newTransfereeBalance.save();
                            let _newTransferorBalance =
                                await newTransferorBalance.save();
                            let _newAffiliateBalance =
                                await newAffiliateBalance?.save();
                            // await transactionRecord.save();
                            await transferorNotDetailRecord.save();
                            await transfereeNotDetailRecord.save();
                            if (affiliateId) {
                                let sale = await CommodityProductSale.create({
                                    sellerId: affiliateId,
                                    productId,
                                    userId,
                                    saleType: "affiliate",
                                    createdAt,
                                });
                                await sale.save();
                            } else {
                                let sale = await CommodityProductSale.create({
                                    sellerId: userId,
                                    productId,
                                    userId,
                                    saleType: "owner",
                                    createdAt,
                                });
                                await sale.save();
                            }
                            await notification.sendNotification();

                            response.status(responseStatusCode.ACCEPTED).json({
                                status: responseStatus.SUCCESS,
                                message: responseMessage,
                                data: {
                                    transferorBalance: {
                                        ..._newTransferorBalance.dataValues,
                                        balance:
                                            _newTransferorBalance.getDataValue(
                                                "balance"
                                            ),
                                    },
                                    affiliateBalance: affiliateId
                                        ? {
                                              ..._newAffiliateBalance?.dataValues,
                                              balance:
                                                  _newAffiliateBalance?.getDataValue(
                                                      "balance"
                                                  ) + affiliatedPrice,
                                          }
                                        : {},
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
                            await newAffiliateBalance?.reload();
                            // await transactionRecord?.reload();
                            await transferorNotDetailRecord?.reload();
                            await transfereeNotDetailRecord?.reload();
                            response
                                .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                                .json({
                                    status: responseStatus.UNPROCESSED,
                                    data: err,
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
                response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                    status: responseStatus.UNPROCESSED,
                    message: `Transferor account with ${transferorId} have C 0.00 balance`,
                });
            }
        } catch (err) {
            console.log(err);
            response.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    } catch (err) {
        console.log(err);
        response.status(responseStatusCode.BAD_REQUEST).json({
            status: responseStatus.ERROR,
            data: err,
        });
    }
};
