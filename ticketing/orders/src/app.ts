import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler } from '@crystaltickets/common';
import { NotFoundError } from '@crystaltickets/common';
import { currentUser } from '@crystaltickets/common';
import { deleteOrderRouter } from './routes/cancel-order';
import { newOrderRouter } from './routes/create-new-order';
import { showOrderRouter } from './routes/show-order';
import { indexOrderRouter } from './routes';

const app = express();
app.set('trust proxy', true); 
//use json middleware to parse json from incoming request
//without json, we cannot use req.body
app.use(json());
//check the cookie and set req.session property
app.use(cookieSession({
    signed: false, //ban signing
    secure: process.env.NODE_ENV !== 'test' //require https connection
}));
app.use(currentUser); //for each request into our app we will check its currentuser
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
    //404 error code
    throw new NotFoundError();
});

app.use(errorHandler);

// app.get('/api/users/currentuser', (req, res) => {
//     res.send('hello there');
// });


export { app };
