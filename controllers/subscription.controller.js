import subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const userSubscription = await subscription.create({
            ... req.body,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: userSubscription
        })
    } catch (error) {
        next(error);
    }
}