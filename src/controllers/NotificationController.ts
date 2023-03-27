import express from "express"
import { Commodity } from "../models/Commodities"
import { responseStatus,responseStatusCode } from "../utils/Utils"

export default (router:express.Application)=>{

    router.post("/api/notifications/",async(request:express.Request,response:express.Response)=>{
        try{
             let commodity = request.body
             let createdAt = new Date()
             let createdCommodity = await Commodity.create({...commodity,createdAt})
             if(createdCommodity){
                response.status(responseStatusCode.CREATED).json({
                    status:responseStatus.SUCCESS,
                    message:`You have successfully added an amout of ${commodity?.balance} to the user's account ${commodity?.email}`,
                    data:createdCommodity
                })
             }else{
                 response.status(responseStatusCode.UNPROCESSIBLE_ENTITY)
                .json({
                    status: responseStatus.UNPROCESSED,
                    message: "Failed to create a user",
                });
             }

        }catch(err){
            console.log(err);
            response.status(responseStatusCode.BAD_REQUEST)
                .json({
                    status: responseStatus.ERROR,
                    message: err,
                });
        }
       
    })

    ////////////////////// CHECK BALANCE /////////////////////////

    router.get("/api/notifications/checkbalance/:email",async(request:express.Request,response:express.Response)=>{
        try{
            let email = request.params.email
            let commodity = await Commodity.findOne({where:{email}})

            if(commodity){
                response.status(responseStatusCode.OK).json({
                    status:responseStatus.SUCCESS,
                    balance:commodity?.getDataValue('balance')
                })
            }else{
                  response.status(responseStatusCode.NOT_FOUND).json({
                    status:responseStatus.ERROR,
                    balance:'C 0.00'
                })

            }

        }catch(err){
            console.log(err);
            response.status(responseStatusCode.BAD_REQUEST)
                .json({
                    status: responseStatus.ERROR,
                    message: err,
                });

        }

    })

    /////////////////// GET COMMODITY  //////////////////////////

    
    router.get("/api/notifications/:email",async(request:express.Request,response:express.Response)=>{
        try{
            let email = request.params.email
            let commodity = await Commodity.findOne({where:{email}})

            if(commodity){
                response.status(responseStatusCode.OK).json({
                    status:responseStatus.SUCCESS,
                    data:commodity
                })
            }else{
                  response.status(responseStatusCode.NOT_FOUND).json({
                    status:responseStatus.ERROR,
                    data:commodity
                })
            }

        }catch(err){
            console.log(err);
            response.status(responseStatusCode.BAD_REQUEST)
                .json({
                    status: responseStatus.ERROR,
                    message: err,
                });
        }

    })


    //////////////////////// GET ALL COMMODITIES ///////////////////////////////////

     router.get("/api/notifications/",async(request:express.Request,response:express.Response)=>{
        try{
            let notifications = await Commodity.findAll()
                response.status(responseStatusCode.OK).json({
                    status:responseStatus.SUCCESS,
                    data:notifications
                })
         
        }catch(err){
            console.log(err);
            response.status(responseStatusCode.BAD_REQUEST)
                .json({
                    status: responseStatus.ERROR,
                    message: err,
                });
        }

    })

////////////////////////// DELETE COMMODITY ///////////////////////

 router.delete("/api/notifications/:email",async(request:express.Request,response:express.Response)=>{
            try {
                let email = request.params.email;
                let deleteObj = await Commodity.destroy({
                    where: { email },
                });
                if (deleteObj > 0) {
                    response.status(responseStatusCode.ACCEPTED).json({
                        status: responseStatus.SUCCESS,
                        message: "Successfully deleted a user commodity record",
                        deleteObj: deleteObj,
                    });
                } else {
                    response.status(responseStatusCode.UNPROCESSIBLE_ENTITY).json({
                        status: responseStatus.UNPROCESSED,
                        message: `Failed to delete user's commodity with email ${email}`,
                    });
                }
            } catch (err) {
                console.log(err);
                response.status(responseStatusCode.BAD_REQUEST).json({
                    status: responseStatus.ERROR,
                    message:err,
                });
            }
        })



}