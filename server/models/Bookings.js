const mongoose = require('mongoose')


const BookingSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },

    checkIn: {
        type: Date 
    },

    checkOut: {
        type: Date 
    },

    guests: {
        type: Number
    },

    pricing: {
        basePrice: { type: Number, required: true },
        nights: { type: Number, required: true },
        cleaningFee: { type: Number, default: 0 },
        serviceFee: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true }
    },

    status: {
        type: String,
        enum: ['pending','confirmed','cancelled'],
        default: 'pending'
    }
},{
    timestamps:true
})

BookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 })

module.exports = mongoose.model('Booking', BookingSchema)