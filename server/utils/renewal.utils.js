import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// Extend dayjs with plugins for careful timezone date math
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Safely calculates the next cyclical renewal date for a subscription.
 * Handles month-end rollovers (e.g. Jan 31 + 1 month -> Feb 28).
 * 
 * @param {Date|string} currentRenewalDate The date it was SUPPOSED to renew
 * @param {string} frequency 'daily', 'weekly', 'monthly', 'yearly'
 * @returns {Date} The next calculated Date object
 */
export const calculateNextRenewalDate = (currentRenewalDate, frequency) => {
    // We use dayjs to gracefully handle leap years and distinct month lengths
    const current = dayjs(currentRenewalDate);
    
    let nextDate;
    switch (frequency) {
        case 'daily':
            nextDate = current.add(1, 'day');
            break;
        case 'weekly':
            nextDate = current.add(1, 'week');
            break;
        case 'monthly':
            nextDate = current.add(1, 'month');
            break;
        case 'yearly':
            nextDate = current.add(1, 'year');
            break;
        default:
            // Fallback strategy if frequency is missing or malformed
            nextDate = current.add(1, 'month'); 
    }

    // Return native JS Date object for Mongoose
    return nextDate.toDate();
};
