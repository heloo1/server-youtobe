import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

export const signup = async (req, res, next) => {
    try {
        console.log('bodt', req.body);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).json({
            message: 'success',
        });
    } catch (err) {
        console.log(err);
        next(createError(404, 'not found sorry'));
    }
};
export const signin = async (req, res, next) => {
    try {
        console.log('body', req.body);
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, 'User not found'));

        const isCorrect = bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) return next(createError(400, 'Wrong credentials'));
        const token = jwt.sign({ id: user._id }, process.env.JWT);
        const { password, ...other } = user._doc;
        res.status(200).json({
            accessToken: token,
            user: other,
        });
    } catch (err) {
        console.log(err);
        next(createError(404, 'not found sorry'));
    }
};
export const getUser = async (req, res, next) => {
    try {
        console.log('kk', req.user);
        const user = await User.findById(req.user.id);
        res.status(200).json({
            message: 'success',
            data: user,
        });
    } catch (err) {
        console.log(err);
    }
};
