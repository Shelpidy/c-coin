import {
    generateAccountNumber,
    generateEmailHTML,
    getPhoneNumberCompany,
    responseStatus,
    responseStatusCode,
} from "../utils/Utils";
import express from "express";
import { CommodityUser } from "../models/ComUsers";
import { CommodityUserContact } from "../models/ComUserContacts";
import MailService from "../services/MailService";
import { CommodityBankCardDetail } from "../models/ComBankCardDetails";
import { CommodityTransferee } from "../models/ComTransferees";

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
                let newPersonalInfo
                let newContactInfo
                console.log(data);
                console.log("Date", createdAt);
                let personalInfo = await CommodityUser.create({
                    ...personal,
                    createdAt,
                });
                let contactInfo = await CommodityUserContact.create({
                    ...contact,
                    createdAt,
                    email,
                });
                try {
                    newPersonalInfo = await personalInfo.save();
                    newContactInfo = await contactInfo.save();
                    let savePersonalData = await CommodityUser.findOne({where:{email}})
                    if(savePersonalData){
                           let accountNumber = generateAccountNumber(savePersonalData.get("id"))
                           console.log(accountNumber)
                           savePersonalData.set('accountNumber',accountNumber)
                           newPersonalInfo = await savePersonalData.save()
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
                    data:{newPersonalInfo,newContactInfo}
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
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
                    data: users.map(user =>{ return {...user.dataValues,fullName:user.getFullname()}}),
                });
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    /// GET ONE USER ,BY EMAIL, DETAILS, INCLUDING PERSONAL AND CONTACT

    router.get(
        "/api/auth/users/:email",
        async (request: express.Request, response: express.Response) => {
            try {
                let email: string = request.params?.email;
                let personal = await CommodityUser.findOne({
                    where: { email },
                });
                let contact = await CommodityUserContact.findOne({
                    where: { email },
                });
                if (!personal) {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with ${email} does not exists.`,
                    });
                    return;
                }
                console.log({ data: personal, contact });
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: {
                        personal:{...personal,fullName:personal.getFullname()},
                        contact,
                    },
                });
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    //////////// UPDATE USER PERSONAL INFO ///////////////

    router.put(
        "/api/auth/users/personal/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { key, value, email } = request.body;
                let personalInfo = await CommodityUser.findOne({
                    where: { email },
                });
                if(personalInfo){
                     if (key === "password") {
                    personalInfo?.set(key, value);
                    let info = await personalInfo?.save();
                    console.log("Row Affected:", info);
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: `Successfuly update a user's ${key}`,
                        affectedRow: personalInfo,
                    });
                } else {
                    personalInfo?.set(key, value);
                    let info = await personalInfo?.save();
                    console.log("Row Affected:", info);
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: `Successfuly update a user's ${key}`,
                        affectedRow: info,
                    });
                }

                }else{
                     response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `User's account with email ${email} does not exist`,
                    });
                }
               
            } catch (err) {
                 console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    //////////// UPDATE USER CONTACT INFO ////////////////////

    router.put(
        "/api/auth/users/contact/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { key, value, email } = request.body;
                let contactInfo = await CommodityUserContact.findOne({
                    where: { email },
                });
                if(contactInfo){
                contactInfo?.set(key, value);
                let info = await contactInfo?.save();
                console.log("Row Affected:", info);
                response.status(responseStatusCode.ACCEPTED).json({
                    status: responseStatus.SUCCESS,
                    message: `Successfuly update a user's ${key} info`,
                    affectedRow: info,
                });

                }else{
                        response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `User's contact information with email ${email} does not exist`,
                    });

                }
               
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    ////////////  DELETE USER AND CASCADING PERSONAL INFORMATION ////////////

    router.delete(
        "/api/auth/users/:email",
        async (request: express.Request, response: express.Response) => {
            try {
                let email = request.params.email;
                let deleteObj = await CommodityUser.destroy({
                    where: { email },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a user",
                    });
                } else {
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `User's account with ${email} does not exist`,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    /////////// LOGIN USER ////////////////

    router.post(
        "/api/auth/users/login/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { password, email } = request.body;
                let contactInfo = await CommodityUser.findOne({
                    where: { email },
                });

                if (contactInfo) {
                    if (password === contactInfo.get("password")) {
                        console.log(contactInfo);
                        response.status(responseStatusCode.OK).json({
                            status: responseStatus.SUCCESS,
                            message: `Login successfully`,
                            token: contactInfo,
                        });
                    } else {
                        response.status(responseStatusCode.NOT_FOUND).json({
                            status: responseStatus.ERROR,
                            message: "Password is incorrect.",
                        });
                    }
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: "Email does not exist.",
                    });
                }
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    ///// CHECK EMAIL ////////////

    router.get(
        "/api/auth/users/checkemail/:email",
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
                    message:err,
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
                let htmlPath = generateEmailHTML({ displayRandomCode: true });
                let subject = "Mexu Commodity";
                let mailer = new MailService(email, htmlPath, subject);
                await mailer.send("smtp");
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    message: "Email sent successfully",
                });
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    /////////////////////////////// CHECK PASSWORD //////////////////////////

    router.post(
        "/api/auth/users/checkpassword/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { password, email } = request.body;
                let contactInfo = await CommodityUser.findOne({
                    where: { email },
                });

                if (contactInfo) {
                    if (password === contactInfo.get("password")) {
                        console.log(contactInfo);
                        response.status(responseStatusCode.CREATED).json({
                            status: responseStatus.SUCCESS,
                            message: `Password is valid`,
                        });
                    } else {
                        response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                            status: responseStatus.UNPROCESSED,
                            message: "Password is incorrect.",
                        });
                    }
                } else {
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: "Email does not exist.",
                    });
                }
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
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
                console.log(data);
                console.log("Date", createdAt);
                let bankInfo = await CommodityBankCardDetail.create({
                    ...data,
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
                    message:err,
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
                    message:err,
                });
            }
        }
    );

    ///////////////////////////// GET USER CREDIT,DEBIT CARD /////////////////////////

    router.get(
        "/api/auth/bcards/:email",
        async (request: express.Request, response: express.Response) => {
            try {
                let email: string = request.params?.email;
                let cardInfo = await CommodityBankCardDetail.findAll({
                    where: { email },
                });
                if (cardInfo.length > 0) {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        data: cardInfo,
                    });
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with ${email} does not exists.`,
                    });
                }
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
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
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `Credit/Debit Card with id = ${id} does not exist.`,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    /////////////////////////// ADD PHONE NUMBER ////////////////////////

    router.put(
        "/api/auth/phone/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { phoneNumber, email } = request.body;
                let contactInfo = await CommodityUserContact.findOne({
                    where: { email },
                });
                if (contactInfo) {
                    let dummyObj = JSON.stringify({
                        africell: null,
                        orange: null,
                        qcell: null,
                    });
                    let newPhoneNumbers = JSON.parse(
                        contactInfo.get("phoneNumbers") + ""
                    );
                    let company = getPhoneNumberCompany(phoneNumber);
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
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `User with ${email} does not exist`,
                    });
                }
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    //////////////////////////////////// DELETE PHONE NUMBER /////////////////////////////////////////////

    router.delete(
        "/api/auth/phone/",
        async (request: express.Request, response: express.Response) => {
            try {
                let { phoneNumber, email } = request.body;
                let contactInfo = await CommodityUserContact.findOne({
                    where: { email },
                });
                if (contactInfo) {
                    let newPhoneNumbers = JSON.parse(
                        contactInfo.get("phoneNumbers") + ""
                    );
                    let company = getPhoneNumberCompany(phoneNumber);
                    newPhoneNumbers[company] = null;
                    contactInfo?.set("phoneNumbers", newPhoneNumbers);
                    let info = await contactInfo?.save();
                    // console.log("Row Affected:", info);
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: `Successfuly deleted a user's phonenumber`,
                        affectedRow: info,
                    });
                } else {
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `User with ${email} does not exist`,
                    });
                }
            } catch (err) {
               console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    /////////////////////// ADD TRANSFEREE /////////////////////////////////////

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
                    message:err,
                });
            }
        }
    );

    ///////////////////////////// GET ALL USER TRANSFEREES /////////////////////////

    router.get(
        "/api/auth/transferee/:email",
        async (request: express.Request, response: express.Response) => {
            try {
                let email = request.params.email
                let transferees = await CommodityTransferee.findAll({where:{email}});
                console.log(transferees);
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: transferees,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );


    /////////////////////// DELETE TRANSFEREE //////////////////////////////////

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
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `Transferee with id = ${id} does not exist.`,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        }
    );

    //////// CHECK FOR VALID ACCOUNT NUMBER //////////////////////////////////////

    router.get(
        "/api/auth/checkaccountnumber/:number",
        async (request: express.Request, response: express.Response) => {
            try {
                let accountNumber = request.params.number
                let user = await CommodityUser.findOne({where:{accountNumber}});
                if(user){
                console.log(user);
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    message:"Accout number is valid",
                    data: user,
                });
                }else{
                    response.status(responseStatusCode.NOT_FOUND).json({
                    status: responseStatus.ERROR,
                    message: `Account number ${accountNumber} does not exist`,
                });

                }
              
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message: err,
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
