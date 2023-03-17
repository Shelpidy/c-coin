import express from "express"

export default (router:express.Application)=>{
    router.get("/",(request:express.Request,response:express.Response)=>{
        response.status(200).json({
            message:"Getting started with Commodity"
        })

    })
    
}