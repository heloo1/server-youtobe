import { createError } from '../error.js';
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import User from '../models/User.js';
import { ObjectId } from 'mongodb';
export const addComment = async (req, res, next) => {
    req.body.videoId = ObjectId(req.body.videoId);
    const newComment = new Comment({
        ...req.body,
        userId: ObjectId(req.user.id),
    });
    try {
        const savedComment = await newComment.save();
        const comment = await Comment.aggregate([
            { $match: { _id: ObjectId(savedComment._id) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: '$_id',
                                name: '$name',
                                img: '$img',
                            },
                        },
                    ],
                    as: 'user',
                },
            },
        ]);
        res.status(200).send(comment);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(res.params.id);
        const video = await Video.findById(res.params.id);
        if (req.user.id === comment.userId || req.user.id === video.userId) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json('The comment has been deleted');
        } else {
            return next(createError(403, 'Ypu can delete only your comment '));
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const getComment = async (req, res, next) => {
    console.log('a', ObjectId(req.params.videoId));
    try {
        const comment = await Comment.aggregate([
            { $match: { videoId: ObjectId(req.params.videoId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $project: {
                                _id: '$_id',
                                name: '$name',
                                img: '$img',
                            },
                        },
                    ],
                    as: 'user',
                },
            },
        ]);
        res.status(200).json(comment);
    } catch (err) {
        console.log(err);
        next(err);
    }
};
