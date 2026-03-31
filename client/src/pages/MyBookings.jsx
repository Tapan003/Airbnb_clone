import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import '../css/MyBookings.css'

function MyBookings() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, confirmed, cancelled

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        
        if (!user || !user.id) {
            alert('Please log in to view bookings')
            navigate('/')
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/bookings/user/${user.id}`)
            const data = await response.json()
            setBookings(data.bookings)
        } catch (error) {
            console.error('Failed to fetch bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-pending', text: ' Pending' },
            confirmed: { class: 'badge-confirmed', text: ' Confirmed' },
            cancelled: { class: 'badge-cancelled', text: ' Cancelled' },
            completed: { class: 'badge-completed', text: ' Completed' }
        }
        return badges[status] || badges.pending
    }

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true
        return booking.status === filter
    })

    if (loading) {
        return <div className="loading">Loading your bookings...</div>
    }

    return (
        <div className="my-bookings-page">
            <div className="bookings-header">
                <h1>My Bookings</h1>
                <button onClick={() => navigate('/')} className="btn-back">
                    Back to Home
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="booking-filters">
                <button 
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All ({bookings.length})
                </button>
                <button 
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({bookings.filter(b => b.status === 'pending').length})
                </button>
                <button 
                    className={filter === 'confirmed' ? 'active' : ''}
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                </button>
                <button 
                    className={filter === 'cancelled' ? 'active' : ''}
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
                </button>
            </div>

            {/* Bookings List */}
            <div className="bookings-grid">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => {
                        const badge = getStatusBadge(booking.status)
                        return (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-image">
                                    <img 
                                        src={booking.listing.mainImage} 
                                        alt={booking.listing.title}
                                    />
                                    <span className={`status-badge ${badge.class}`}>
                                        {badge.text}
                                    </span>
                                </div>
                                
                                <div className="booking-info">
                                    <h3>{booking.listing.title}</h3>
                                    <p className="location">
                                        📍 {booking.listing.location.city}, {booking.listing.location.country}
                                    </p>
                                    
                                    <div className="booking-dates">
                                        <div>
                                            <span className="label">Check-in:</span>
                                            <span className="date">{format(new Date(booking.checkIn), 'MMM d, yyyy')}</span>
                                        </div>
                                        <div>
                                            <span className="label">Check-out:</span>
                                            <span className="date">{format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                                        </div>
                                    </div>

                                    <div className="booking-details">
                                        <p>👥 {booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                                        <p>🌙 {booking.pricing.nights} night{booking.pricing.nights > 1 ? 's' : ''}</p>
                                    </div>

                                    <div className="booking-price">
                                        <span className="total-label">Total:</span>
                                        <span className="total-amount">₹{booking.pricing.totalPrice}</span>
                                    </div>

                                    <button 
                                        className="btn-view-details"
                                        onClick={() => navigate(`/listing/${booking.listing._id}`)}
                                    >
                                        View Listing
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="empty-state">
                        <p>No bookings found</p>
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Start Exploring
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyBookings