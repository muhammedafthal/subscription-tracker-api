import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is requored'],
        min: [0, 'Price must be greater than 0'],
        max: [1000, 'Price must be less than 1000'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    },
    category: {
        type: String,
        enum: ['Sports', 'News', 'Entertainment', 'Lifestyle', 'Technology', 'Finance', 'Politics', 'Other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Expired'],
        default: 'Active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => 
                value <= new Date(),
                message: 'Start date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

}, {timestamps: true});

// Auto-calculate renewal date if missing.
subscriptionSchema.pre('save', function()    {
    if(!this.renewalDate) {
        const renewalPeriods = {
            Daily: 1,
            Weekly: 7,
            Monthly: 30,
            Yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    
    // Auto-update the status if renewal date has passed
    if(this.renewalDate < new Date()) {
        this.status = 'Expired';
    };
    console.log(this.renewalDate);
});

const subscription = mongoose.model('Subscription', subscriptionSchema);

export default subscription;