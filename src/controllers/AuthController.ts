import {
    encryptBankCardNumber,
    generateAccountNumber,
    generateEmailHTML,
    getPhoneNumberCompany,
    hashData,
    jwtEncode,
    matchWithHashedData,
    responseStatus,
    responseStatusCode,
    smsConfirmationMessage,
} from "../utils/Utils";
import express from "express";
import { CommodityUser } from "../models/ComUsers";
import { CommodityUserContact } from "../models/ComUserContacts";
import MailService from "../services/MailService";
import { CommodityBankCardDetail } from "../models/ComBankCardDetails";
import { CommodityTransferee } from "../models/ComTransferees";
import SMS from "../services/SMS";
import { CommodityNotificationDetail } from "../models/ComNotificationDetails";
import CommodityFollower from "../models/ComFollowers";
import { CommodityProductSale } from "../models/ComProductSales";
import { CommodityProductAffiliate } from "../models/ComProductAffiliates";

export default (router: express.Application) => {
    /////////////////////////////////////////////////USERS ROUTES///////////////////////////////////////////////

    ///////// CREATE USER

    router.post(
        "/api/auth/users/",
        async (request: express.Request, response: express.Response) => {
            try {
                let data = request.body;
                let { personal, contact } = data;
                let createdAt = new Date();
                let email = personal?.email;
                let password = await hashData(personal.password);
                let pinCode = await hashData(personal.pinCode);
                let newPersonalInfo;
                let newContactInfo;
                console.log(data);
                console.log("Date", createdAt);
                let personalInfo = await CommodityUser.create({
                    ...personal,
                    password,
                    pinCode,
                    createdAt,
                });
                let contactInfo = await CommodityUserContact.create({
                    ...contact,
                    createdAt,
                    userId: personalInfo.getDataValue("id"),
                });
                try {
                    newPersonalInfo = await personalInfo.save();
                    newContactInfo = await contactInfo.save();
                    let savePersonalData = await CommodityUser.findOne({
                        where: { email },
                    });
                    if (savePersonalData) {
                        let accountNumber = await generateAccountNumber(
                            savePersonalData.get("id")
                        );
                        console.log(accountNumber);
                        savePersonalData.set("accountNumber", accountNumber);
                        newPersonalInfo = await savePersonalData.save();
                    }
                } catch (err) {
                    await personalInfo.reload();
                    await contactInfo.reload();
                    console.log(err);

                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: "Failed to create a user",
                        });
                    return;
                }
                response.status(responseStatusCode.CREATED).json({
                    status: responseStatus.SUCCESS,
                    message: "User created successfully",
                    data: { newPersonalInfo, newContactInfo },
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /// GET ALL USERS PERSONAL INFO ONLY
    router.get(
        "/api/auth/users/",
        async (request: express.Request, response: express.Response) => {
            try {
                let users = await CommodityUser.findAll();
                console.log(users);
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: users.map((user) => {
                        return {
                            ...user.dataValues,
                            fullName: user.getFullname(),
                        };
                    }),
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /// GET ONE USER ,BY ID, DETAILS, INCLUDING PERSONAL,CONTACT,SALES,FOLLOWERS,FOLLOWING

    router.get(
        "/api/auth/users/:userId",
        async (request: express.Request, response: express.Response) => {
            try {
                let id = request.params?.userId;
                let personal = await CommodityUser.findOne({
                    where: { id },
                });
                let contact = await CommodityUserContact.findOne({
                    where: { id },
                });

                let followers = await CommodityFollower.findAndCountAll({
                    where: { followingId: id },
                });

                let followings = await CommodityFollower.findAndCountAll({
                    where: { followerId: id },
                });

                let sales = await CommodityProductSale.findAndCountAll({
                    where: { sellerId: id },
                });

                let affiliates =
                    await CommodityProductAffiliate.findAndCountAll({
                        where: { affiliateId: id },
                    });

                if (!personal) {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with ${id} does not exists.`,
                    });
                    return;
                }
                console.log({ data: personal, contact });
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: {
                        personal: {
                            ...personal.dataValues,
                            fullName: personal.getFullname(),
                        },
                        contact: contact?.dataValues,
                        followers: {
                            ...followers,
                            rows: followers.rows.map(
                                (follower) => follower.dataValues
                            ),
                        },
                        followings: {
                            ...followings,
                            rows: followings.rows.map(
                                (following) => following.dataValues
                            ),
                        },
                        sales: {
                            ...sales,
                            rows: sales.rows.map((sale) => sale.dataValues),
                        },
                        affiliates: {
                            ...affiliates,
                            rows: affiliates.rows.map(
                                (affiliate) => affiliate.dataValues
                            ),
                        },
                    },
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    //////////// UPDATE USER PERSONAL INFO ///////////////

    router.put(
        "/api/auth/users/personal/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { key, value, userId: id } = request.body;
                let personalInfo = await CommodityUser.findOne({
                    where: { id },
                });
                if (personalInfo) {
                    if (key === "password") {
                        personalInfo?.set(key,await hashData(value));
                        let info = await personalInfo?.save();
                        console.log("Row Affected:", info);
                        response.status(responseStatusCode.ACCEPTED).json({
                            status: responseStatus.SUCCESS,
                            message: `Successfuly update a user's ${key}`,
                            affectedRow: personalInfo,
                        });
                    } 
                     else if (key === "pinCode") {
                        personalInfo?.set(key,await hashData(value));
                        let info = await personalInfo?.save();
                        console.log("Row Affected:", info);
                        response.status(responseStatusCode.ACCEPTED).json({
                            status: responseStatus.SUCCESS,
                            message: `Successfuly update a user's ${key}`,
                            affectedRow: personalInfo,
                        });
                    } 
                    else {
                        personalInfo?.set(key, value);
                        let info = await personalInfo?.save();
                        console.log("Row Affected:", info);
                        response.status(responseStatusCode.ACCEPTED).json({
                            status: responseStatus.SUCCESS,
                            message: `Successfuly update a user's ${key}`,
                            affectedRow: info,
                        });
                    }
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `User's account with Id ${id} does not exist`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    //////////// UPDATE USER CONTACT INFO ////////////////////

    router.put(
        "/api/auth/users/contact/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { key, value, userId } = request.body;
                let contactInfo = await CommodityUserContact.findOne({
                    where: { userId },
                });
                if (contactInfo) {
                    contactInfo?.set(key, value);
                    let info = await contactInfo?.save();
                    console.log("Row Affected:", info);
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: `Successfuly update a user's ${key} info`,
                        affectedRow: info,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `User's contact information with userId ${userId} does not exist`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ////////////  DELETE USER AND CASCADING PERSONAL INFORMATION ////////////

    router.delete(
        "/api/auth/users/:userId",
        async (request: express.Request, response: express.Response) => {
            try {
                let id = request.params.userId;
                let deleteObj = await CommodityUser.destroy({
                    where: { id },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a user",
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `User's account with ${id} does not exist`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /////////// LOGIN USER ////////////////

    router.post(
        "/api/auth/users/login/",
        async (request: express.Request, response: express.Response) => {
            try {
                let {
                    password,
                    email,
                    deviceName,
                    deviceId,
                    notificationToken,
                } = request.body;
                let userInfo = await CommodityUser.findOne({
                    where: { email },
                });

                if (userInfo) {
                    let hashedPassword = userInfo.getDataValue("password");
                    let isMatch = await matchWithHashedData(
                        password,
                        hashedPassword
                    );
                    if (isMatch) {
                        let notificationObject = {
                            userId: userInfo.getDataValue("id"),
                            deviceId: deviceId,
                            deviceName: deviceName,
                            createdAt: new Date(),
                            notificationToken: notificationToken,
                        };
                        let createdObject =
                            await CommodityNotificationDetail.create(
                                notificationObject
                            );
                        console.log(userInfo);
                        let followingIds = await CommodityFollower.findAll({where:{followerId:userInfo.getDataValue("id")}})
                        let loginToken = await jwtEncode({
                            id: userInfo.getDataValue("id"),
                            email: userInfo.getDataValue("email"),
                            accountNumber:
                            userInfo.getDataValue("accountNumber"),
                            deviceId: createdObject.getDataValue("deviceId"),
                            followingIds
                        });
                        response.status(responseStatusCode.CREATED).json({
                            status: responseStatus.SUCCESS,
                            message: `Login successfully`,
                            token: loginToken,
                        });
                    } else {
                        response.status(responseStatusCode.UNATHORIZED).json({
                            status: responseStatus.UNATHORIZED,
                            message: "Password is incorrect.",
                        });
                    }
                } else {
                    response.status(responseStatusCode.UNATHORIZED).json({
                        status: responseStatus.UNATHORIZED,                                                                                                                             
                        message: "Email does not exist.",
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                    message:"Fail to login.Check your connection and try again."
                });
            }
        }
    );

    /////////////////////////////////////// LOGOUT USER ///////////////////////////////////

    router.delete(
        "/api/auth/users/logout/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { userId, deviceId } = request.body;
                let deletedObj = await CommodityNotificationDetail.destroy({
                    where: { userId, deviceId },
                });
                if (deletedObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Logout successfully",
                    });
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message:
                            "Failed to lgout user. Ensure that the userId you used exists.",
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    //////////////////////////////////////// CHECK EMAIL //////////////////////////////////

    router.get(
        "/api/auth/users/checkuserId/:email",
        async (request: express.Request, response: express.Response) => {
            try {
                let email: string = request.params?.email;
                let personal = await CommodityUser.findOne({
                    where: { email },
                });
                if (personal) {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        message: "Email is valid",
                    });
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: "Email does not exists.",
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ////////////////////////// CONFIRM EMAIL BY CONFIRMATION CODE /////////////////////////

    router.get(
        "/api/auth/users/confirmemail/:email",
        async (request: express.Request, response: express.Response) => {
            try {
                let email: string = request.params?.email;
                let { htmlPath, code } = await generateEmailHTML({
                    displayRandomCode: true,
                });
                let subject = "Mexu Commodity";
                let mailer = new MailService(email, htmlPath, subject);

                let emailSent = await mailer.send("smtp", response, code);
                if (emailSent) {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        message: "Email sent successfully",
                        data: { confirmationCode: code },
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /////////////////////////////////////// CHECK PASSWORD /////////////////////////////////

    router.post(
        "/api/auth/users/checkpassword/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { password, userId: id } = request.body;
                let userInfo = await CommodityUser.findOne({
                    where: { id },
                });

                if (userInfo) {
                    let hashedPassword = userInfo.getDataValue("password");
                    let isMatch = await matchWithHashedData(
                        password,
                        hashedPassword
                    );
                    if (isMatch) {
                        console.log(userInfo);
                        response.status(responseStatusCode.ACCEPTED).json({
                            status: responseStatus.SUCCESS,
                            message: `Password is valid`,
                        });
                    } else {
                        response
                            .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                            .json({
                                status: responseStatus.UNPROCESSED,
                                message: "Password is incorrect.",
                            });
                    }
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: "User does not exist.",
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////// ADD USER BANK CREDIT,DEBIT CARD ////////////////////////

    router.post(
        "/api/auth/bcards/",
        async (request: express.Request, response: express.Response) => {
            try {
                let data = request.body;
                let createdAt = new Date();
                let cardNumber = await encryptBankCardNumber(data.cardNumber);
                console.log(data);

                let bankInfo = await CommodityBankCardDetail.create({
                    ...data,
                    cardNumber,
                    createdAt,
                });
                try {
                    await bankInfo.save();
                } catch (err) {
                    await bankInfo.reload();
                    console.log(err);

                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: "Failed to add Credit/Debit card",
                        });
                    return;
                }
                response.status(responseStatusCode.CREATED).json({
                    status: responseStatus.SUCCESS,
                    message: "Credit/Debit card successfully added",
                    data: bankInfo,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////////////// GET ALL USERS CREDIT,DEBIT CARD /////////////////////////

    router.get(
        "/api/auth/bcards/",
        async (request: express.Request, response: express.Response) => {
            try {
                let cards = await CommodityBankCardDetail.findAll();
                console.log(cards);
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: cards,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////////////// GET USER CREDIT,DEBIT CARD /////////////////////////

    router.get(
        "/api/auth/bcards/:userId",
        async (request: express.Request, response: express.Response) => {
            try {
                let userId: string = request.params?.userId;
                let cardInfo = await CommodityBankCardDetail.findAll({
                    where: { userId },
                });
                if (cardInfo.length > 0) {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        data: cardInfo,
                    });
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with ${userId} does not exists.`,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////////////// DELETE USER CREDIT,DEBIT CARD /////////////////////////

    router.delete(
        "/api/auth/bcards/:id",
        async (request: express.Request, response: express.Response) => {
            try {
                let id = request.params.id;
                let deleteObj = await CommodityBankCardDetail.destroy({
                    where: { id },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted Credit/Debit Card",
                        deleteObj: deleteObj,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `Credit/Debit Card with id = ${id} does not exist.`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /////////////////////////// ADD PHONE NUMBER ////////////////////////

    router.put(
        "/api/auth/phone/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { phoneNumber, userId } = request.body;
                let contactInfo = await CommodityUserContact.findOne({
                    where: { userId },
                });
                if (contactInfo) {
                    let newPhoneNumbers = JSON.parse(
                        contactInfo.get("phoneNumbers") + ""
                    );
                    let company = await getPhoneNumberCompany(phoneNumber);
                    newPhoneNumbers[company] = phoneNumber;
                    contactInfo?.set("phoneNumbers", newPhoneNumbers);
                    let info = await contactInfo?.save();
                    // console.log("Row Affected:", info);
                    response.status(responseStatusCode.CREATED).json({
                        status: responseStatus.SUCCESS,
                        message: `Successfuly update a user's phonenumber`,
                        affectedRow: info,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `User with ${userId} does not exist`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    //////////////////////////////////// DELETE PHONE NUMBER /////////////////////////////////////////////

    router.delete(
        "/api/auth/phone/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { phoneNumber, userId } = request.body;
                let contactInfo = await CommodityUserContact.findOne({
                    where: { userId },
                });
                if (contactInfo) {
                    let newPhoneNumbers = JSON.parse(
                        contactInfo.getDataValue("phoneNumbers")
                    );
                    let company = await getPhoneNumberCompany(phoneNumber);
                    newPhoneNumbers[company] = null;
                    contactInfo?.setDataValue("phoneNumbers", newPhoneNumbers);
                    let info = await contactInfo?.save();
                    // console.log("Row Affected:", info);
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: `Successfuly deleted a user's phonenumber`,
                        affectedRow: info,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `User with ${userId} does not exist`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /////////////////////// CORNFIRM PHONE NUMBER BY SMS AND CONFIRMATION CODE /////////////

    router.post(
        "/api/auth/phone/confirmnumber/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { phoneNumber } = request.body;
                let { message, code } = await smsConfirmationMessage();
                let sms = new SMS(phoneNumber, message);
                let smsResponse = await sms.sendMessage("vonage");
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    message: "Message sent successfully",
                    data: { confirmationCode: code },
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////////////////////// ADD TRANSFEREE /////////////////////////////////////

    router.post(
        "/api/auth/transferee/",
        async (request: express.Request, response: express.Response) => {
            try {
                let data = request.body;
                let createdAt = new Date();
                console.log(data);
                console.log("Date", createdAt);
                let transfereeInfo = await CommodityTransferee.create({
                    ...data,
                    createdAt,
                });
                try {
                    await transfereeInfo.save();
                } catch (err) {
                    await transfereeInfo.reload();
                    console.log(err);

                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: "Failed to add Transferee",
                        });
                    return;
                }
                response.status(responseStatusCode.CREATED).json({
                    status: responseStatus.SUCCESS,
                    message: "Transferee card successfully added",
                    data: transfereeInfo,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////////////// GET ALL USER TRANSFEREES /////////////////////////

    router.get(
        "/api/auth/transferee/:transferorId",
        async (request: express.Request, response: express.Response) => {
            try {
                let transferorId = request.params.transferorId;
                let transferees = await CommodityTransferee.findAll({
                    where: { transferorId },
                });
                console.log(transferees);
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: transferees,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /////////////////////////////////// DELETE TRANSFEREE //////////////////////////////////

    router.delete(
        "/api/auth/transferee/:id",
        async (request: express.Request, response: express.Response) => {
            try {
                let id = request.params.id;
                let deleteObj = await CommodityTransferee.destroy({
                    where: { id },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a Transferee",
                        deleteObj: deleteObj,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `Transferee with ownerId = ${id} does not exist.`,
                        });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////////////////////// CHECK FOR VALID ACCOUNT NUMBER //////////////////////////////////////

    router.get(
        "/api/auth/checkaccountnumber/:number",
        async (request: express.Request, response: express.Response) => {
            try {
                let accountNumber = request.params.number;
                let user = await CommodityUser.findOne({
                    where: { accountNumber },
                });
                if (user) {
                    console.log(user);
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        message: "Accout number is valid",
                        data: user,
                    });
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Account number ${accountNumber} does not exist`,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /// GETS ROUTES

    router.get(
        "/api/",
        (request: express.Request, response: express.Response) => {
            response.status(responseStatusCode.OK).json({
                status: responseStatus.SUCCESS,
            });
        }
    );
};
