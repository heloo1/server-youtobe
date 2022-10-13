import express from 'express';
import {
    deleteUser,
    getUser,
    like,
    subscribe,
    unLike,
    unSubscribe,
    update,
} from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';
const router = express.Router();

// update user
router.put('/:id', verifyToken, update);
// delete user
router.delete('/:id', verifyToken, deleteUser);
// get user
router.get('/find/:id', verifyToken, getUser);
// subscribe a user
router.put('/sub/:id', verifyToken, subscribe);
// unsubscribe
router.put('/unsub/:id', verifyToken, unSubscribe);
// like video
router.put('/like/:videoId', verifyToken, like);
// dislike
router.put('/dislike/:videoId', verifyToken, unLike);

export default router;
