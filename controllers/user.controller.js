import user from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await user.find();

        res.status(200).json({
            success: true,
            data: allUsers
        });
    }  catch(error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const getUser = await user.findById(req.params.id).select('-password');

        if(!getUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: getUser
        });
    }  catch(error) {
        next(error);
    }
};