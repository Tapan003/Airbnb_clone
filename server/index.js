const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const authRoutes = require('./routes/auth')
const carouselRoutes = require('./routes/carousel')
const listingRoutes = require('./routes/listings')
const userRoutes = require('./routes/users')
const uploadRoutes = require('./routes/upload')
const simpleUploadRoutes = require('./routes/simpleUpload')
const bookings = require('./routes/bookings')
const paymentRoutes = require('./routes/payment')
const multer =require('multer')


const User = require('./models/Users')

const app = express()

app.use(cors({
//   origin: ["https://airbnb-clone-frontend-djbo.onrender.com", "http://localhost:3000"]
}))

app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/carousels', carouselRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/simple-upload', simpleUploadRoutes)
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookings)
app.use('/api/payment', paymentRoutes)


// app.use('/api/upload', uploadRoutes)

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//     return cb(null, "./public/Images")
//     },
//     filename: function (req, file, cb) {
//     return cb(null, `${Date.now()}_${file.originalname}`)
//     }
// })

// const upload = multer({storage})

// app.post('/upload',upload.single('file'), (req,res)=>{
//     console.log(req.body)

// })

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err))


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})