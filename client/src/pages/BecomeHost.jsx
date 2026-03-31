import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/BecomeHost.css'
import ImageUpload from '../components/ImageUpload'

function BecomeHost() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [file,setFile] = useState(null)
    // const [isAuthenticated, setIsAuthenticated] = useState(false)
    // const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    // const [user, setUser] = useState(null)
    // useEffect(() => {
    //     checkAuthentication()
    // }, [])
    // const checkAuthentication = () => {
    //     setIsCheckingAuth(true)
    //     const savedUser = localStorage.getItem('user')
    //     if (savedUser) {
    //         try {
    //             const userData = JSON.parse(savedUser)
                
    //             // checeking if user has required data
    //             if (userData.id && userData.phoneNumber) {
    //                 setUser(userData)
    //                 setIsAuthenticated(true)
    //             } else {
    //                 // Invalid user data
    //                 localStorage.removeItem('user')
    //                 setIsAuthenticated(false)
    //             }
    //         } catch (error) {
    //             console.error('Error parsing user data:', error)
    //             localStorage.removeItem('user')
    //             setIsAuthenticated(false)
    //         }
    //     } else {
    //         setIsAuthenticated(false)
    //     }
    //     setIsCheckingAuth(false)
    // }

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'house',
        city: '',
        state: '',
        country: 'India',
        address: '',
        mainImageUrl: '',
        additionalImages: ['', '', ''],
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
        guests: 2,
        amenities: [],
        basePrice: '',
        currency: 'INR',
        cleaningFee: '',
        hostName: '',
        hostBio: '',
        hostProfileImage: ''
    })

    const [errors, setErrors] = useState({})
    const availableAmenities = [
        'WiFi', 'Kitchen', 'Free parking', 'Pool', 'Hot tub', 'AC',
        'Heating', 'Workspace', 'TV', 'Washer', 'Dryer', 'Iron',
        'Hair dryer', 'Gym', 'Garden', 'BBQ grill', 'Fire pit', 'Piano'
    ]

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        if (type === 'checkbox') {
            // amenities checkboxes
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    amenities: [...prev.amenities, value]
                }))
            } else {
                setFormData(prev => ({
                    ...prev,
                    amenities: prev.amenities.filter(a => a !== value)
                }))
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleImageChange = (index, value) => {
        const newImages = [...formData.additionalImages]
        newImages[index] = value
        setFormData(prev => ({
            ...prev,
            additionalImages: newImages
        }))
    }

    const validateStep = () => {
        const newErrors = {}

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = 'Title is required'
            if (!formData.description.trim()) newErrors.description = 'Description is required'
            if (!formData.propertyType) newErrors.propertyType = 'Property type is required'
        }

        if (step === 2) {
            if (!formData.city.trim()) newErrors.city = 'City is required'
            if (!formData.state.trim()) newErrors.state = 'State is required'
            if (!formData.country.trim()) newErrors.country = 'Country is required'
        }

        if (step === 3) {
            if (!formData.mainImageUrl.trim()) newErrors.mainImageUrl = 'Main image is required'
        }

        if (step === 4) {
            if (formData.bedrooms < 1) newErrors.bedrooms = 'At least 1 bedroom required'
            if (formData.bathrooms < 1) newErrors.bathrooms = 'At least 1 bathroom required'
            if (formData.guests < 1) newErrors.guests = 'At least 1 guest required'
        }

        if (step === 5) {
            if (!formData.basePrice || formData.basePrice <= 0) {
                newErrors.basePrice = 'Valid price is required'
            }
        }

        if (step === 6) {
            if (!formData.hostName.trim()) newErrors.hostName = 'Host name is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1)
            window.scrollTo(0, 0)
        }
    }

    const handleBack = () => {
        setStep(prev => prev - 1)
        window.scrollTo(0, 0)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateStep()) return

        setIsSubmitting(true)

        try {
            // Get logged-in user
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            
            // if (!user.id) {
            //     alert('Please log in first')
            //     navigate('/')
            //     return
            // }

            // prepare listing data
            const listingData = {
                title: formData.title,
                description: formData.description,
                propertyType: formData.propertyType,
                location: {
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    address: formData.address
                },
                images: [
                    { url: formData.mainImageUrl, isMain: true },
                    ...formData.additionalImages
                        .filter(url => url.trim())
                        .map(url => ({ url, isMain: false }))
                ],
                details: {
                    bedrooms: Number(formData.bedrooms),
                    bathrooms: Number(formData.bathrooms),
                    beds: Number(formData.beds),
                    guests: Number(formData.guests),
                    amenities: formData.amenities
                },
                pricing: {
                    basePrice: Number(formData.basePrice),
                    currency: formData.currency,
                    cleaningFee: Number(formData.cleaningFee) || 0
                },
                host: {
                    name: formData.hostName,
                    bio: formData.hostBio,
                    profileImage: formData.hostProfileImage,
                    joinedDate: new Date(),
                    isSuperhost: false
                },
                owner: user.id,
                isActive: true
            }

            // sending backend
            const response = await fetch('http://localhost:5000/api/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(listingData)
            })

            const data = await response.json()

            if (response.ok) {
                alert('Listing created successfully! An admin will review it soon.')
                navigate('/ManageListings')
            } else {
                alert(data.message || 'Failed to create listing')
            }
        } catch (error) {
            console.error('Submit error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="become-host-page">
            <div className="become-host-container">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(step / 6) * 100}%` }}></div>
                </div>

                <h1 className="become-host-title">Become a Host</h1>
                <p className="step-indicator">Step {step} of 6</p>

                <form onSubmit={handleSubmit} className="host-form">
                    {/* basic info */}
                    {step === 1 && (
                        <div className="form-step">
                            <h2>Tell us about your place</h2>
                            <div className="form-group">
                                <label htmlFor="title">Property Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="a small desc like: Cozy apartment in the mangalore"
                                    maxLength="100"
                                />
                                {errors.title && <span className="error">{errors.title}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your property, its features, and what makes it special..."
                                    rows="6"
                                />
                                {errors.description && <span className="error">{errors.description}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="propertyType">Property Type *</label>
                                <select
                                    id="propertyType"
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                >
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="room">Room</option>
                                    <option value="cottage">Cottage</option>
                                    <option value="cabin">Cabin</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* location */}
                    {step === 2 && (
                        <div className="form-step">
                            <h2>Where is your place located?</h2>

                            <div className="form-group">
                                <label htmlFor="address">Street Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Bangalore"
                                    />
                                    {errors.city && <span className="error">{errors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Karnataka"
                                    />
                                    {errors.state && <span className="error">{errors.state}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="country">Country *</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="India"
                                />
                                {errors.country && <span className="error">{errors.country}</span>}
                            </div>
                        </div>
                    )}
                    
                    {/* photos */}
                    {step === 3 && (
                        <div className="form-step">
                            <h2>Add photos of your place</h2>
                            {/* Main Image Section */}
                            <div className="form-group">
                                <label htmlFor="mainImage">Main Image *</label>
                                <p className="field-note">This will be the cover photo of your listing</p>
                                {/* File Upload Option */}
                                <div className="upload-option">
                                    <label className="upload-label">
                                        <span> Upload Image</span>
                                        <input 
                                            type="file" 
                                            id="mainImage"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={async (e) => {
                                                const file = e.target.files[0]
                                                if (!file) return
                                                const formData_upload = new FormData()
                                                formData_upload.append('image', file)
                                                try {
                                                    const response = await fetch('http://localhost:5000/api/upload/image', {
                                                        method: 'POST',
                                                        body: formData_upload
                                                    })
                                                    const data = await response.json()
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        mainImageUrl: data.imageUrl
                                                    }))
                                                } catch (error) {
                                                    console.error('Upload error:', error)
                                                    alert('Failed to upload image')
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                        
                                <div className="or-divider">
                                    <span>OR</span>
                                </div>
                                        
                                {/* url option */}
                                <div className="url-option">
                                    <input
                                        type="url"
                                        id="mainImageUrl"
                                        name="mainImageUrl"
                                        value={formData.mainImageUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="url-input"
                                    />
                                </div>
                                        
                                {/* Preview */}
                                {formData.mainImageUrl && (
                                    <div className="image-preview-container">
                                        <img 
                                            src={formData.mainImageUrl} 
                                            alt="Main preview" 
                                            className="image-preview-main"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image'
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => setFormData(prev => ({ ...prev, mainImageUrl: '' }))}
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                )}

                                {errors.mainImageUrl && <span className="error">{errors.mainImageUrl}</span>}
                            </div>
                            
                            {/* additional images */}
                            <div className="form-group">
                                <label>Additional Images (Optional)</label>
                                <p className="field-note">Add up to 3 more images to showcase your space</p>
                            
                                <div className="additional-images-container">
                                    {[0, 1, 2].map((index) => (
                                        <div key={index} className="additional-image-item">
                                            <label className="image-number">Image {index + 2}</label>
                                    
                                            {!formData.additionalImages[index] ? (
                                                <>
                                                    {/* File Upload */}
                                                    <label className="upload-btn-small">
                                                        <span> Upload</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={async (e) => {
                                                                const file = e.target.files[0]
                                                                if (!file) return
                                                            
                                                                const formData_upload = new FormData()
                                                                formData_upload.append('image', file)
                                                            
                                                                try {
                                                                    const response = await fetch('http://localhost:5000/api/upload/image', {
                                                                        method: 'POST',
                                                                        body: formData_upload
                                                                    })
                                                                    const data = await response.json()

                                                                    setFormData(prev => {
                                                                        const newImages = [...prev.additionalImages]
                                                                        newImages[index] = data.imageUrl
                                                                        return { ...prev, additionalImages: newImages }
                                                                    })
                                                                } catch (error) {
                                                                    console.error('Upload error:', error)
                                                                    alert('Failed to upload image')
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                        
                                                    <div className="or-text">or</div>
                                                        
                                                    {/* url option */}
                                                    <input
                                                        type="url"
                                                        placeholder="Image URL"
                                                        value={formData.additionalImages[index] || ''}
                                                        onChange={(e) => {
                                                            const newImages = [...formData.additionalImages]
                                                            newImages[index] = e.target.value
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                additionalImages: newImages
                                                            }))
                                                        }}
                                                        className="url-input-small"
                                                    />
                                                </>
                                            ) : (
                                                /* Preview with Remove Button */
                                                <div className="image-preview-small-container">
                                                    <img
                                                        src={formData.additionalImages[index]}
                                                        alt={`Additional ${index + 1}`}
                                                        className="image-preview-small"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/150?text=Invalid'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="remove-small-btn"
                                                        onClick={() => {
                                                            const newImages = [...formData.additionalImages]
                                                            newImages[index] = ''
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                additionalImages: newImages
                                                            }))
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* with url */}
                     {/* {step === 3 && (
                        <div className="form-step">
                            <h2>Add photos of your place</h2>
                            <p className="help-text">Add image URLs </p>
                            <div className="form-group">
                                <label htmlFor="mainImage">Main Image </label>
                                <input 
                                    type="file" 
                                    id="mainImage"
                                    accept="image/*" 
                                    onChange={async (e) => {
                                        const file = e.target.files[0]
                                        if (!file) return
                                        const formData_upload = new FormData()  
                                        formData_upload.append('image', file)
                                        try {
                                            const response = await fetch('http://localhost:5000/api/simple-upload/image', {
                                                method: 'POST',
                                                body: formData_upload
                                            })
                                            const data = await response.json()
                                            setFormData(prev => ({
                                                ...prev,
                                                mainImageUrl: data.imageUrl
                                            }))
                                        } catch (error) {
                                            console.error('Upload error:', error)
                                        }
                                    }}
                                />
                                or enter url to the image
                                <input
                                    type='url'
                                    id='mainImageUrl'
                                    name='mainImageUrl'
                                    value={formData.mainImageUrl}
                                    onChange={handleChange}
                                />
                                add gallery images that describe your place
                                <div className='additional-images'>
                                    {[0,1,2].map((index) => 
                                        <input
                                            type="url"
                                            placeholder="Image URL"
                                            value={formData.additionalImages[index] || ''}
                                            onChange={(e) => {
                                                const newImages = [...formData.additionalImages]
                                                newImages[index] = e.target.value
                                                setFormData(prev => ({
                                                    ...prev,
                                                    additionalImages: newImages
                                                }))
                                            }}
                                            className="url-input-small"
                                        />
                                    )}
                                </div>
                                {formData.mainImageUrl && (
                                    <img src={formData.mainImageUrl} alt="Preview" style={{width: '200px', height: '150px', marginTop: '10px'}} />
                                )}
                                {errors.mainImageUrl && <span className="error">{errors.mainImageUrl}</span>}
                            </div>
                        </div>
                        )
                    }  */}
                            
                    {/* {step === 3 && (
                        <div className="form-step">
                            <h2>Add photos of your place</h2>
                            <p className="help-text">High-quality photos help your listing stand out.</p>         
                            <div className="form-group">
                                <label>Main Image *</label>
                                <p className="field-description">This will be the first image guests see</p>
                                <ImageUpload
                                    isMain={true}
                                    existingImage={formData.mainImageUrl}
                                    onImageUploaded={(url) => setFormData(prev => ({
                                        ...prev,
                                        mainImageUrl: url
                                    }))}
                                />
                                {errors.mainImageUrl && <span className="error">{errors.mainImageUrl}</span>}
                            </div>   
                            <div className="form-group">
                                <label>Additional Images (Optional)</label>
                                <p className="field-description">Add up to 4 more images to showcase your space</p>
                                <div className="additional-images-grid">
                                    {[0, 1, 2, 3].map(index => (
                                        <ImageUpload
                                            key={index}
                                            existingImage={formData.additionalImages[index]}
                                            onImageUploaded={(url) => {
                                                const newImages = [...formData.additionalImages]
                                                newImages[index] = url
                                                setFormData(prev => ({
                                                    ...prev,
                                                    additionalImages: newImages
                                                }))
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )} */}

                    {/* prop details */}
                    {step === 4 && (
                        <div className="form-step">
                            <h2>Property details</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="bedrooms">Bedrooms *</label>
                                    <input
                                        type="number"
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bathrooms">Bathrooms *</label>
                                    <input
                                        type="number"
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleChange}
                                        min="1"
                                        step="0.5"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="beds">Beds *</label>
                                    <input
                                        type="number"
                                        id="beds"
                                        name="beds"
                                        value={formData.beds}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="guests">Max Guests *</label>
                                    <input
                                        type="number"
                                        id="guests"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Amenities</label>
                                <div className="amenities-grid">
                                    {availableAmenities.map(amenity => (
                                        <label key={amenity} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                value={amenity}
                                                checked={formData.amenities.includes(amenity)}
                                                onChange={handleChange}
                                            />
                                            <span>{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* pricing */}
                    {step === 5 && (
                        <div className="form-step">
                            <h2>Set your price</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="basePrice">Base Price (per night) *</label>
                                    <div className="price-input">
                                        {/* <span className="currency-symbol">₹</span> */}
                                        <input
                                            type="number"
                                            id="basePrice"
                                            name="basePrice"
                                            value={formData.basePrice}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="2500"
                                        />
                                    </div>
                                    {errors.basePrice && <span className="error">{errors.basePrice}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cleaningFee">Cleaning Fee (Optional)</label>
                                    <div className="price-input">
                                        {/* <span className="currency-symbol">₹</span> */}
                                        <input
                                            type="number"
                                            id="cleaningFee"
                                            name="cleaningFee"
                                            value={formData.cleaningFee}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* host info */}
                    {step === 6 && (
                        <div className="form-step">
                            <h2>About you as a host</h2>

                            <div className="form-group">
                                <label htmlFor="hostName">Your Name *</label>
                                <input
                                    type="text"
                                    id="hostName"
                                    name="hostName"
                                    value={formData.hostName}
                                    onChange={handleChange}
                                    placeholder="Kim Jong Un"
                                />
                                {errors.hostName && <span className="error">{errors.hostName}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="hostBio">About You (Optional)</label>
                                <textarea
                                    id="hostBio"
                                    name="hostBio"
                                    value={formData.hostBio}
                                    onChange={handleChange}
                                    placeholder="Tell guests about yourself and why you're a great host..."
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hostProfileImage">Profile Image URL (Optional)</label>
                                <input
                                    type="url"
                                    id="hostProfileImage"
                                    name="hostProfileImage"
                                    value={formData.hostProfileImage}
                                    onChange={handleChange}
                                    placeholder="https://example.com/profile.jpg"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-navigation">
                        {step > 1 && (
                            <button type="button" onClick={handleBack} className="btn-back">
                                Back
                            </button>
                        )}
                        
                        {step < 6 ? (
                            <button type="button" onClick={handleNext} className="btn-next">
                                Next
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Listing'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BecomeHost