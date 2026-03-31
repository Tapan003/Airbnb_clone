const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads')
    },
    filename : function(req, file, cb){
        const iso = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${iso}_${file.originalname}`)
    }
})

const upload = multer({
    storage,  
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true) 
        } else {
            cb(new Error('Not an image!'), false) 
        }
    }
})

router.post('/image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file' })
    }
    console.log(req.body)
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`
    res.json({ imageUrl })
})
module.exports = router