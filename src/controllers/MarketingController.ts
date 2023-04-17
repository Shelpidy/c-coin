import express from "express";
import CommodityPost from "../models/ComPosts";
import {
    getResponseBody,
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
import type {MakePurchaseParams} from "../utils/Utils.d"

export default function MarketingController(app: express.Application) {
 
    /////////////////////////// GET USERS AFFILIATED PRODUCTS /////////////////////////////
   app.get(
        "/api/marketing/affiliates/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let ids = (
                    await CommodityProductAffiliate.findAll({
                        where:{affiliateId:userId}
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
                    data:products,
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
        const {affiliateId,productId,userId} = req.body;
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
            const affilatedRecord = await CommodityProductAffiliate.findByPk(id);
            if (!affilatedRecord) {
                return res.status(responseStatusCode.NOT_FOUND).json({
                    status: responseStatus.ERROR,
                    message: "Affiliated Record not found",
                });
            }
            await affilatedRecord.destroy();
            res.status(responseStatusCode.ACCEPTED).json(
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
            const sales = await CommodityProductSale.findAll({where:{sellerId}});
            res.status(responseStatusCode.ACCEPTED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "",
                    sales
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    /////////////////// GET ALL PRODUCTS BY A USER SESSION /////////////

    app.get("/api/marketing/products/session/:userId",
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

    app.get("/api/marketing/products/user/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let usersId = (await CommodityProductAffiliate.findAll({attributes:['userId'],where:{affiliateId:userId}})).map(obj => obj.getDataValue("userId"))
                console.log("Other users",usersId)
                const products = await CommodityProduct.findAll({
                    where: {userId:[...usersId,userId]},
                    order: [["id", "DESC"]],
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

    //////////////////////////// Get all products //////////////////////////

    app.get("/api/marketing/products", async (req, res) => {
        try {
            const products = await CommodityProduct.findAll();
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
    });

    //////////// Get all user products by userId and products followings //////////
    app.get(
        "/api/marketing/products/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;

            try {
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
            res.status(responseStatusCode.ACCEPTED).json(
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
        const { productId} = req.params;

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
                res.status(responseStatusCode.ACCEPTED).json(
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
            const follow = await CommodityProductLike.findOne({
                where: { userId, productId },
            });

            if (follow) {
                let affectedRow = await CommodityProductLike.destroy({
                    where: { userId, productId },
                });
                if (affectedRow < 1) {
                    return res
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json(
                            getResponseBody(
                                responseStatus.UNPROCESSED,
                                "Fail to unlike a product"
                            )
                        );
                }
                return res
                    .status(responseStatusCode.ACCEPTED)
                    .json(
                        getResponseBody(
                            responseStatus.SUCCESS,
                            "unliked a product successfully",
                            { affectedRow }
                        )
                    );
            }
            const newFollow = await CommodityProductLike.create({
                userId,
                productId,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Liked a post sucessfully",
                    newFollow
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });


//////////////////// Get all COMMENTS and LIKES for a specific pRODUCT///////////////////

    app.get("/api/marketing/products/cl/:productId", async (req, res) => {
        const { productId } = req.params;

        try {
            const comments = await CommodityProductComment.findAll({
                where: {productId },
            });

            const likes = await CommodityProductLike.findAll({
                where: {productId },
            });

            let comLikeData = {comments,likes}
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


    app.post("/api/marketing/buy",async(req:express.Request,res:express.Response)=>{

        try{
            let buyObj:MakePurchaseParams = req.body
            await makePurchacePayment(req,res,buyObj)
          
        }catch(err){
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    })
}
