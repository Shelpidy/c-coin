import express from "express";
import CommodityPostComment from "../models/ComPostComments";
import CommodityPostLike from "../models/ComPostLikes";
import CommodityPost from "../models/ComPosts";
import {
    getResponseBody,
    responseStatus,
    responseStatusCode,
} from "../utils/Utils";
import CommodityFollower from "../models/ComFollowers";
import { CommodityUserContact } from "../models/ComUserContacts";
import { CommodityUser } from "../models/ComUsers";
import CommodityPostShare from "../models/ComPostShares";

export default function mediaController(app: express.Application) {
    //////////////////////////////////////////// Follow a user ////////////////////////////////////

    //     app.post("/api/media/follows", async (req, res) => {
    //     let { followerId, followingId } = req.body;

    //     try {
    //       const follow = await CommodityFollower.create({
    //         followerId,
    //          followingId,
    //         createdAt: new Date(),
    //       });
    //        res.status(responseStatusCode.CREATED).json(getResponseBody(responseStatus.SUCCESS,"",follow));
    //     } catch (err) {
    //       console.log(err);
    //        res.status(responseStatusCode.BAD_REQUEST).json(getResponseBody(responseStatus.ERROR,"",err));
    //     }
    //   });

    // Follow or unfollow a user

    app.put("/api/media/follows/", async (req, res) => {
        const { followerId, followingId } = req.body;
        try {
            const follow = await CommodityFollower.findOne({
                where: { followerId, followingId },
            });

            if (follow) {
                let affectedRow = await CommodityFollower.destroy({
                    where: { followerId, followingId },
                });
                if (affectedRow < 1) {
                    return res
                        .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                        .json(
                            getResponseBody(
                                responseStatus.UNPROCESSED,
                                "Fail to unfollow"
                            )
                        );
                }
                return res
                    .status(responseStatusCode.ACCEPTED)
                    .json(
                        getResponseBody(
                            responseStatus.SUCCESS,
                            "Unfollowed successfully",
                            { affectedRow, followed: false }
                        )
                    );
            }
            const newFollow = await CommodityFollower.create({
                followerId,
                followingId,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Followed Sucessfully",
                    { newFollow: newFollow, followed: true }
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    /////////////////////////// GET USERS UNFOLLOWED /////////////////////////////
    app.get(
        "/api/media/unfollowing/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followerId: userId },
                    })
                ).map((obj) => obj.getDataValue("followingId"));

                console.log([...ids, userId]);
                const users = (
                    await CommodityUser.findAll({
                        order: [["id", "DESC"]],
                    })
                ).filter(
                    (user) =>
                        ![...ids, Number(userId)].includes(
                            user.getDataValue("id")
                        )
                );
                if (!users) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: users,
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

    /////////// GET USER FOLLOWERS ////////////////////

    app.get(
        "/api/media/followers/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;
            try {
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followingId: userId },
                    })
                ).map((obj) => obj.getDataValue("followerId"));

                console.log([...ids]);
                const users = (
                    await CommodityUser.findAll({
                        order: [["id", "DESC"]],
                    })
                ).filter((user) => [...ids].includes(user.getDataValue("id")));
                if (!users) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: users,
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

    /////////////////////////// GET USERS FOLLOWED /////////////////////////////
    app.get(
        "/api/media/followings/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;

            try {
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followerId: userId },
                    })
                ).map((obj) => obj.getDataValue("followingId"));
                //   console.log(ids)
                const users = await CommodityUser.findAll({
                    where: { id: [...ids] },
                    order: [["id", "DESC"]],
                });
                if (!users) {
                    return res.status(responseStatusCode.NOT_FOUND).json({
                        status: responseStatus.ERROR,
                        message: `User with userId ${userId} does not exist`,
                    });
                }
                res.status(responseStatusCode.OK).json({
                    status: responseStatus.SUCCESS,
                    data: users,
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

    /////////////////// GET ALL POST BY A USER SESSION /////////////

    app.get(
        "/api/media/posts/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;

            try {
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followerId: userId },
                    })
                ).map((obj) => obj.getDataValue("followingId"));
                //   console.log(ids)
                const post = await CommodityPost.findAll({
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

    /////////////////// GET ALL USER POSTS /////////////

    app.get(
        "/api/media/posts/user/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;

            try {
                // let ids = (
                //     await CommodityFollower.findAll({
                //         where: { followerId: userId },
                //     })
                // ).map((obj) => obj.getDataValue("followingId"));
                //   console.log(ids)
                const post = await CommodityPost.findAll({
                    where: { userId },
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

    // Get all posts

    app.get("/api/media/posts", async (req, res) => {
        try {
            const posts = await CommodityPost.findAll();
            res.status(responseStatusCode.OK).json({
                status: responseStatus.SUCCESS,
                data: posts,
            });
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    });

    //////////// Get all user posts by userId and session
    app.get(
        "/api/media/posts/:userId",
        async (req: express.Request, res: express.Response) => {
            const { userId } = req.params;

            try {
                let ids = (
                    await CommodityFollower.findAll({
                        where: { followerId: userId },
                    })
                ).map((obj) => obj.getDataValue("followingId"));
                //   console.log(ids)
                const post = await CommodityPost.findAll({
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

    // Get a specific post by id
    //   app.get("/api/media/posts/:id", async (req, res) => {
    //     const { id } = req.params;

    //     try {
    //       const post = await CommodityPost.findByPk(id);
    //       if (!post) {
    //         return res.status(responseStatusCode.NOT_FOUND).json({
    //             status:responseStatus.ERROR,
    //             message: "Post not found" });
    //       }
    //       res.status(responseStatusCode.OK).json({
    //         status:responseStatus.SUCCESS,
    //         data:post.dataValues
    //       });
    //     } catch (err) {
    //       console.log(err);
    //             res.status(responseStatusCode.BAD_REQUEST).json({
    //                 status: responseStatus.ERROR,
    //                 data:err,
    //             });
    //     }
    //   });

    // Add a new post
    app.post("/api/media/posts", async (req, res) => {
        const {postObj:data,sharedPostId} = req.body;
        try {
            const post = await CommodityPost.create({
                ...data,
                createdAt: new Date(),
            });
            let shared = post.getDataValue("shared")
        
            if(shared){
               let sharedPost =  await CommodityPostShare.create({userId:post.getDataValue("userId"),postId:sharedPostId})
               console.log({sharedPost})
            }
            res.status(responseStatusCode.CREATED).json({
                status: responseStatus.SUCCESS,
                message: "Successfully added a post",
                data: post.dataValues,
            });
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json({
                status: responseStatus.ERROR,
                data: err,
            });
        }
    });

    // Update a post
    app.put("/api/media/posts/", async (req, res) => {
        const data = req.body;

        try {
            const post = await CommodityPost.findByPk(data?.id);
            if (!post) {
                return res
                    .status(responseStatusCode.NOT_FOUND)
                    .json(
                        getResponseBody(
                            responseStatus.ERROR,
                            `Post with Id ${data?.id} does not exist`
                        )
                    );
            }
            const newPost = await CommodityPost.update(data, {
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

    // Delete a post
    app.delete("/api/media/posts/:id", async (req, res) => {
        const { id } = req.params;

        try {
            const post = await CommodityPost.findByPk(id);
            if (!post) {
                return res.status(responseStatusCode.NOT_FOUND).json({
                    status: responseStatus.ERROR,
                    message: "Post not found",
                });
            }
            await post.destroy();
            res.status(responseStatusCode.DELETED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    "Successfully deleted a post"
                )
            );
        } catch (err) {
            console.log(err);
            res.status(responseStatusCode.BAD_REQUEST).json(
                getResponseBody(responseStatus.ERROR, "", err)
            );
        }
    });

    // Get all comments for a specific post
    app.get("/api/media/posts/comments/:postId", async (req, res) => {
        const { postId } = req.params;

        try {
            const comments = await CommodityPostComment.findAll({
                where: { postId },
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

    // Add a new comment to a post
    app.post("/api/media/posts/comments/", async (req, res) => {
        const { postId, userId, text } = req.body;

        try {
            const comment = await CommodityPostComment.create({
                postId,
                userId,
                text,
                createdAt: new Date(),
            });
            res.status(responseStatusCode.CREATED).json(
                getResponseBody(
                    responseStatus.SUCCESS,
                    `Successsfully added a comment to postId = ${postId}`,
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

    // Update a comment
    app.put("/api/media/posts/comments/", async (req, res) => {
        const { text, id } = req.body;
        try {
            const affectedRow = await CommodityPostComment.update(
                { text },
                { where: { id } }
            );
            if (affectedRow[0] < 1) {
                return res
                    .status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                    .json(
                        getResponseBody(
                            responseStatus.UNPROCESSED,
                            "Fail to update"
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

    // Delete a comment
    app.delete(
        "/api/media/posts/comments/:id",
        async (req: express.Request, res: express.Response) => {
            const { id } = req.params;
            try {
                const comment = await CommodityPostComment.findByPk(id);
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

    // Get all likes for a specific post
    app.get(
        "/api/media/posts/likes/:postId/:currentUserId",
        async (req, res) => {
            const { postId, currentUserId } = req.params;

            try {
                const likes = await CommodityPostLike.findAll({
                    where: { postId },
                });

                const userIds = likes.map((like) =>
                    like.getDataValue("userId")
                );
                const getUserFollowingIds = (
                    await CommodityFollower.findAll({
                        where: { followerId: currentUserId },
                    })
                ).map((following) => following.getDataValue("followingId"));
                let setOne = new Set(userIds);
                let setTwo = new Set(getUserFollowingIds);
                const commonIds = new Array(
                    ...new Set([...setOne].filter((item) => setTwo.has(item)))
                );
                let usersLiked = await CommodityUser.findAll({
                    where: { id: [commonIds] },
                });

                res.status(responseStatusCode.OK).json(
                    getResponseBody(responseStatus.SUCCESS, "", {
                        likes,
                        sessionUsers: usersLiked,
                    })
                );
            } catch (err) {
                console.log(err);
                res.status(responseStatusCode.BAD_REQUEST).json(
                    getResponseBody(responseStatus.ERROR, "", err)
                );
            }
        }
    );

    // Add a new like to a post
    //   app.post("/api/media/posts/likes", async (req, res) => {
    //     const { postId, userId } = req.body;

    //     try {
    //       const like = await CommodityPostLike.create({
    //         postId,
    //         userId,
    //         createdAt: new Date(),
    //       });
    //        res.status(responseStatusCode.CREATED).json(getResponseBody(responseStatus.SUCCESS,"",like));
    //     } catch (err) {
    //       console.log(err);
    //        res.status(responseStatusCode.BAD_REQUEST).json(getResponseBody(responseStatus.ERROR,"",err));
    //     }
    //   });

    // Remove and add a like from a post or unlike a post
    app.put("/api/media/posts/likes/", async (req, res) => {
        const { userId, postId } = req.body;
        try {
            const follow = await CommodityPostLike.findOne({
                where: { userId, postId },
            });

            if (follow) {
                let affectedRow = await CommodityPostLike.destroy({
                    where: { userId, postId },
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
                            "unliked a post successfully",
                            { affectedRow }
                        )
                    );
            }
            const newFollow = await CommodityPostLike.create({
                userId,
                postId,
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

    //////////////////// Get all ,SHARE and LIKES for a specific post///////////////////

    app.get("/api/media/posts/cls/:postId", async (req, res) => {
        const { postId } = req.params;

        try {
            const comments = await CommodityPostComment.findAndCountAll({
                where: { postId },
            });

            const likes = await CommodityPostLike.findAndCountAll({
                where: { postId },
            });

            const shares = await CommodityPostShare.findAndCountAll({
                where: { postId },
            });

            let comLikeData = { comments, likes, shares};
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
}
