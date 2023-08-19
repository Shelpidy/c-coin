import express from "express";
import { Commodity } from "../models/Commodities";
import { responseStatus, responseStatusCode } from "../utils/Utils";

export default (router: express.Application) => {
    router.post(
        "/commodities/",
        async (request: express.Request, response: express.Response) => {
            try {
                let commodity = request.body;
                let createdCommodity = await Commodity.create({
                    ...commodity
                });
                if (createdCommodity) {
                    response.status(responseStatusCode.CREATED).json({
                        status: responseStatus.SUCCESS,
                        message: `You have successfully added an amount of ${commodity?.balance} to the user's account ${commodity?.address}`,
                        item: createdCommodity,
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: "Failed to create a user",
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

    ////////////////////// CHECK BALANCE /////////////////////////

    router.get(
        "/commodities/checkbalance/:address",
        async (request: express.Request, response: express.Response) => {
            try {
                let address = request.params.address;
                let commodity = await Commodity.findOne({ where: { address } });

                if (commodity) {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        item:{
                            balance: commodity?.getDataValue("balance"),
                        }
                       
                    });
                } else {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.ERROR,
                        item:{
                            balance: "C 0.00",
                        }
                       
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

    /////////////////// GET COMMODITY  //////////////////////////

    router.get(
        "/commodities/:address",
        async (request: express.Request, response: express.Response) => {
            try {
                let address = request.params.address;
                let commodity = await Commodity.findOne({ where: { address } });

                if (commodity) {
                    response.status(responseStatusCode.OK).json({
                        status: responseStatus.SUCCESS,
                        item: commodity,
                    });
                } else {
                    response.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        item: commodity,
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

    //////////////////////// GET ALL COMMODITIES ///////////////////////////////////

    router.get(
        "/commodities/",
        async (request: express.Request, response: express.Response) => {
            try {
                let commodities = await Commodity.findAll();
                response.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    item: commodities,
                });
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:String(err),
                });
            }
        }
    );

    ////////////////////////// DELETE COMMODITY ///////////////////////

    router.delete(
        "/commodities/:address",
        async (request: express.Request, response: express.Response) => {
            try {
                let address = request.params.address;
                let deleteObj = await Commodity.destroy({
                    where: { address },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.DELETED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a user commodity record",
                        item:{
                            deleteObj: deleteObj,
                        }
                       
                    });
                } else {
                    response
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json({
                            status: responseStatus.UNPROCESSED,
                            message: `Failed to delete user's commodity with address ${address}`,
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
};
