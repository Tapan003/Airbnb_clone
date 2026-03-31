const express = require('express')
const router = express.Router()
const Listing = require('../models/Listings')
const fs = require('fs').promises

// list all listings
router.get('/', async (req, res) => {
    try {
        const { city, minPrice, maxPrice, guests } = req.query
        let query = { isActive: true }
        
        // city filter
        if (city) {
            query['location.city'] = city
        }
        
        // price filter
        if (minPrice || maxPrice) {
            query['pricing.basePrice'] = {}
            if (minPrice) query['pricing.basePrice'].$gte = Number(minPrice)
            if (maxPrice) query['pricing.basePrice'].$lte = Number(maxPrice)
        }
        
        // guest capacity filter
        if (guests) {
            query['details.guests'] = { $gte: Number(guests) }
        }
        const listings = await Listing.find(query)
            .populate('owner', 'phoneNumber')
            .sort({ createdAt: -1 })
        
        res.json({ listings })
    } catch (error) {
        console.error('Get listings error:', error)
        res.status(500).json({ message: 'Failed to get listings' })
    }
})

// get a single listing by ID
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('owner', 'phoneNumber country')
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' })
        }
        res.json({ listing })
    } catch (error) {
        console.error('Get listing error:', error)
        res.status(500).json({ message: 'Failed to get listing' })
    }
})

// create a new listing
router.post('/', async (req, res) => {
    try {
        const listingData = req.body

        // validation
        if (!listingData.title || !listingData.owner) {
            return res.status(400).json({ 
                message: 'Title and owner are required' 
            })
        }
        const listing = await Listing.create(listingData)
        res.status(201).json({ 
            message: 'Listing created successfully',
            listing 
        })
    } catch (error) {
        console.error('Create listing error:', error)
        res.status(500).json({ message: 'Failed to create listing' })
    }
})

// update listing
router.put('/:id', async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after', runValidators: true }
        )
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' })
        }
        res.json({ 
            message: 'Listing updated successfully',
            listing 
        })
    } catch (error) {
        console.error('Update listing error:', error)
        res.status(500).json({ message: 'Failed to update listing' })
    }
})

// delete listing
router.delete('/:id', async (req, res) => {
    console.log("Delete attempt for ID:", req.params.id);
    try {
        const listing = await Listing.findById(req.params.id)
        console.log(listing.images[0].url)
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' })
        } 
        if (listing.images[0].url) {
        try {
            const originalPath = listing.images[0].url
            const filePath = originalPath.replace('http://localhost:5000','.') 
            await fs.unlink(filePath);
            console.log(`Successfully deleted: ${filePath}`);
        } catch (fileError) {
            if (fileError.code !== 'ENOENT') {
            console.error(`System error deleting file: ${fileError.message}`);
        } else {
          console.warn(`File already missing from system: ${listing.images[0].url}`);
        }
      }
    }
    await Listing.findByIdAndDelete(req.params.id)
    res.json({ message: 'Listing and associated files deleted successfully' });

    } catch (error) {
        console.error('Delete listing error:', error)
        res.status(500).json({ message: 'Failed to delete listing' })
    }
})

module.exports = router