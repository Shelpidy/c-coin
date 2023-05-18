import express from "express";
import { Commodity } from "../models/Commodities";
import { CommodityNotification } from "../models/ComNotifications";
import {
    responseStatus,
    responseStatusCode,
    getResponseBody,
} from "../utils/Utils";
import CommodityProduct from "../models/ComProducts";
import { CommodityProductAffiliate } from "../models/ComProductAffiliates";
import { CommodityUser } from "../models/ComUsers";

export default (router: express.Application) => {
    //////////////////////// GET NOTIFICATIONS BY USERID //////////////////////////

    router.get(
        "/api/notifications/:userId",
        async (request: express.Request, response: express.Response) => {
            try {
                let userId = request.params.userId;
                let notifications = await CommodityNotification.findAll({
                    where: { userId },
                    order: [["id", "DESC"]],
                });
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: notifications,
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

    ///////////////////////////// GET ALL NOTIFICATIONS ///////////////////////////////////

    router.get(
        "/api/notifications/",
        async (request: express.Request, response: express.Response) => {
            try {
                let notifications = await CommodityNotification.findAll();
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: notifications,
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

    ///////////////////////////// DELETE A NOTIFICATION ///////////////////////////

    router.delete(
        "/api/notifications/:id",
        async (request: express.Request, response: express.Response) => {
            try {
                let id = request.params.id;
                let deleteObj = await CommodityNotification.destroy({
                    where: { id },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a notification record",
                        deleteObj: deleteObj,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `Failed to delete notification with Id ${id}`,
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

    ///////////////////////// ADD READ STATUS /////////////////////////////

    router.put(
        "/api/notifications/read/:notificationId",
        async (request: express.Request, response: express.Response) => {
            try {
                let notId = request.params.notificationId;
                const notification = await CommodityNotification.findByPk(
                    notId
                );
                if (!notification) {
                    return response
                        .status(responseStatusCode.NOT_FOUND)
                        .json(
                            getResponseBody(
                                responseStatus.ERROR,
                                `Notification with Id ${notId} does not exist`
                            )
                        );
                }
                const newNot = await CommodityNotification.update(
                    { readStatus: true },
                    {
                        where: { id: notId },
                    }
                );
                response.status(responseStatusCode.ACCEPTED).json({
                    status: responseStatus.SUCCESS,
                    data: {
                        affectedRow: newNot,
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

    /////////////////////// DELETE USER NOTIFICATIONS //////////////////////

    router.delete(
        "/api/notifications/del/:userId",
        async (request: express.Request, response: express.Response) => {
            try {
                let userId = request.params.userId;
                let deleteObj = await CommodityNotification.destroy({
                    where: { userId },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message:
                            "Successfully deleted a user notification records",
                        deleteObj: deleteObj,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `Failed to delete user notifications with userId ${userId}`,
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

    //////////////////// GET NOTIFICATION VIEW FOR PRODUCT ////////////////

    router.get(
        "/api/notifications/product/:productId",
        async (request: express.Request, response: express.Response) => {
            try {
                let productId = request.params.productId;
                let product = await CommodityProduct.findOne({
                    where: { id: productId },
                });
                if (!product) {
                    return response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `The product with productId ${productId} does not exist`,
                    });
                }
                let owner = await CommodityUser.findByPk(
                    product.getDataValue("userId")
                );
                // let notifications = await CommodityNotification.findAll();
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: { owner, product },
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
};
