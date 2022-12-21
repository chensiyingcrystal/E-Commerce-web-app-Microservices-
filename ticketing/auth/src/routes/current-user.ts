import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    res.send("Hi there new edition");
});

export { router as currentUserRouter };