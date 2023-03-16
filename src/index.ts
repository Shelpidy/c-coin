import express from 'express';
import dotenv from 'dotenv';
import mailRouter from './controllers/mail/MailController';
dotenv.config();

const PORT = process.env.PORT;
const app: express.Application = express();
mailRouter(app);

app.get('/', (request: express.Request, response: express.Response) => {
    response.status(200).send('Hello world');
});
app.listen(PORT, () => {
    console.log('Listening to port ', PORT);
});
