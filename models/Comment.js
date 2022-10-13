import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            required: true,
        },
        videoId: {
            type: ObjectId,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);
export default mongoose.model('Comment', CommentSchema);
