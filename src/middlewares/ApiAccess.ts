import express from "express";
import { responseStatus, responseStatusCode } from "../utils/Utils";

const authorizeApiAccess = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
) => {
    const apiAccessKey = request.headers?.apiaccesskey;
    console.log(apiAccessKey);
    if (apiAccessKey === process.env.API_ACCESS_KEY) {
        next();
    } else {
        next();
        // response.status(responseStatusCode.UNATHORIZED).json({
        //     status: responseStatus.UNATHORIZED,
        //     message: "Invalid or no API Access Key",
        // });
    }
};

export default authorizeApiAccess;
