import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0']
    },
    currency: {
        type: String,
        enum: ['USD', 'INR', 'EUR', 'GBP'],
        default: 'INR'
    },
    frequency: {
        type: String,
        enum: ['monthly', 'yearly', 'weekly', 'daily'],
        required: [true, 'Subscription frequency is required']
    },
    category: {
        type: String,
        enum: ['entertainment', 'education', 'technology', 'productivity', 'health', 'finance', 'other'],
        required: [true, 'Subscription category is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'paused', 'ended', 'expired'], // Kept 'expired' for backwards compatibility
        default: 'active'
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required'],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in past'
        }
    },
    renewalDate: {
        type: Date,
        // required: [true, 'Subscription start date is required'],
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }

}, { timestamps: true });

import { calculateNextRenewalDate } from '../utils/renewal.utils.js';

// Auto calculate renewal date and manage subscription lifecycle
subscriptionSchema.pre('save', async function(next) {
    const today = new Date();

    // 1. Initial Creation: Set first renewal date if completely missing
    if (!this.renewalDate) {
        this.renewalDate = calculateNextRenewalDate(this.startDate, this.frequency);
    }

    // 2. Lifecycle transitions mapping based on renewal Date
    if (this.renewalDate < today) {
        if (this.status === 'active') {
            // Roll the active subscription forward to the next billing cycle
            // We loop in case a subscription hasn't been synced for multiple cycles
            let computedRenewal = new Date(this.renewalDate);
            while (computedRenewal < today) {
                computedRenewal = calculateNextRenewalDate(computedRenewal, this.frequency);
            }
            this.renewalDate = computedRenewal;
            
        } else if (this.status === 'cancelled') {
            // User cancelled it. The billing cycle finished. It is now ended.
            this.status = 'ended';
            
        } else if (this.status === 'expired') {
            // Migrate legacy "expired" tag to the formalized "ended" tag
            this.status = 'ended';
        }
        // Paused subscriptions remain paused, their renewalDate sits still until resumed.
    }

});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;