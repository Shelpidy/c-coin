import express from 'express';
import dotenv from 'dotenv';
import mailRouter from './controllers/mail/MailController';
import authRouter from "./controllers/api/auth/Auth"
dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();
authRouter(app)
mailRouter(app);

app.listen(PORT, () => {
    console.log('Listening to port ', PORT);
});
