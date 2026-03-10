import dayjs from 'dayjs';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

// import { serve }  = require('@upstash/workflow/express');
import { serve } from '@upstash/workflow/express';
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [15, 7, 3, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') {
        console.log(`Subscription ${subscriptionId} is not active. Stopping workflow.`);
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    // If the renewal date is somehow in the past (e.g. the db pre-save auto-roll hasn't triggered), 
    // stop so we don't accidentally send stale reminders
    if(renewalDate.isBefore(dayjs().subtract(1, 'day'))) {
        console.log(`Renewal date for active subscription ${subscriptionId} is stale. Stopping workflow until DB rolls it forward.`);
        return;
    };

    for(const daysBefore of REMINDERS) {
        // add day insead of seconds
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before reminder`, reminderDate);
        }
        //, 'day' add
        if (dayjs().isAfter(reminderDate)) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
    }
});



const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user','name email');
    })
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} at ${date}`);
    return await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`triggering ${label} reminder`);
        //send email, notification
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription,
        })
    })
}