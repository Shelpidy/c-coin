import express from "express";
import dotenv from "dotenv";
import authorizeApiAccess from "./middlewares/ApiAccess";
import CommodityController from "./controllers/CommodityController";
import TransactionController from "./controllers/TransactionController";
import AuthController from "./controllers/AuthController";
// import MailController from "./controllers/MailController";
import NotificationController from "./controllers/NotificationController";
import MediaController from "./controllers/MediaController";
import CORS from "cors"

dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authorizeApiAccess);
app.use(CORS())


AuthController(app);
// MailController(app);
MediaController(app);
CommodityController(app);
TransactionController(app);
NotificationController(app);

app.get("/", (request: express.Request, response: express.Response) => {
    response.status(200).json({
        message: "Getting started with Commodity",
    });
});

app.listen(PORT, () => {
    console.log("Listening to port ", PORT);
});
