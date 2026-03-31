const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        default: 'India'
    },

    otp: {
        type: String,
        default: null
    },
    otpCreatedAt: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null,
        sparse: true  
    },
    profileImage: {
        type: String,
        default: null
    },
    
    isProfileComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// otp expires after 10 minutes
userSchema.methods.isOtpValid = function() {
    if (!this.otpCreatedAt) return false
    const tenMinutes = 10 * 60 * 1000
    return (Date.now() - this.otpCreatedAt) < tenMinutes
}

module.exports = mongoose.model('User', userSchema)