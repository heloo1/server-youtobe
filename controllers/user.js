import { ObjectId } from 'mongodb';
import { createError } from '../error.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

export const update = async (req, res, next) => {
    console.log('da vao day');
    if (req.params.id === req.user.id) {
        console.log('da id', req.user.id);
        console.log('check body', req.body);
        try {
            const updateUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                {
                    new: true,
                }
            );
            res.status(200).json(updateUser);
        } catch (err) {
            console.log('err', err);
        }
    } else {
        return next(createError(403, 'You can update only account'));
    }
};
export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        console.log('da id', req.user.id);
        console.log('check body', req.body);
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json('User has been deleted');
        } catch (err) {
            console.log('err', err);
        }
    } else {
        return next(createError(403, 'You can delete only account'));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json('Subscription successfully');
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export const unSubscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 },
        });
        res.status(200).json('Unsubscription successfully');
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(ObjectId(videoId), {
            $addToSet: { likes: id },
            $pull: { dislikes: id },
        });
        res.status(200).json('The video hasbeen liked');
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export const unLike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id },
        });
        res.status(200).json('The video hasbeen disliked');
    } catch (err) {
        console.log(err);
        next(err);
    }
};
