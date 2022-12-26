import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true); 
//use json middleware to parse json from incoming request
//without json, we cannot use req.body
app.use(json());
app.use(cookieSession({
    signed: false, //ban signing
    secure: true //require https connection
}))
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    console.log('chensiying debug...');
    throw new NotFoundError();
});

app.use(errorHandler);

// app.get('/api/users/currentuser', (req, res) => {
//     res.send('hello there');
// });


export { app };
