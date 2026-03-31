const express = require('express')
const router = express.Router()
const User = require('../models/Users')

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .select('-otp -otpCreatedAt') 
            .sort({ createdAt: -1 })
        
        res.json({ users })
    } catch (error) {
        console.error('Get users error:', error)
        res.status(500).json({ message: 'Failed to get users' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-otp -otpCreatedAt')
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        res.json({ user })
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ message: 'Failed to get user' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { phoneNumber, name, email, country } = req.body
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { phoneNumber, name, email, country },
            { new: true, runValidators: true }
        ).select('-otp -otpCreatedAt')
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        res.json({ 
            message: 'User updated successfully',
            user 
        })
    } catch (error) {
        console.error('Update user error:', error)
        res.status(500).json({ message: 'Failed to update user' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id

        const Listing = require('../models/Listings')
        const userListings = await Listing.find({ owner: userId })
        
        if (userListings.length > 0) {
            return res.status(400).json({ 
                message: `Cannot delete user. They have ${userListings.length} listing(s). Please delete their listings first.` 
            })
        }
        
        const user = await User.findByIdAndDelete(userId)
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Delete user error:', error)
        res.status(500).json({ message: 'Failed to delete user' })
    }
})

module.exports = router