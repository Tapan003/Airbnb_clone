const express = require('express')
const router = express.Router()
const User = require('../models/Users')

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

router.get('/', async (req,res) => {
    try{
        const users = await User.find()
        res.json(users)
    }catch(error){
        console.error('Get users error:', error)
        res.status(500).json({ message: 'Failed to get users' })
    }
})

router.post('/send-otp', async (req, res) => {
    try {
        const { phoneNumber, country } = req.body

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' })
        }

        const otp = generateOTP()
        let user = await User.findOne({ phoneNumber })
        
        if (user) {
            user.otp = otp
            user.otpCreatedAt = new Date()
            user.country = country || user.country
            await user.save()
        } else{
            user = await User.create({
                phoneNumber,
                country: country || 'India',
                otp,
                otpCreatedAt: new Date()
            })
        }

        console.log(` OTP for ${phoneNumber}: ${otp}`)

        res.status(200).json({ 
            message: 'OTP sent successfully',
            otp: otp  
        })

    } catch (error) {
        console.error('Send OTP error:', error)
        res.status(500).json({ message: 'Failed to send OTP' })
    }
})

router.post('/verify-otp', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' })
        }

        const user = await User.findOne({ phoneNumber })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // otp expiry check
        if (!user.isOtpValid()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
        }

        // otp check
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' })
        }

        user.isVerified = true
        user.otp = null
        user.otpCreatedAt = null
        await user.save()

        res.status(200).json({ 
            message: 'OTP verified successfully',
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                country: user.country,
                isVerified: user.isVerified,
                isProfileComplete: user.isProfileComplete,  // ADD THIS
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error('Verify OTP error:', error)
        res.status(500).json({ message: 'Failed to verify OTP' })
    }
})

//complete profile
router.post('/complete-profile', async (req, res) => {
    try {
        const { userId, name, email } = req.body

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' })
        }

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' })
        }

        // check email uniqueness
        const existingUser = await User.findOne({ email, _id: { $ne: userId } })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                name,
                email,
                isProfileComplete: true
            },
            { new: true }
        ).select('-otp -otpCreatedAt')

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            message: 'Profile completed successfully',
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                country: user.country,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                isProfileComplete: user.isProfileComplete
            }
        })

    } catch (error) {
        console.error('Complete profile error:', error)
        res.status(500).json({ message: 'Failed to complete profile' })
    }
})

router.get('/me', async (req, res) => {
    try {
        const { phoneNumber } = req.query

        if (!phoneNumber) {
            return res.status(401).json({ message: 'Not authenticated' })
        }

        const user = await User.findOne({ phoneNumber, isVerified: true })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                country: user.country,
                isVerified: user.isVerified
            }
        })

    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ message: 'Failed to get user' })
    }
})

module.exports = router