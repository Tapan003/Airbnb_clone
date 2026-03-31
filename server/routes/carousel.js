const express = require('express')
const router = express.Router()
const Carousel = require('../models/Carousel')

// get all carousels with populated listings from teh backend and send to frontend format
router.get('/', async (req, res) => {
    try {
        const { page } = req.query
        let query = { isActive: true }
        if (page) {
            query.page = page
        }
        const carousels = await Carousel.find(query)
            .populate({
                path: 'listings',
                match: { isActive: true }
            })
            .sort({ order: 1 })
        
        // sending part to the frontend format, this is the shecma that is being sent to the frontend, you can modify it as per your frontend needs
        const formattedCarousels = carousels.map(carousel => ({
            id: carousel._id,
            title: carousel.title,
            subtitle: carousel.subtitle,
            cardType: carousel.cardType,
            showLastCard: carousel.showLastCard,
            lastCardImages: carousel.lastCardImages,
            page: carousel.page,
            order: carousel.order,
            cards: carousel.listings.map(listing => ({
                id: listing._id,
                imageUrl: listing.mainImage,
                title: listing.title,
                description: `₹ ${listing.pricing.basePrice} for 2 nights`
            }))
        }))
        
        res.json({ carousels: formattedCarousels })
    } catch (error) {
        console.error('Get carousels error:', error)
        res.status(500).json({ message: 'Failed to get carousels' })
    }
})

// creates the carousel
router.post('/', async (req, res) => {
    try {
        const carousel = await Carousel.create(req.body)
        res.status(201).json({ 
            message: 'Carousel created successfully',
            carousel 
        })
    } catch (error) {
        console.error('Create carousel error:', error)
        res.status(500).json({ message: 'Failed to create carousel' })
    }
})

// used to add a listing to carousel
router.post('/:carouselId/listings/:listingId', async (req, res) => {
    try {
        const carousel = await Carousel.findById(req.params.carouselId)
        
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' })
        }
        
        // adds a listing if not already in carousel
        if (!carousel.listings.includes(req.params.listingId)) {
            carousel.listings.push(req.params.listingId)
            await carousel.save()
        }
        
        res.json({ 
            message: 'Listing added to carousel',
            carousel 
        })
    } catch (error) {
        console.error('Add listing error:', error)
        res.status(500).json({ message: 'Failed to add listing' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { title, subtitle, cardType, page, showLastCard, order, isActive } = req.body
        
        const carousel = await Carousel.findByIdAndUpdate(
            req.params.id,
            {
                title,
                subtitle,
                cardType,
                page,
                showLastCard,
                order,
                isActive
            },
            { new: true, runValidators: true }
        )
        
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' })
        }
        
        res.json({ 
            message: 'Carousel updated successfully',
            carousel 
        })
    } catch (error) {
        console.error('Update carousel error:', error)
        res.status(500).json({ message: 'Failed to update carousel' })
    }
})

router.delete('/:carouselId/listings/:listingId', async (req, res) => {
    try {
        const carousel = await Carousel.findById(req.params.carouselId)
        
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' })
        }
        
        // removes listing
        carousel.listings = carousel.listings.filter(
            id => id.toString() !== req.params.listingId
        )
        await carousel.save()
        
        res.json({ 
            message: 'Listing removed from carousel',
            carousel 
        })
    } catch (error) {
        console.error('Remove listing error:', error)
        res.status(500).json({ message: 'Failed to remove listing' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const carousel = await Carousel.findByIdAndDelete(req.params.id)
        
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found' })
        }
        
        res.json({ message: 'Carousel deleted successfully' })
    } catch (error) {
        console.error('Delete carousel error:', error)
        res.status(500).json({ message: 'Failed to delete carousel' })
    }
})

module.exports = router