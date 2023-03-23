import express from "express";
import dotenv from "dotenv";
import mailRouter from "./controllers/mail/MailController";
import authRouter from "./controllers/api/auth/Auth";
import authorizeApiAccess from "./middlewares/ApiAccess";
dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authorizeApiAccess);

authRouter(app);
mailRouter(app);

app.get("/", (request: express.Request, response: express.Response) => {
    response.status(200).json({
        message: "Getting started with Commodity",
    });
});

app.listen(PORT, () => {
    console.log("Listening to port ", PORT);
});
