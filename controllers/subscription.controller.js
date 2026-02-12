import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {        
        const userSubscription = await subscription.create({
            ...req.body,
            user: req.user.userId,
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: userSubscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        console.log(workflowRunId);

        res.status(201).json({
            success: true,
            data: userSubscription,
            workflowRunId
        })
    } catch (error) {
        next(error);        
    }
}

export const getUserSubscription = async (req, res, next) => {
    try {
        // Check if the user is the same as the one in token.
        if(req.user.userId !== req.params.id) {
            console.log(req.user.id);
            
            const error = new Error('You are not the owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await subscription.find({ user: req.params.id});

        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error)
    }
}