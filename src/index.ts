import express from "express";
import dotenv from "dotenv";
import authorizeApiAccess from "./middlewares/ApiAccess";
import CommodityController from "./controllers/CommodityController";
import TransactionController from "./controllers/TransactionController";
import CORS from "cors";
import { runCommodityConsumer } from "./events/consumers";


dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authorizeApiAccess);
app.use(CORS());


CommodityController(app);
TransactionController(app);

runCommodityConsumer().catch(err =>{
    console.log("Consumer Error =>",err)
})

app.get("/", (request: express.Request, response: express.Response) => {
    response.status(200).json({
        message: "Getting started with Commodity",
    });
});

app.listen(PORT, () => {
    console.log("Listening to port ", PORT);
});
