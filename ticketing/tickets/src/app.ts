import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@crystaltickets/common';
import { NotFoundError } from '@crystaltickets/common';

const app = express();
app.set('trust proxy', true); 
//use json middleware to parse json from incoming request
//without json, we cannot use req.body
app.use(json());
app.use(cookieSession({
    signed: false, //ban signing
    secure: process.env.NODE_ENV !== 'test' //require https connection
}));

app.all('*', async () => {
    console.log('chensiying debug...');
    throw new NotFoundError();
});

app.use(errorHandler);

// app.get('/api/users/currentuser', (req, res) => {
//     res.send('hello there');
// });


export { app };
