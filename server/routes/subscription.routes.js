import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscription, getAllSubscriptions, cancelSubscription, deleteSubscription, updateSubscription, resumeSubscription } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getAllSubscriptions);

subscriptionRouter.get('/:id', (req, res) => {
    res.send({
        title: 'get specific subscriptions'
    });
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscription);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.put('/:id/resume', authorize, resumeSubscription);

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({
        title: 'get upcoming renewals'
    });
});


export default subscriptionRouter;