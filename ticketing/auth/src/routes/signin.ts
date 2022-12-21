import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
    res.send("Hi there new edition");
});

export { router as signinRouter };