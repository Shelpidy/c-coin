import express from "express";
import CommodityPost from "../models/ComPosts";
import {
    getResponseBody,
    hasPassedOneMonth,
    makePurchacePayment,
    responseStatus,
    responseStatusCode,
} from "../utils/Utils";
import CommodityFollower from "../models/ComFollowers";
import CommodityProduct from "../models/ComProducts";
import CommodityProductComment from "../models/ComProductComments";
import CommodityProductLike from "../models/ComProductLikes";
import { CommodityProductAffiliate } from "../models/ComProductAffiliates";
import { CommodityProductSale } from "../models/ComProductSales";
import type { MakePurchaseParams } from "../utils/Utils.d";
import CommodityProductRequest from "../models/ComProductRequests";
import { CommodityUser } from "../models/ComUsers";
import { CommodityNotification } from "../models/ComNotifications";
import CommodityProductReview from "../models/ComProductReviews";

export default function MarketingController(app: express.Application) {
    /////////////////////////// GET USERS AFFILIATED PRODUCTS /////////////////////////////
    app.get(
        "/api/marketing/affiliates/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let ids = (
                    await CommodityProductAffiliate.findAll({
                        where: { affiliateId: userId },
                    })
                ).map((obj) => obj.getDataValue("productId"));
                //   console.log(ids)
                const products = await CommodityProduct.findAll({
                    where: { id: [...ids] },
                    order: [["id", "DESC"]],
                });
                if (!products) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: products,
                });
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    /////////////////////////// AFFILIATE A PRODUCT ///////////////////////////////////////

    app.post("/api/marketing/affiliates", async (req, res) => {
        const { affiliateId, productId, userId } = req.body;
        try {
            const product = await CommodityProductAffiliate.create({
                affiliateId,
                productId,
                userId,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json({
                status: responseStatus.SUCCESS,
                message: "Successfully affiliated a product",
                data: product.dataValues,
            });
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    });

    //////////////////////////// DELETE AN AFIILIATED RECORD /////////////

    app.delete("/api/marketing/affiliates/:id", async (req, res) => {
        const { id } = req.params;
        try {
            const affilatedRecord = await CommodityProductAffiliate.findByPk(
                id
            );
            if (!affilatedRecord) {
                return res.status(responseStatusCode.NOT_FOUND).json({
                    status: responseStatus.ERROR,
                    message: "Affiliated Record not found",
                });
            }
            await affilatedRecord.destroy();
            res.status(responseStatusCode.DELETED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Successfully deleted san affiliated record"
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    /////////////////////// GET SALE HISTORY MADE //////////////////////

    app.get("/api/marketing/sales/:sellerId", async (req, res) => {
        const { sellerId } = req.params;
        try {
            const sales = await CommodityProductSale.findAll({
                where: { sellerId },
            });
            res.status(responseStatusCode.ACCEPTED).json(
                getResponseBody(responseStatus.SUCCESS, "", sales)
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    /////////////////// GET ALL PRODUCTS BY A USER SESSION /////////////

    app.get(
        "/api/marketing/products/session/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followerId: userId },
                    })
                ).map((obj) => obj.getDataValue("followingId"));
                //   console.log(ids)
                const post = await CommodityProduct.findAll({
                    where: { userId: [...ids, userId] },
                    order: [["id", "DESC"]],
                });
                if (!post) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Post with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: post,
                });
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ///////////////////// GET ALL USER PRODUCTS /////////////////////

    app.get(
        "/api/marketing/products/user/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let usersId = (
                    await CommodityProductAffiliate.findAll({
                        attributes: ["userId"],
                        where: { affiliateId: userId },
                    })
                ).map((obj) => obj.getDataValue("userId"));
                console.log("Other users", usersId);
                const products = (
                    await CommodityProduct.findAll({
                        where: { userId: [...usersId, userId] },
                        order: [["id", "DESC"]],
                    })
                ).map((product) => {
                    if (product.getDataValue("userId") != userId) {
                        return {
                            ...product.dataValues,
                            affiliateId: [Number(userId)],
                        };
                    }
                    return { ...product.dataValues, affiliateId: null };
                });
                if (!products) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Products with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: products,
                });
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ////////////////////// GET ONE PRODUCT BY PRODUCT ID ////////////////////////////////

    app.get(
        "/api/marketing/products/:productId/:userId",
        async (req: express.Request, res: express.Response) => {
            const { productId,userId } = req.params;
            try {
                let affiliateIds = (
                    await CommodityProductAffiliate.findAll({
                        where: { productId },
                    })
                ).map((obj) => obj.getDataValue("affiliateId"));
                // console.log("Other affiliateIds",affiliateIdsId)
                const product = await CommodityProduct.findOne({
                    where: { id: productId },
                });
                if (!product) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Products with productId ${productId} does not exist`,
                    });
                }
                let likes = await CommodityProductLike.findAndCountAll({where:{productId:product.getDataValue("id")}})
                let reviews = await CommodityProductReview.findAndCountAll({where:{productId:product.getDataValue("id")}})
                let user = await CommodityUser.findOne({where:{id:product.getDataValue("userId")}})
                let hasReviewed = await CommodityProductReview.findOne({where:{userId}})
                let liked = likes.rows.some(like => like.getDataValue("userId") == userId)
                let isNew = !hasPassedOneMonth(product.getDataValue("createdAt"))
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: {
                        product:product.dataValues,
                        previewsCount:reviews.count,
                        likesCount:likes.count,
                        user,
                        liked,
                        isNew,
                        previewed:hasReviewed?true:false,
                        affiliateIds
                    },
                });
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    //////////////////////////// Get all products //////////////////////////

    app.get("/api/marketing/products/:userId/:pageNumber/:numberOfRecords", async (req, res) => {
        try {
            const { userId,pageNumber,numberOfRecords } = req.params;
            let numRecs = Number(numberOfRecords)
            let start = (Number(pageNumber) - 1) * numRecs;
            const products = await CommodityProduct.findAll({limit:numRecs,
                offset:start,order:[["id","DESC"]]});
            if (!products) {
                return res.status(responseStatusCode.NOT_FOUND).json({
                    status: responseStatus.ERROR,
                    message: `No products`,
                });
            }
            const productsReturnValue = await Promise.all(products.map(async(product)=>{
                // let comments = await CommodityproductComment.findAndCountAll({where:{productId:product.getDataValue("id")}})
                let likes = await CommodityProductLike.findAndCountAll({where:{productId:product.getDataValue("id")}})
                let reviews = await CommodityProductReview.findAndCountAll({where:{productId:product.getDataValue("id")}})
                let user = await CommodityUser.findOne({where:{id:product.getDataValue("userId")}})
                let liked = likes.rows.some(like => like.getDataValue("userId") == userId)
                let isNew = !hasPassedOneMonth(product.getDataValue("createdAt"))
                return {
                    product:product.dataValues,
                    previewsCount:reviews.count,
                    likesCount:likes.count,
                    user,
                    liked,
                    isNew
                }
            }))
            res.status(responseStatusCode.OK).json({
                status: responseStatus.SUCCESS,
                data: productsReturnValue,
            });
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    });

    //////////// Get all user products by userId and products followings //////////
    app.get(
        "/api/marketing/products/session/:userId/:pageNumber/:numberOfRecords",
        async (req: express.Request, res: express.Response) => {

            try {
                const { userId,pageNumber,numberOfRecords } = req.params;
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followerId: userId },
                    })
                ).map((obj) => obj.getDataValue("followingId"));
                //   console.log(ids)
                const product = await CommodityProduct.findAll({
                    where: { userId: [...ids, userId] },
                    order: [["id", "DESC"]],
                });
                if (!product) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Products with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: product,
                });
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    data: err,
                });
            }
        }
    );

    ////////////////////////////// ADD NEW PRODUCT //////////////////////////

    app.post("/api/marketing/products", async (req, res) => {
        const data = req.body;

        try {
            const product = await CommodityProduct.create({
                ...data,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json({
                status: responseStatus.SUCCESS,
                message: "Successfully added a product",
                data: product.dataValues,
            });
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    });

    /////////////////////////// Update a product //////////////////////////////////////

    app.put("/api/marketing/products/", async (req, res) => {
        const data = req.body;

        try {
            const product = await CommodityProduct.findByPk(data?.id);
            if (!product) {
                return res
                    .status(responseStatusCode.NOT_FOUND)
                    .json(
                        getResponseBody(
                            responseStatus.ERROR,
                            `Product with Id ${data?.id} does not exist`
                        )
                    );
            }
            const newPost = await CommodityProduct.update(data, {
                where: { id: data?.id },
            });
            res.status(responseStatusCode.ACCEPTED).json({
                status: responseStatus.SUCCESS,
                data: {
                    affectedRow: newPost,
                },
            });
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    });

    //////////////////////////////////// Delete a product//////////////////////////

    app.delete("/api/marketing/products/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const product = await CommodityProduct.findByPk(id);
            if (!product) {
                return res.status(responseStatusCode.NOT_FOUND).json({
                    status: responseStatus.ERROR,
                    message: "Product not found",
                });
            }
            await product.destroy();
            res.status(responseStatusCode.DELETED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Successfully deleted a product"
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    ////////////////////////////// Get all comments for a specific product /////////////////////////
    app.get("/api/marketing/products/comments/:productId", async (req, res) => {
        const { productId } = req.params;

        try {
            const comments = await CommodityProductComment.findAll({
                where: { productId },
            });
            res.status(responseStatusCode.OK).json(
                getResponseBody(responseStatus.SUCCESS, "", comments)
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    ///////////////////////// Add a new comment to a product /////////////////////////////////

    app.post("/api/marketing/products/comments/", async (req, res) => {
        const { productId, userId, text } = req.body;

        try {
            const comment = await CommodityProductComment.create({
                productId,
                userId,
                text,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    `Successsfully added a comment to productId = ${productId}`,
                    comment
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    ////////////////////////////////// Update a comment ////////////////////////

    app.put("/api/marketing/products/comments/", async (req, res) => {
        const { text, id } = req.body;
        try {
            const affectedRow = await CommodityProductComment.update(
                { text },
                { where: { id } }
            );
            if (affectedRow[0] < 1) {
                return res
                    .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                    .json(
                        getResponseBody(
                            responseStatus.UNPROCESSED,
                            "Fail to update a product properties"
                        )
                    );
            }
            res.status(responseStatusCode.ACCEPTED).json(
                getResponseBody(responseStatus.SUCCESS, "Update successfully", {
                    affectedRow,
                })
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    ////////////////////////////////////////// Delete a comment /////////////////////////////////////
    app.delete(
        "/api/marketing/products/comments/:id",
        async (req: express.Request, res: express.Response) => {
            const { id } = req.params;
            try {
                const comment = await CommodityProductComment.findByPk(id);
                if (!comment) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Comment with Id ${id} does not exist`,
                    });
                }
                await comment.destroy();
                res.status(responseStatusCode.DELETED).json(
                    getResponseBody(
                        responseStatus.SUCCESS,
                        "Successfully deleted a comment"
                    )
                );
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json(
                    getResponseBody(responseStatus.ERROR, "", err)
                );
            }
        }
    );

    ////////////////////////// Get all likes for a specific product /////////////////////////

    app.get("/api/marketing/products/likes/:productId", async (req, res) => {
        const { productId } = req.params;

        try {
            const likes = await CommodityProductLike.findAll({
                where: { productId },
            });
            res.status(responseStatusCode.OK).json(
                getResponseBody(responseStatus.SUCCESS, "", likes)
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    ////////////// Remove and add a like from a product or unlike a product ///////////

    app.put("/api/marketing/products/likes/", async (req, res) => {
        const { userId, productId } = req.body;
        try {
            const like = await CommodityProductLike.findOne({
                where: { userId, productId },
            });

            const likes = await CommodityProductLike.findAndCountAll({
                where: { productId },
            });

            if (like) {
                let affectedRow = await CommodityProductLike.destroy({
                    where: { userId, productId },
                });
                if (affectedRow < 1) {
                    return res
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json(
                            getResponseBody(
                                responseStatus.UNPROCESSED,
                                "Fail to unlike a post"
                            )
                        );
                }
                return res
                    .status(responseStatusCode.ACCEPTED)
                    .json(
                        getResponseBody(
                            responseStatus.SUCCESS,
                            "unliked a product successfully",
                            { affectedRow,liked:false,numberOfLikes:likes.count - 1 }
                        )
                    );
            }
            const newLike = await CommodityProductLike.create({
                userId,
                productId,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Liked a product sucessfully",
                    { affectedRow:1,liked:true,numberOfLikes:likes.count + 1}
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    //////////////////// Get all COMMENTS and LIKES for a specific PRODUCT///////////////////

    app.get("/api/marketing/products/cl/:productId", async (req, res) => {
        const { productId } = req.params;

        try {
            const comments = await CommodityProductComment.findAll({
                where: { productId },
            });

            const likes = await CommodityProductLike.findAll({
                where: { productId },
            });

            let comLikeData = { comments, likes };
            res.status(responseStatusCode.OK).json(
                getResponseBody(responseStatus.SUCCESS, "", comLikeData)
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    //////////////// MAKE PURCHASE OR BUY A PRODUCT //////////////////////

    app.post(
        "/api/marketing/buy",
        async (req: express.Request, res: express.Response) => {
            try {
                let buyObj: MakePurchaseParams = req.body;
                await makePurchacePayment(req, res, buyObj);
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json(
                    getResponseBody(responseStatus.ERROR, "", err)
                );
            }
        }
    );

    ///////////////////////////////// REQUEST A PRODUCT ////////////////////////

    app.post("/api/marketing/products/request/", async (req, res) => {
        const { userId, productId } = req.body;
        try {
            const newProduct = await CommodityProductRequest.create({
                userId,
                productId,
                createdAt: new Date(),
            });

            const product = await CommodityProduct.findOne({
                where: { id: newProduct.getDataValue("productId") },
            });
            const user = await CommodityUser.findOne({ where: { id: userId } });
            const productOwner = await CommodityUser.findOne({
                where: { id: product?.getDataValue("userId") },
            });

            let requestNotificationBody = `${user?.getFullname()} is requesting for ${product?.getDataValue(
                "productName"
            )}`;
            // let transferorNotificationBody = `You have seccessfully sent an amount of ${amount} to the account number ${transfereeAccountNumber}`;
            // let responseMessage = `You have seccessfully sent an amount of ${amount} from the account number ${transferorAccountNumber} to the account number ${transfereeAccountNumber}`;

            let notificationTitle = "Product Request";
            let notificationType = "request";
            let notificationFrom = userId;
            let createdAt = new Date();

            await CommodityNotification.create({
                message: requestNotificationBody,
                notificationFrom,
                notificationType,
                title: notificationTitle,
                userId: productOwner?.getDataValue("id"),
                createdAt,
            });

            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Added a request sucessfully",
                    newProduct
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    /////////////////////////// GET ALL REQUEST PRODUCTS //////////////////////

    app.get("/api/marketing/products/request/:userId", async (req, res) => {
        const { userId } = req.params;
        try {
            let productRequests = await CommodityProductRequest.findAll({
                where: { userId },
            });
            let productIds = productRequests.map((request) =>
                request.getDataValue("productId")
            );
            const requestedProducts = await CommodityProduct.findAll({
                where: { id: productIds },
            });
            res.status(responseStatusCode.OK).json(
                getResponseBody(responseStatus.SUCCESS, "", requestedProducts)
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    /////////////////////////////// DELETE A REQUEST /////////////////////////////////

    app.delete(
        "/api/marketing/products/request/:productId/:userId",
        async (req: express.Request, res: express.Response) => {
            const { productId, userId } = req.params;
            let proRequest = await CommodityProductRequest.findOne({
                where: { productId, userId },
            });
            try {
                let proRequest = await CommodityProductRequest.findOne({
                    where: { productId, userId },
                });
                if (!proRequest) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `Request with productId ${productId} and userId ${userId} does not exist`,
                    });
                }
                await proRequest.destroy();
                res.status(responseStatusCode.DELETED).json(
                    getResponseBody(
                        responseStatus.SUCCESS,
                        "Successfully deleted a request"
                    )
                );
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json(
                    getResponseBody(responseStatus.ERROR, "", err)
                );
            }
        }
    );

    ////////////////////////// ADD PRODUCT REVIEW //////////////////////////////

    app.post("/api/marketing/products/reviews/", async (req, res) => {
        const { productId, userId} = req.body;

        try {
            const review = await CommodityProductReview.create({
                productId,
                userId,
                createdAt: new Date(),
            });
            let reviews = await CommodityProductReview.findAndCountAll({where:{id:productId}})
     
            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    `Successsfully reviewd a productId = ${productId}`,
                     {reviewed:true,reviewsCount:reviews.count}
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

}
