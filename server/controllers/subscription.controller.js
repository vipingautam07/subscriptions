import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        })

        let workflowRunId = null;
        try {
            const result = await workflowClient.trigger({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: {subscriptionId: subscription._id},
                headers: {
                    'Content-Type': 'application/json',
                },
                retries: 0,
            })
            workflowRunId = result.workflowRunId;
        } catch (workflowError) {
            console.error("Workflow trigger failed (non-fatal):", workflowError.message);
        }
        
        res.status(201).json({ success: true, data: subscription, workflowRunId });
    } 
    catch(error) {
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}

export const getUserSubscription = async (req, res, next) => {
    try {

        if(req.user.id !== req.params.id) {
            const error = new Error('You are not owner of this account');
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({
            user: req.params.id
        })

        
        res.status(200).json({ success: true, data: subscriptions });
    } 
    catch(error) {
        next(error);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status: 'cancelled' },
            { new: true }
        );

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
}

export const resumeSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id, status: 'cancelled' },
            { status: 'active' },
            { new: true, runValidators: true }
        );

        if (!subscription) {
            const error = new Error('Subscription not found or already active');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!subscription) {
            const error = new Error('Subscription not found');
            error.status = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
}