const mongoose = require('mongoose')

const carouselSchema = new mongoose.Schema({
    // carousel info
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: null
    },
    page: {
        type: String,
        enum: ['home', 'experiences', 'services'],
        default: 'home',
        required: true
    },
    // display settings
    cardType: {
        type: String,
        enum: ['card1', 'card2'],
        default: 'card1'
    },
    showLastCard: {
        type: Boolean,
        default: true
    },
    lastCardImages: [String],
    // listings in this carousel
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    // order and status
    order: {
        type: Number,
        default: 0  // lower the number = appears first on homepage
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Carousel', carouselSchema)