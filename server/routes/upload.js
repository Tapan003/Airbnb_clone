const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const path = require('path')
const fs = require('fs')

router.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ message: 'Failed to upload image' })
    }
})

router.post('/images', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' })
        }

        const images = req.files.map(file => ({
            url: `http://localhost:5000/uploads/${file.filename}`,
            filename: file.filename
        }))

        res.json({
            message: 'Images uploaded successfully',
            images
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ message: 'Failed to upload images' })
    }
})

router.delete('/image/:filename', (req, res) => {
    try {
        const filepath = path.join(__dirname, '../uploads', req.params.filename)
        
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
            res.json({ message: 'Image deleted successfully' })
        } else {
            res.status(404).json({ message: 'Image not found' })
        }
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ message: 'Failed to delete image' })
    }
})

module.exports = router