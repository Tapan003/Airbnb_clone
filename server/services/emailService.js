const emailjs = require('@emailjs/nodejs')

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY

const TEMPLATES = {
    OTP: process.env.EMAILJS_TEMPLATE_OTP,
    BOOKING_CONFIRMATION: process.env.EMAILJS_TEMPLATE_BOOKING
}

async function sendOTPEmail({ email, otp, expiryTime }) {
    try {
        const templateParams = {
            to_email: email,  
            otp: otp,
            expiry_time: expiryTime
        
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            TEMPLATES.OTP,
            templateParams,
            {
                publicKey: EMAILJS_PUBLIC_KEY,
                privateKey: EMAILJS_PRIVATE_KEY
            }
        )

        console.log('OTP email sent successfully:', response)
        return { success: true, messageId: response.messageId }
    } catch (error) {
        console.error('Failed to send OTP email:', error)
        return { success: false, error: error.message }
    }
}

async function sendBookingConfirmationEmail({ 
    email, 
    userName,
    listingTitle,
    listingLocation,
    checkInDate,
    checkOutDate,
    guests,
    nights,
    totalPrice,
    bookingId,
    bookingUrl
}) {
    
    try {
        const templateParams = {
            email: email,
            user_name: userName,
            listing_title: listingTitle,
            listing_location: listingLocation,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            guests: guests,
            nights: nights,
            total_price: totalPrice,
            booking_id: bookingId,
            booking_url: bookingUrl || `${process.env.FRONTEND_URL}/my-bookings`
        }

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            TEMPLATES.BOOKING_CONFIRMATION,
            templateParams,
            {
                publicKey: EMAILJS_PUBLIC_KEY,
                privateKey: EMAILJS_PRIVATE_KEY
            }
        )

        console.log('Booking confirmation email sent:', response)
        return { success: true, messageId: response.messageId }
    } catch (error) {
        console.error('Failed to send booking email:', error)
        return { success: false, error: error.message }
    }
}

module.exports = {
    sendOTPEmail,
    sendBookingConfirmationEmail
}