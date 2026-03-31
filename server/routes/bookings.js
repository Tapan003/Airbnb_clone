const express = require('express')
const router = express.Router()
const Booking = require('../models/Bookings')
const Listing = require('../models/Listings')
const User = require('../models/Users')

router.post('/', async (req, res) => {
    try {
        const { listing, checkIn, checkOut, guests, pricing, userId } = req.body
        if (!listing || !checkIn || !checkOut || !guests || !userId) {
            return res.status(400).json({ 
                message: 'Missing required fields: listing, checkIn, checkOut, guests, userId' 
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const listingDoc = await Listing.findById(listing)
        if (!listingDoc) {
            return res.status(404).json({ message: 'Listing not found' })
        }

        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)
        
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ message: 'Check-out must be after check-in' })
        }

        const overlappingBooking = await Booking.findOne({
            listing,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
               
                { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
                { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
                { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } }
            ]
        })

        if (overlappingBooking) {
            return res.status(400).json({ 
                message: 'These dates are no longer available. Please select different dates.' 
            })
        }

        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
        const basePrice = listingDoc.pricing.basePrice * nights
        const cleaningFee = listingDoc.pricing.cleaningFee || 0
        const serviceFee = Math.round(basePrice * 0.10) 
        const calculatedTotal = basePrice + cleaningFee + serviceFee

        const booking = await Booking.create({
            user: userId,
            listing,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            pricing: {
                basePrice: listingDoc.pricing.basePrice,
                nights,
                cleaningFee,
                serviceFee,
                totalPrice: calculatedTotal
            },
            status: 'pending'
        })

        const populatedBooking = await Booking.findById(booking._id)
            .populate({
                path: 'listing',
                select: 'title location pricing images', 
                options: { virtuals: true } 
            })
            .populate('user', 'name phoneNumber email')

        res.status(201).json({
            message: 'Booking request created successfully! Waiting for host confirmation.',
            booking: populatedBooking
        })

    } catch (error) {
        console.error('Create booking error:', error)
        res.status(500).json({ message: 'Failed to create booking' })
    }
})

router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate({
                path: 'listing',
                select: 'title location pricing images', 
                options: { virtuals: true }
            })
            .sort({ createdAt: -1 })

        res.json({ bookings })
    } catch (error) {
        console.error('Get user bookings error:', error)
        res.status(500).json({ message: 'Failed to get bookings' })
    }
})

router.get('/', async (req, res) => {
    try {
        const { status } = req.query
        
        let query = {}
        if (status) {
            query.status = status
        }

        const bookings = await Booking.find(query)
            .populate({
                path: 'listing',
                select: 'title location pricing images', 
                options: { virtuals: true } 
            })
            .populate('user', 'name phoneNumber email')
            .sort({ createdAt: -1 })

        res.json({ bookings })
    } catch (error) {
        console.error('Get bookings error:', error)
        res.status(500).json({ message: 'Failed to get bookings' })
    }
})

router.patch('/:id/status', async (req, res) => {
    try {
        const { status, cancellationReason } = req.body

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        const updateData = { status }
        
        if (status === 'cancelled') {
            updateData.cancelledAt = new Date()
            if (cancellationReason) {
                updateData.cancellationReason = cancellationReason
            }
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('listing', 'title').populate('user', 'name phoneNumber')

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        res.json({ 
            message: `Booking ${status} successfully`,
            booking 
        })
    } catch (error) {
        console.error('Update booking status error:', error)
        res.status(500).json({ message: 'Failed to update booking' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id)
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        res.json({ message: 'Booking deleted successfully' })
    } catch (error) {
        console.error('Delete booking error:', error)
        res.status(500).json({ message: 'Failed to delete booking' })
    }
})

module.exports = router