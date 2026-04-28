const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

async function generateBookingInvoice(bookingData) {
    return new Promise((resolve, reject) => {
        try {
            const pdfDir = path.join(__dirname, '../temp-pdfs')
            if (!fs.existsSync(pdfDir)) {
                fs.mkdirSync(pdfDir, { recursive: true })
            }

            const fileName = `invoice_${bookingData.bookingId}.pdf`
            const filePath = path.join(pdfDir, fileName)

            const doc = new PDFDocument({ margin: 50 })
            const writeStream = fs.createWriteStream(filePath)

            doc.pipe(writeStream)
            doc.fontSize(28)
                .fillColor('#E61E4D')
                .text('Ashbob', { align: 'left' })
                .moveDown(0.5)

            doc.fontSize(20)
                .fillColor('#222')
                .text('Booking Confirmation', { align: 'left' })
                .moveDown(1)

            doc.fontSize(10)
                .fillColor('#717171')
                .text(`Booking ID: ${bookingData.bookingId}`)
                .text(`Date: ${new Date().toLocaleDateString('en-IN')}`)
                .moveDown(1)

            doc.fontSize(14)
                .fillColor('#222')
                .text('Guest Information', { underline: true })
                .moveDown(0.5)

            doc.fontSize(10)
                .fillColor('#222')
                .text(`Name: ${bookingData.userName}`)
                .text(`Email: ${bookingData.email}`)
                .moveDown(1)

            doc.fontSize(14)
                .fillColor('#222')
                .text('Property Details', { underline: true })
                .moveDown(0.5)

            doc.fontSize(10)
                .text(`Property: ${bookingData.listingTitle}`)
                .text(`Location: ${bookingData.listingLocation}`)
                .moveDown(1)

            doc.fontSize(14)
                .fillColor('#222')
                .text('Reservation Details', { underline: true })
                .moveDown(0.5)

            doc.fontSize(10)
                .text(`Check-in: ${bookingData.checkInDate}`)
                .text(`Check-out: ${bookingData.checkOutDate}`)
                .text(`Guests: ${bookingData.guests}`)
                .text(`Nights: ${bookingData.nights}`)
                .moveDown(1)

            doc.fontSize(14)
                .fillColor('#222')
                .text('Price Breakdown', { underline: true })
                .moveDown(0.5)

            const tableTop = doc.y
            const descCol = 50
            const amountCol = 450

            doc.fontSize(10)
                .fillColor('#222')

            doc.font('Helvetica-Bold')
                .text('Description', descCol, tableTop)
                .text('Amount', amountCol, tableTop)

            doc.moveTo(50, tableTop + 15)
                .lineTo(550, tableTop + 15)
                .stroke()

            doc.font('Helvetica')
            let yPos = tableTop + 25

            const items = [
                { desc: `₹${bookingData.basePrice} x ${bookingData.nights} nights`, amount: bookingData.basePrice * bookingData.nights },
                { desc: 'Cleaning fee', amount: bookingData.cleaningFee },
                { desc: 'Service fee', amount: bookingData.serviceFee },
                { desc: 'Tax', amount: bookingData.tax}  
            ]

            items.forEach(item => {
                doc.text(item.desc, descCol, yPos)
                    .text(`${item.amount}`, amountCol, yPos)
                yPos += 20
            })

            doc.moveTo(50, yPos)
                .lineTo(550, yPos)
                .stroke()

            yPos += 10

            doc.font('Helvetica-Bold')
                .fontSize(12)
                .text('Total', descCol, yPos)
                .text(`${bookingData.totalPrice}`, amountCol, yPos)

            doc.moveDown(2)

            doc.fontSize(8)
                .fillColor('#717171')
                .font('Helvetica')
                .text('Thank you for booking with Ashbob!', { align: 'center' })

            doc.end()

            writeStream.on('finish', () => {
                console.log(' PDF generated:', filePath)
                resolve(filePath)
            })

            writeStream.on('error', (error) => {
                console.error(' PDF generation error:', error)
                reject(error)
            })

        } catch (error) {
            console.error('PDF generation error:', error)
            reject(error)
        }
    })
}

module.exports = { generateBookingInvoice }