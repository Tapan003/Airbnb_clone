import { useState, useRef } from 'react'
import '../css/ImageUpload.css'

function ImageUpload({ onImageUploaded, isMain = false, existingImage = null }) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(existingImage)
    const [error, setError] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const API_URL = import.meta.env.VITE_API_URL

    const validateFile = (file) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return false
        }
        // if (file.size > 5 * 1024 * 1024) {
        //     setError('Image must be less than 5MB')
        //     return false
        // }
        return true
    }

    const handleFileSelect = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (!validateFile(file)) return
        setError('')
        await processFile(file)
    }

    const processFile = async (file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result)
        }
        reader.readAsDataURL(file)
        await uploadImage(file)
    }

    const uploadImage = async (file) => {
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await fetch(`${API_URL}/api/upload/image`, {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                onImageUploaded(data.imageUrl)
            } else {
                setError(data.message || 'Upload failed')
                setPreview(null)
            }
        } catch (error) {
            console.error('Upload error:', error)
            setError('Failed to upload image. Please try again.')
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setPreview(null)
        setError('')
        onImageUploaded('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            const file = files[0]
            if (validateFile(file)) {
                setError('')
                await processFile(file)
            }
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="image-upload">
            {!preview ? (
                <div
                    className={`upload-area ${isDragging ? 'dragging' : ''}`}
                    onClick={handleClick}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    {/* <div className="upload-content">
                        {uploading ? (
                            <>
                                <div className="spinner"></div>
                                <p>Uploading...</p>
                            </>
                        ) : (
                            <>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <p>{isMain ? 'Upload Main Image' : 'Upload Image'}</p>
                                <span className="upload-hint">
                                    {isDragging ? 'Drop image here' : 'Drag & drop or click to browse'}
                                </span>
                                <span className="upload-specs">JPG, PNG or WEBP (max 5MB)</span>
                            </>
                        )}
                    </div> */}
                </div>
            ) : (
                <div className="image-preview">
                    <img src={preview} alt="Preview" />
                    <button type="button" onClick={handleRemove} className="remove-btn" title="Remove image">
                        ✕
                    </button>
                    {isMain && <span className="main-badge">Main Image</span>}
                </div>
            )}
            {error && <p className="upload-error">{error}</p>}
        </div>
    )
}

export default ImageUpload