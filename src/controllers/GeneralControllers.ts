import express from "express";
import NotificationService from "../services/NotificationService";
import { responseStatus, responseStatusCode } from "../utils/Utils";

let notification = new NotificationService();

export default (router: express.Application) => {
    ///////////// GET ALL PROFILE DETAILS ////////////////

    router.get(
        "/api/general/",
        async (request: express.Request, response: express.Response) => {
            try {
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    message: "This is a general route",
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
