import express from "express";
import { Commodity } from "../models/Commodities";
import { CommodityNotification } from "../models/ComNotifications";
import { responseStatus, responseStatusCode } from "../utils/Utils";

export default (router: express.Application) => {
    /////////////////// GET NOTIFICATIONS BY EMAIL //////////////////////////

    router.get(
        "/api/notifications/:userId",
        async (request: express.Request, response: express.Response) => {
            try {
                let userId = request.params.userId;
                let notifications = await CommodityNotification.findAll({
                    where: { userId },
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

    //////////////////////// GET ALL NOTIFICATIONS ///////////////////////////////////

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
    ////////////////////////// DELETE A NOTIFICATION ///////////////////////

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
};
