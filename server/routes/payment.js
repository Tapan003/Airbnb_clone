const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.VITE_STRIPE_SECRET_KEY)
const Booking = require('../models/Bookings')
const Listing = require('../models/Listings')

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { bookingId } = req.body

        // Get booking details
        const booking = await Booking.findById(bookingId)
            .populate('listing', 'title mainImage images')
            .populate('user', 'email phoneNumber')

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        // Get listing image
        const listingImage = booking.listing.images?.find(img => img.isMain)?.url || 
                           booking.listing.images?.[0]?.url || 
                           'https://via.placeholder.com/300'

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr', // Indian Rupees
                        product_data: {
                            name: booking.listing.title,
                            description: `${booking.pricing.nights} night${booking.pricing.nights > 1 ? 's' : ''} • ${booking.guests} guest${booking.guests > 1 ? 's' : ''}`,
                            images: [listingImage],
                        },
                        unit_amount: Math.round(booking.pricing.totalPrice * 100), // Stripe uses smallest currency unit (paise)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled?booking_id=${bookingId}`,
            customer_email: booking.user.email || undefined,
            metadata: {
                bookingId: bookingId.toString(),
                userId: booking.user._id.toString(),
                listingId: booking.listing._id.toString()
            }
        })

        res.json({ 
            sessionId: session.id,
            url: session.url
        })

    } catch (error) {
        console.error('Stripe session creation error:', error)
        res.status(500).json({ message: 'Failed to create payment session' })
    }
})

// Verify payment and update booking
router.post('/verify-payment', async (req, res) => {
    try {
        const { sessionId, bookingId } = req.body

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status === 'paid') {
            // Update booking status and payment status
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    paymentStatus: 'paid',
                    status: 'confirmed'
                },
                { new: true }
            ).populate('listing', 'title').populate('user', 'name email')

            res.json({
                success: true,
                message: 'Payment successful! Your booking is confirmed.',
                booking
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment not completed'
            })
        }

    } catch (error) {
        console.error('Payment verification error:', error)
        res.status(500).json({ message: 'Failed to verify payment' })
    }
})

module.exports = router