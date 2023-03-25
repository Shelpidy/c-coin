import express from "express"
import { Commodity } from "../models/Commodities"
import { responseStatus,responseStatusCode } from "../utils/Utils"

export default (router:express.Application)=>{

    router.post("/api/commodities/",async(request:express.Request,response:express.Response)=>{
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

    router.get("/api/commodities/checkbalance/:email",async(request:express.Request,response:express.Response)=>{
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

    
    router.get("/api/commodities/:email",async(request:express.Request,response:express.Response)=>{
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

     router.get("/api/commodities/",async(request:express.Request,response:express.Response)=>{
        try{
            let commodities = await Commodity.findAll()
                response.status(responseStatusCode.OK).json({
                    status:responseStatus.SUCCESS,
                    data:commodities
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

    
}