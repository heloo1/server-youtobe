import jwt from 'jsonwebtoken';
import { createError } from './error.js';
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token)
        return next(createError(401, 'Your are not authorized to access'));
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err)
            return next(
                createError(
                    403,
                    'Your are not authorized to access wrong accesstoken'
                )
            );
        req.user = user;
        next();
    });
};
