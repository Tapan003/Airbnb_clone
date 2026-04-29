const emailjs = require('@emailjs/nodejs')
// const nodemailer = require('nodemailer')
const { generateBookingInvoice } = require('./pdfService')
const fs = require('fs').promises
const { Resend } = require('resend')

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY

const resend = new Resend(process.env.RESEND_API_KEY)

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASSWORD 
//     }
// })

// const TEMPLATES = {
//     OTP: process.env.EMAILJS_TEMPLATE_OTP,
//     BOOKING_CONFIRMATION: process.env.EMAILJS_TEMPLATE_BOOKING
// }

async function sendOTPEmail({ email, otp, expiryTime }) {
    try {
        const templateParams = {
            email: email,  
            passcode: otp,
            time: expiryTime
        
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

// async function sendBookingConfirmationEmail({ 
//     email, 
//     userName,
//     listingTitle,
//     listingLocation,
//     checkInDate,
//     checkOutDate,
//     guests,
//     nights,
//     totalPrice,
//     bookingId,
//     bookingUrl
// }) {
    
//     try {
//         const templateParams = {
//             email: email,
//             user_name: userName,
//             listing_title: listingTitle,
//             listing_location: listingLocation,
//             check_in_date: checkInDate,
//             check_out_date: checkOutDate,
//             guests: guests,
//             nights: nights,
//             total_price: totalPrice,
//             booking_id: bookingId,
//             booking_url: bookingUrl || `${process.env.FRONTEND_URL}/my-bookings`
//         }

//         const response = await emailjs.send(
//             EMAILJS_SERVICE_ID,
//             TEMPLATES.BOOKING_CONFIRMATION,
//             templateParams,
//             {
//                 publicKey: EMAILJS_PUBLIC_KEY,
//                 privateKey: EMAILJS_PRIVATE_KEY
//             }
//         )

//         console.log('Booking confirmation email sent:', response)
//         return { success: true, messageId: response.messageId }
//     } catch (error) {
//         console.error('Failed to send booking email:', error)
//         return { success: false, error: error.message }
//     }
// }

// async function sendBookingConfirmationEmail(bookingData) {
//     try {
//         const pdfPath = await generateBookingInvoice(bookingData)

//         const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <style>
//                 body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                 .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #E61E4D; }
//                 .logo { font-size: 32px; font-weight: bold; color: #E61E4D; }
//                 .success-badge { background: #00A699; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 20px 0; }
//                 .details { background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0; }
//                 .detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
//                 .detail-label {color: #717171;}
//                 .detail-value {display: block !important;text-align:right;font-weight: 600;}
//                 .total { font-size: 24px; font-weight: bold; color: #E61E4D; text-align: center; margin: 20px 0; }
//                 .footer { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #717171; font-size: 12px; }
//                 table{border-collapse: collapse;width: 100% !important;}
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <div class="logo">Ashbob</div>
//                     <div class="success-badge">✓ Booking Confirmed</div>
//                 </div>
                
//                 <h2>Hi ${bookingData.userName}! </h2>
//                 <p>Great news! Your payment was successful and your booking is confirmed.</p>
                
//                 <div class="details">
//                     <h3>${bookingData.listingTitle}</h3>
//                     <p style="color: #717171;">${bookingData.listingLocation}</p>
                    
//                     <table >
//                       <tr class="detail-row">
//                         <td class="detail-label">Check-in</td>
//                         <td class="detail-value" >${bookingData.checkInDate}</td>
//                       </tr>
//                       <tr class="detail-row">
//                         <td class="detail-label">Check-out</td>
//                         <td class="detail-value" >${bookingData.checkOutDate}</td>
//                       </tr>
//                       <tr class="detail-row">
//                         <td class="detail-label">Guests</td>
//                         <td class="detail-value" >${bookingData.guests} guest(s)</td>
//                       </tr>
//                       <tr class="detail-row">
//                         <td class="detail-label">Nights</td>
//                         <td class="detail-value" >${bookingData.nights} night(s)</td>
//                       </tr>
//                     </table>
//                 </div>
                
//                 <div class="total">
//                     Total Paid: ₹${bookingData.totalPrice}
//                 </div>
                
//                 <p><strong>What's next?</strong></p>
//                 <ul>
//                     <li>Your invoice is attached to this email</li>
//                     <li>View your booking details anytime in "My Bookings"</li>
//                     <li>Contact your host for check-in instructions</li>
//                 </ul>
                
//                 <p>If you have any questions, feel free to contact our support team.</p>
                
//                 <p>Safe travels!<br>The Ashbob Team</p>
                
//                 <div class="footer">
//                     <p>Booking ID: ${bookingData.bookingId}</p>
//                     <p>&copy; 2024 Ashbob. All rights reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//         `
//         const mailOptions = {
//             from: `Ashbob <${process.env.EMAIL_USER}>`,
//             to: bookingData.email,
//             subject: `Booking Confirmed! ${bookingData.listingTitle}`,
//             html: htmlContent,
//             attachments: [
//                 {
//                     filename: `Invoice_${bookingData.bookingId}.pdf`,
//                     path: pdfPath
//                 }
//             ]
//         }

//         const info = await transporter.sendMail(mailOptions)
//         console.log(' Booking confirmation email sent to:', bookingData.email)

async function sendBookingConfirmationEmail(bookingData) {
    try {
        // Generate PDF invoice
        const pdfPath = await generateBookingInvoice(bookingData)

        // Read PDF file as base64
        const pdfBuffer = await fs.readFile(pdfPath)
        const pdfBase64 = pdfBuffer.toString('base64')

        // HTML email template
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 20px 0; border-bottom: 3px solid #E61E4D; }
                .logo { font-size: 32px; font-weight: bold; color: #E61E4D; }
                .success-badge { background: #00A699; color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 20px 0; }
                .details { background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
                .detail-label {color: #717171;}
                .detail-value {display: block !important;text-align:right;font-weight: 600;}
                .total { font-size: 24px; font-weight: bold; color: #E61E4D; text-align: center; margin: 20px 0; }
                .footer { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #717171; font-size: 12px; }
                table{border-collapse: collapse;width: 100% !important;}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">Ashbob</div>
                    <div class="success-badge">✓ Booking Confirmed</div>
                </div>
                
                <h2>Hi ${bookingData.userName}! </h2>
                <p>Great news! Your payment was successful and your booking is confirmed.</p>
                
                <div class="details">
                    <h3>${bookingData.listingTitle}</h3>
                    <p style="color: #717171;">${bookingData.listingLocation}</p>
                    
                    <table >
                      <tr class="detail-row">
                        <td class="detail-label">Check-in</td>
                        <td class="detail-value" >${bookingData.checkInDate}</td>
                      </tr>
                      <tr class="detail-row">
                        <td class="detail-label">Check-out</td>
                        <td class="detail-value" >${bookingData.checkOutDate}</td>
                      </tr>
                      <tr class="detail-row">
                        <td class="detail-label">Guests</td>
                        <td class="detail-value" >${bookingData.guests} guest(s)</td>
                      </tr>
                      <tr class="detail-row">
                        <td class="detail-label">Nights</td>
                        <td class="detail-value" >${bookingData.nights} night(s)</td>
                      </tr>
                    </table>
                </div>
                
                <div class="total">
                    Total Paid: ₹${bookingData.totalPrice}
                </div>
                
                <p><strong>What's next?</strong></p>
                <ul>
                    <li>Your invoice is attached to this email</li>
                    <li>View your booking details anytime in "My Bookings"</li>
                    <li>Contact your host for check-in instructions</li>
                </ul>
                
                <p>If you have any questions, feel free to contact our support team.</p>
                
                <p>Safe travels!<br>The Ashbob Team</p>
                
                <div class="footer">
                    <p>Booking ID: ${bookingData.bookingId}</p>
                    <p>&copy; 2024 Ashbob. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `

        // Send email with Resend
        const { data, error } = await resend.emails.send({
            from: 'Ashbob <onboarding@resend.dev>', // Use Resend's test domain
            to: [bookingData.email],
            subject: `Booking Confirmed! ${bookingData.listingTitle}`,
            html: htmlContent,
            attachments: [
                {
                    filename: `Invoice_${bookingData.bookingId}.pdf`,
                    content: pdfBase64,
                    contentType: 'application/pdf'
                }
            ]
        })

        if (error) {
            console.error('Resend error:', error)
            return { success: false, error: error.message }
        }

        console.log('Booking confirmation email sent to:', bookingData.email)
        console.log('Resend message ID:', data.id)

        try {
            await fs.unlink(pdfPath)
            console.log('Temporary PDF cleaned up')
        } catch (cleanupError) {
            console.warn('Failed to cleanup PDF:', cleanupError)
        }

        return { success: true, messageId: data.id }

    } catch (error) {
        console.error('✗ Failed to send booking email:', error)
        return { success: false, error: error.message }
    }
}

module.exports = {
    sendOTPEmail,
    sendBookingConfirmationEmail
}