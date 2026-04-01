import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/admin/ManageListings.css'

function ManageListings() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('listings') 
    const [activeCarouselTab, setActiveCarouselTab] = useState('all')
    const [listings, setListings] = useState([])
    const [carousels, setCarousels] = useState([])
    const [loading, setLoading] = useState(true)
    const [showEditCarouselForm, setShowEditCarouselForm] = useState(false)
    const [editingCarousel, setEditingCarousel] = useState(null)
    const [showEditListingForm, setShowEditListingForm] = useState(false)
    const [editingListing, setEditingListing] = useState(null)
    const home = carousels.filter(carousel => carousel.page === 'home')
    const exp = carousels.filter(carousel => carousel.page === 'experiences')
    const services = carousels.filter(carousel => carousel.page === 'services')
    const API_URL = import.meta.env.VITE_API_URL
    
    // new slider form
    const [showNewCarouselForm, setShowNewCarouselForm] = useState(false)
    const [newCarousel, setNewCarousel] = useState({
        title: '',
        subtitle: '',
        cardType: 'card1',
        page: 'home',
        showLastCard: true,
        order: 1
    })

    const [selectedCarousel, setSelectedCarousel] = useState(null)

    useEffect(() => {   
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            // fetch listings
            const listingsRes = await fetch(`${API_URL}/api/listings`)
            const listingsData = await listingsRes.json()
            setListings(listingsData.listings)
            // fetch carousels
            const carouselsRes = await fetch(`${API_URL}/api/carousels`)
            const carouselsData = await carouselsRes.json()
            setCarousels(carouselsData.carousels)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCarousel = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_URL}/api/carousels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCarousel)
            })

            if (response.ok) {
                alert('Carousel created successfully!')
                setShowNewCarouselForm(false)
                setNewCarousel({
                    title: '',
                    subtitle: '',
                    cardType: 'card1',
                    page: 'home',
                    showLastCard: true,
                    order: 1
                })
                fetchData()
            } else {
                alert('Failed to create carousel')
            }
        } catch (error) {
            console.error('Create carousel error:', error)
            alert('Something went wrong')
        }
    }

    const handleUpdateCarousel = async (e) => {
    e.preventDefault()
    try {
        const response = await fetch(`${API_URL}/api/carousels/${editingCarousel.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: editingCarousel.title,
                subtitle: editingCarousel.subtitle,
                cardType: editingCarousel.cardType,
                page: editingCarousel.page,
                showLastCard: editingCarousel.showLastCard,
                order: editingCarousel.order
            })
        })
        if (response.ok) {
            alert('Carousel updated successfully!')
            setShowEditCarouselForm(false)
            setEditingCarousel(null)
            fetchData()
        } else {
            alert('Failed to update carousel')
        }
    } catch (error) {
        console.error('Update carousel error:', error)
        alert('Something went wrong')
    }
}
const handleEditClick = (carousel) => {
    setEditingCarousel({
        id: carousel.id,
        title: carousel.title,
        subtitle: carousel.subtitle || '',
        cardType: carousel.cardType,
        page: carousel.page,
        showLastCard: carousel.showLastCard,
        order: carousel.order
    })
    setShowEditCarouselForm(true)
}
    const handleAddListingToCarousel = async (listingId) => {
        if (!selectedCarousel) {
            alert('Please select a carousel first')
            return
        }

        try {
            const response = await fetch(
                `${API_URL}/api/carousels/${selectedCarousel}/listings/${listingId}`,
                { method: 'POST' }
            )
            if (response.ok) {
                alert('Listing added to carousel!')
                fetchData()
            } else {
                alert('Failed to add listing')
            }
        } catch (error) {
            console.error('Add listing error:', error)
        }
    }

    const handleEditListingClick = (listing) => {
        setEditingListing({
            id: listing._id,
            title: listing.title,
            description: listing.description,
            propertyType: listing.propertyType,
            city: listing.location.city,
            state: listing.location.state,
            country: listing.location.country,
            bedrooms: listing.details.bedrooms,
            bathrooms: listing.details.bathrooms,
            beds: listing.details.beds,
            guests: listing.details.guests,
            basePrice: listing.pricing.basePrice,
            cleaningFee: listing.pricing.cleaningFee || 0
        })
        setShowEditListingForm(true)
    }

    const handleUpdateListing = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${API_URL}/api/listings/${editingListing.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editingListing.title,
                    description: editingListing.description,
                    propertyType: editingListing.propertyType,
                    location: {
                        city: editingListing.city,
                        state: editingListing.state,
                        country: editingListing.country
                    },
                    details: {
                        bedrooms: Number(editingListing.bedrooms),
                        bathrooms: Number(editingListing.bathrooms),
                        beds: Number(editingListing.beds),
                        guests: Number(editingListing.guests)
                    },
                    pricing: {
                        basePrice: Number(editingListing.basePrice),
                        cleaningFee: Number(editingListing.cleaningFee)
                    }
                })
            })

            if (response.ok) {
                alert('Listing updated successfully!')
                setShowEditListingForm(false)
                setEditingListing(null)
                fetchData()
            } else {
                alert('Failed to update listing')
            }
        } catch (error) {
            console.error('Update listing error:', error)
            alert('Something went wrong')
        }
    }

    const handleRemoveListingFromCarousel = async (carouselId, listingId) => {
        try {
            const response = await fetch(
                `${API_URL}/api/carousels/${carouselId}/listings/${listingId}`,
                { method: 'DELETE' }
            )

            if (response.ok) {
                alert('Listing removed from carousel!')
                fetchData()
            } else {
                alert('Failed to remove listing')
            }
        } catch (error) {
            console.error('Remove listing error:', error)
        }
    }

    const handleDeleteListing = async (listingId) => {
        if (!confirm('Are you sure you want to delete this listing?')) return

        try {
            const response = await fetch(`${API_URL}/api/listings/${listingId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                alert('Listing deleted!')
                fetchData()
            } else {
                alert('Failed to delete listing')
            }
        } catch (error) {
            console.error('Delete listing error:', error)
        }
    }

    const handleDeleteCarousel = async (carouselId) => {
        if (!confirm('Are you sure you want to delete this carousel?')) return

        try {
            const response = await fetch(`${API_URL}/api/carousels/${carouselId}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                alert('Carousel deleted!')
                fetchData()
            } else {
                alert('Failed to delete carousel')
            }
        } catch (error) {
            console.error('Delete carousel error:', error)
        }
    }

    if (loading) {
        return <div className="admin-loading">Loading admin panel...</div>
    }

    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>
            <div className="admin-header">
                <button onClick={() => navigate('/admin-dashboard')} className='btn-home'>
                    Back to Dashboard
                </button>
                <button onClick={() => navigate('/')} className="btn-home">
                    Back to Home
                </button>
            </div>

            <div className="admin-tabs">
                <button 
                    className={`tab ${activeTab === 'listings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('listings')}
                >
                    Listings ({listings.length})
                </button>
                <button 
                    className={`tab ${activeTab === 'carousels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('carousels')}
                >
                    Slider ({carousels.length})
                </button>
            </div>

            {/* listings tab */}
            {activeTab === 'listings' && (
                <div className="admin-content">
                    <div className="content-header">
                        <h2>All Listings</h2>
                        <button onClick={() => navigate('/become-host')} className="btn-primary">
                            + New Listing
                        </button>
                    </div>

                    {selectedCarousel && (
                        <div className="selected-carousel-info">
                            <p>Adding to Slider: <strong>{carousels.find(c => c.id === selectedCarousel)?.title}</strong></p>
                            <button onClick={() => setSelectedCarousel(null)} className="btn-cancel">
                                Clear Selection
                            </button>
                        </div>
                    )}

                    <div className="listings-grid">
                        {listings.map(listing => (
                            <div key={listing._id} className="listing-card">
                                <img src={listing.mainImage} alt={listing.title} className="listing-image" />
                                <div className="listing-info">
                                    <h3>{listing.title}</h3>
                                    <p className="listing-location">
                                        {listing.location.city}, {listing.location.country}
                                    </p>
                                    <p className="listing-price">
                                        ₹{listing.pricing.basePrice}/night
                                    </p>
                                    <p className="listing-details">
                                        {listing.details.bedrooms} bed . {listing.details.bathrooms} bath . {listing.details.guests} guests
                                    </p>
                                </div>
                                <div className="listing-actions">
                                    {selectedCarousel ? (
                                        <button 
                                            onClick={() => handleAddListingToCarousel(listing._id)}
                                            className="btn-add"
                                        >
                                            Add to Slider
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setSelectedCarousel(carousels[0]?.id)}
                                            className="btn-secondary"
                                            disabled={carousels.length === 0}
                                        >
                                            Select Slider
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditListingClick(listing)}
                                        className='btn-secondary'
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteListing(listing._id)}
                                        className="btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {listings.length === 0 && (
                        <div className="empty-state">
                            <p>No listings yet. Create your first listing!</p>
                            <button onClick={() => navigate('/become-host')} className="btn-primary">
                                Create Listing
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* carousels tab */}
            {activeTab === 'carousels' && (
                <div className="admin-content">
                    <div className="content-header">
                        <h2>All Slider</h2>
                        <button 
                            onClick={() => setShowNewCarouselForm(true)} 
                            className="btn-primary"
                        >
                            + New Slider
                        </button>
                    </div>
                    <div className="admin-tabs">
                        <button 
                            className={`tab ${activeCarouselTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCarouselTab('all')}
                        >
                        All ({carousels.length})
                        </button>
                        <button 
                            className={`tab ${activeCarouselTab === 'home' ? 'active' : ''}`}
                            onClick={() => setActiveCarouselTab('home')}
                        >
                        Home ({home.length})
                        </button>
                        <button 
                            className={`tab ${activeCarouselTab === 'experiences' ? 'active' : ''}`}
                            onClick={() => setActiveCarouselTab('experiences')}
                        >
                        Experiences ({exp.length})
                        </button>
                        <button 
                            className={`tab ${activeCarouselTab === 'services' ? 'active' : ''}`}
                            onClick={() => setActiveCarouselTab('services')}
                        >
                        Services ({services.length})
                        </button>
                    </div>

                    {/* new carousel form */}
                    {showNewCarouselForm && (
                        <div className="modal-backdrop" onClick={() => setShowNewCarouselForm(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>Create New Slider</h2>
                                <form onSubmit={handleCreateCarousel}>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            value={newCarousel.title}
                                            onChange={(e) => setNewCarousel({...newCarousel, title: e.target.value})}
                                            required
                                            placeholder=" homes in Bangalore"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subtitle</label>
                                        <input
                                            type="text"
                                            value={newCarousel.subtitle}
                                            onChange={(e) => setNewCarousel({...newCarousel, subtitle: e.target.value})}
                                            placeholder="Optional description"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Type</label>
                                        <select
                                            value={newCarousel.cardType}
                                            onChange={(e) => setNewCarousel({...newCarousel, cardType: e.target.value})}
                                        >
                                            <option value="card1">Card Type 1 (Standard)</option>
                                            <option value="card2">Card Type 2 (With Badge)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Page</label>
                                        <select
                                            value={newCarousel.page}
                                            onChange={(e) => setNewCarousel({...newCarousel, page: e.target.value})}
                                        >
                                            <option value="home">Home</option>
                                            <option value="experiences">Experiences</option>
                                            <option value="services">Services</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Order (Lower appears first)</label>
                                        <input
                                            type="number"
                                            value={newCarousel.order}
                                            onChange={(e) => setNewCarousel({...newCarousel, order: Number(e.target.value)})}
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={newCarousel.showLastCard}
                                                onChange={(e) => setNewCarousel({...newCarousel, showLastCard: e.target.checked})}
                                            />
                                            Show "See All" card
                                        </label>
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" onClick={() => setShowNewCarouselForm(false)} className="btn-cancel">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Create Slider
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* edit carousel form */}
                    {showEditCarouselForm && editingCarousel && (
                        <div className="modal-backdrop" onClick={() => {
                            setShowEditCarouselForm(false)
                            setEditingCarousel(null)
                        }}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>Edit Slider</h2>
                                <form onSubmit={handleUpdateCarousel}>
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            value={editingCarousel.title}
                                            onChange={(e) => setEditingCarousel({
                                                ...editingCarousel, 
                                                title: e.target.value
                                            })}
                                            required
                                            placeholder="e.g., Popular homes in Bangalore"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subtitle</label>
                                        <input
                                            type="text"
                                            value={editingCarousel.subtitle}
                                            onChange={(e) => setEditingCarousel({
                                                ...editingCarousel, 
                                                subtitle: e.target.value
                                            })}
                                            placeholder="Optional description"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Type</label>
                                        <select
                                            value={editingCarousel.cardType}
                                            onChange={(e) => setEditingCarousel({
                                                ...editingCarousel, 
                                                cardType: e.target.value
                                            })}
                                        >
                                            <option value="card1">Card Type 1 (Standard)</option>
                                            <option value="card2">Card Type 2 (With Badge)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Page *</label>
                                        <select
                                            value={editingCarousel.page}
                                            onChange={(e) => setEditingCarousel({
                                                ...editingCarousel, 
                                                page: e.target.value
                                            })}
                                            required
                                        >
                                            <option value="home">Home</option>
                                            <option value="experiences">Experiences</option>
                                            <option value="services">Services</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Order (Lower appears first)</label>
                                        <input
                                            type="number"
                                            value={editingCarousel.order}
                                            onChange={(e) => setEditingCarousel({
                                                ...editingCarousel, 
                                                order: Number(e.target.value)
                                            })}
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={editingCarousel.showLastCard}
                                                onChange={(e) => setEditingCarousel({
                                                    ...editingCarousel, 
                                                    showLastCard: e.target.checked
                                                })}
                                            />
                                            Show "See All" card
                                        </label>
                                    </div>
                                    <div className="modal-actions">
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setShowEditCarouselForm(false)
                                                setEditingCarousel(null)
                                            }} 
                                            className="btn-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Update Slider
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* carousels list */}
                    <div className="carousels-list">
                        {/* Filter carousels based on active tab */}
                        {carousels
                            .filter(carousel => 
                                activeCarouselTab === 'all' || carousel.page === activeCarouselTab
                            )
                            .map(carousel => (
                                <div key={carousel.id} className="carousel-item">
                                    <div className="carousel-header">
                                        <div>
                                            <h3>{carousel.title}</h3>
                                            {carousel.subtitle && <p className="carousel-subtitle">{carousel.subtitle}</p>}
                                            <p className="carousel-meta">
                                                Page: <span className={`page-badge page-${carousel.page}`}>{carousel.page}</span>
                                                {' -- '}Order: {carousel.order ?? "NOT FOUND"}
                                                {' -- '}Type: {carousel.cardType}
                                                {' -- '}{carousel.cards?.length || 0} listings
                                            </p>
                                            
                                        </div>
                                        <div className="carousel-actions">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCarousel(carousel.id);
                                                    setActiveTab('listings')
                                                }}
                                                className="btn-secondary"
                                            >
                                                Select for Adding
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(carousel)}
                                                className="btn-secondary"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCarousel(carousel.id)}
                                                className="btn-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                            
                                    {carousel.cards && carousel.cards.length > 0 && (
                                        <div className="carousel-listings">
                                            <h4>Listings in this Slider:</h4>
                                            <div className="carousel-listings-grid">
                                                {carousel.cards.map(listing => (
                                                    <div key={listing.id} className="carousel-listing-item">
                                                        <img src={listing.imageUrl} alt={listing.title} />
                                                        <div className="carousel-listing-info">
                                                            <p className="carousel-listing-title">{listing.title}</p>
                                                            <button 
                                                                onClick={() => handleRemoveListingFromCarousel(carousel.id, listing.id)}
                                                                className="btn-remove"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                
                {/* Empty state */}
                {carousels.filter(c => activeCarouselTab === 'all' || c.page === activeCarouselTab).length === 0 && (
                <div className="empty-state">
                     <p>
                         {activeCarouselTab === 'all' 
                             ? 'No carousels yet. Create your first carousel!'
                             : `No carousels for ${activeCarouselTab} page yet.`
                       }
                     </p>
                     <button onClick={() => setShowNewCarouselForm(true)} className="btn-primary">
                            Create Slider
                     </button>
                </div>
                )}
            </div>
            )}

            {/* edit listing */}
            {showEditListingForm && editingListing && (
                <div className="modal-backdrop" onClick={() => {
                    setShowEditListingForm(false)
                    setEditingListing(null)
                }}>
                    <div className="modal-content edit-listing-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Listing</h2>
                        <form onSubmit={handleUpdateListing}>
                            <div className="form-sections">
                                {/* basic info */}
                                <div className="form-section">
                                    <h3>Basic Information</h3>
                                    
                                    <div className="form-group">
                                        <label>Title *</label>
                                        <input
                                            type="text"
                                            value={editingListing.title}
                                            onChange={(e) => setEditingListing({
                                                ...editingListing, 
                                                title: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                        
                                    <div className="form-group">
                                        <label>Description *</label>
                                        <textarea
                                            value={editingListing.description}
                                            onChange={(e) => setEditingListing({
                                                ...editingListing, 
                                                description: e.target.value
                                            })}
                                            rows="4"
                                            required
                                        />
                                    </div>
                                        
                                    <div className="form-group">
                                        <label>Property Type</label>
                                        <select
                                            value={editingListing.propertyType}
                                            onChange={(e) => setEditingListing({
                                                ...editingListing, 
                                                propertyType: e.target.value
                                            })}
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
                                        
                                {/* location */}
                                <div className="form-section">
                                    <h3>Location</h3>
                                        
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                value={editingListing.city}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    city: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                            
                                        <div className="form-group">
                                            <label>State *</label>
                                            <input
                                                type="text"
                                                value={editingListing.state}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    state: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Country *</label>
                                        <input
                                            type="text"
                                            value={editingListing.country}
                                            onChange={(e) => setEditingListing({
                                                ...editingListing, 
                                                country: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                </div>
                                        
                                {/* property details */}
                                <div className="form-section">
                                    <h3>Property Details</h3>
                                        
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Bedrooms *</label>
                                            <input
                                                type="number"
                                                value={editingListing.bedrooms}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    bedrooms: e.target.value
                                                })}
                                                min="1"
                                                required
                                            />
                                        </div>
                                            
                                        <div className="form-group">
                                            <label>Bathrooms *</label>
                                            <input
                                                type="number"
                                                value={editingListing.bathrooms}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    bathrooms: e.target.value
                                                })}
                                                min="1"
                                                step="0.5"
                                                required
                                            />
                                        </div>
                                    </div>
                                            
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Beds *</label>
                                            <input
                                                type="number"
                                                value={editingListing.beds}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    beds: e.target.value
                                                })}
                                                min="1"
                                                required
                                            />
                                        </div>
                                            
                                        <div className="form-group">
                                            <label>Max Guests *</label>
                                            <input
                                                type="number"
                                                value={editingListing.guests}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    guests: e.target.value
                                                })}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                            
                                {/* pricing */}
                                <div className="form-section">
                                    <h3>Pricing</h3>
                                            
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Base Price (per night) *</label>
                                            <input
                                                type="number"
                                                value={editingListing.basePrice}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    basePrice: e.target.value
                                                })}
                                                min="0"
                                                required
                                            />
                                        </div>
                                            
                                        <div className="form-group">
                                            <label>Cleaning Fee</label>
                                            <input
                                                type="number"
                                                value={editingListing.cleaningFee}
                                                onChange={(e) => setEditingListing({
                                                    ...editingListing, 
                                                    cleaningFee: e.target.value
                                                })}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                                            
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowEditListingForm(false)
                                        setEditingListing(null)
                                    }} 
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Update Listing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageListings