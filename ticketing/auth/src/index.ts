import express from 'express';
import { json } from 'body-parser';

const app = express();
//use json middleware to parse json from incoming request
//without json, we cannot use req.body
app.use(json());

app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
});