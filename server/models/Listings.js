const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    // basic info
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['house', 'apartment', 'villa', 'room', 'cottage', 'cabin', 'other'],
        default: 'house'
    },
    location: {
        city: String,
        state: String,
        country: String,
        address: String,
        // coordinates: {
        //     lat: Number,
        //     lng: Number
        // }
    }, 
    images: [{
        url: String,
        caption: String,
        isMain: Boolean  // first image with isMain:true is the card image
    }],
    // property details
    details: {
        bedrooms: Number,
        bathrooms: Number,
        beds: Number,
        guests: Number,
        amenities: [String]  // ['wifi', 'kitchen', 'pool', 'ac']
    },
    // pricing
    pricing: {
        basePrice: Number,
        currency: {
            type: String,
            default: 'INR'
        },
        cleaningFee: Number,
        serviceFee: Number
    },
    // host Info
    host: {
        name: String,
        bio: String,
        profileImage: String,
        joinedDate: Date,
        isSuperhost: Boolean
    },
    // ratings and reviews
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: null
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    isGuestFavorite: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // for special carousels (like Airbnb Originals)
    badge: {
        type: String,
        default: null  // 'original', etc.
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }  
})

// get main image to display in the frontend
// listingSchema.virtual('mainImage').get(function() {
//     const mainImg = this.images.find(img => img.isMain)
//     return mainImg ? mainImg.url : (this.images[0]?.url || '')
// })
listingSchema.virtual('mainImage').get(function() {
    if (!this.images || this.images.length === 0) {
        return 'https://via.placeholder.com/300x300?text=No+Image' // placeholder if image is not loading
    }
    const mainImg = this.images.find(img => img.isMain)
    return mainImg ? mainImg.url : this.images[0].url
})

module.exports = mongoose.model('Listing', listingSchema)