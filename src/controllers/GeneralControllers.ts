import express from "express";
import NotificationService from "../services/NotificationService";
import {
    getResponseBody,
    responseStatus,
    responseStatusCode,
} from "../utils/Utils";
import { Op } from "sequelize";
import CommodityProduct from "../models/ComProducts";
import CommodityPost from "../models/ComPosts";
import { CommodityUser } from "../models/ComUsers";

let notification = new NotificationService();

export default (router: express.Application) => {
    ///////////// GET ALL PROFILE DETAILS ////////////////

    router.get(
        "/api/search/",
        async (request: express.Request, response: express.Response) => {
            const { searchValue } = request.query;
            console.log(searchValue)

            try {
                const products = await CommodityProduct.findAll({
                    where: {
                        [Op.or]: [
                            { productName: { [Op.like]: `%${searchValue}%` } },
                            { category: { [Op.like]: `%${searchValue}%` } },
                            { description: { [Op.like]: `%${searchValue}%` } },
                        ],
                    },
                });

                const posts = await CommodityPost.findAll({
                    where: {
                        [Op.or]: [
                            { title: { [Op.like]: `%${searchValue}%` } },
                            { text: { [Op.like]: `%${searchValue}%` } },
                        ],
                    },
                });

                const users = await CommodityUser.findAll({
                    where: {
                        [Op.or]: [
                            { firstName: { [Op.like]: `%${searchValue}%` } },
                            { middleName: { [Op.like]: `%${searchValue}%` } },
                            { lastName: { [Op.like]: `%${searchValue}%` } },
                            {
                                email: {
                                    [Op.like]: `%${searchValue}@gmail.com%`,
                                },
                            },
                        ],
                    },
                });

                const searchResults = {
                    products,
                    posts,
                    users,
                };
                response
                    .status(responseStatusCode.OK)
                    .json(
                        getResponseBody(
                            responseStatus.SUCCESS,
                            "Results founded",
                            searchResults
                        )
                    );
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
