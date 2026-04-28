import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isBefore, startOfDay } from 'date-fns'
import '../css/MyBookings.css'

function MyBookings() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') 

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
            setBookings(data.bookings || data) 
        } catch (error) {
            console.error('Failed to fetch bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    // NEW: Handle Cancellation
    const handleCancel = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking request?");
        if (!confirmCancel) return;

        try {
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (response.ok) {
                alert("Booking cancelled.");
                // Update the UI instantly without refreshing the page
                setBookings(prevBookings => 
                    prevBookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
                );
            } else {
                alert(data.message || "Failed to cancel booking.");
            }
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Something went wrong.");
        }
    }

    // Helper to determine the actual display status
    const getComputedStatus = (booking) => {
        const today = startOfDay(new Date());
        const checkoutDate = startOfDay(new Date(booking.checkOut));
        
        // If the date has passed AND the host confirmed it, it's a completed trip!
        if (booking.status === 'confirmed' && isBefore(checkoutDate, today)) {
            return 'completed';
        }
        return booking.status;
    }

    const getStatusBadge = (computedStatus) => {
        const badges = {
            pending: { class: 'badge-pending', text: 'Pending' },
            confirmed: { class: 'badge-confirmed', text: 'Confirmed' },
            cancelled: { class: 'badge-cancelled', text: 'Cancelled' },
            completed: { class: 'badge-completed', text: 'Completed' }
        }
        return badges[computedStatus] || badges.pending
    }

    // Enhanced filtering logic
    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        const computedStatus = getComputedStatus(booking);
        return computedStatus === filter;
    })

    if (loading) {
        return <div className="loading">Loading your bookings...</div>
    }

    // Calculate filter counts dynamically
    const counts = {
        all: bookings.length,
        pending: bookings.filter(b => getComputedStatus(b) === 'pending').length,
        confirmed: bookings.filter(b => getComputedStatus(b) === 'confirmed').length,
        completed: bookings.filter(b => getComputedStatus(b) === 'completed').length,
        cancelled: bookings.filter(b => getComputedStatus(b) === 'cancelled').length,
    }

    return (
        <div className="my-bookings-page">
            <div className="bookings-header">
                <h1>My Bookings</h1>
                <button onClick={() => navigate('/')} className="btn-back">
                    Back to Home
                </button>
            </div>

            <div className="booking-filters">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                    All ({counts.all})
                </button>
                <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
                    Pending ({counts.pending})
                </button>
                <button className={filter === 'confirmed' ? 'active' : ''} onClick={() => setFilter('confirmed')}>
                    Confirmed ({counts.confirmed})
                </button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>
                    Completed ({counts.completed})
                </button>
                <button className={filter === 'cancelled' ? 'active' : ''} onClick={() => setFilter('cancelled')}>
                    Cancelled ({counts.cancelled})
                </button>
            </div>

            <div className="bookings-grid">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => {
                        const computedStatus = getComputedStatus(booking);
                        const badge = getStatusBadge(computedStatus);
                        const isListingAvailable = !!booking.listing;

                        return (
                            <div key={booking._id} className="booking-card-my">
                                <div className="booking-image">
                                    <img 
                                        src={booking.listing?.mainImage || 'https://via.placeholder.com/300?text=Listing+Unavailable'} 
                                        alt={booking.listing?.title || 'Unavailable'}
                                    />
                                    <span className={`status-badge ${badge.class}`}>
                                        {badge.text}
                                    </span>
                                </div>
                                
                                <div className="booking-info">
                                    <h3>{booking.listing?.title || 'This listing is no longer available'}</h3>
                                    
                                    {isListingAvailable && (
                                        <p className="location">
                                             {booking.listing.location?.city}, {booking.listing.location?.country}
                                        </p>
                                    )}
                                    
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
                                        <p>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
                                        <p>{booking.pricing.nights} night{booking.pricing.nights !== 1 ? 's' : ''}</p>
                                    </div>

                                    <div className="booking-price">
                                        <span className="total-label">Total:</span>
                                        <span className="total-amount">₹{booking.pricing.totalPrice}</span>
                                    </div>

                                    <div className="booking-actions" style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                        {/* Action 1: View Listing (Always visible if listing exists) */}
                                        <button 
                                            className="btn-view-details"
                                            onClick={() => navigate(`/listing/${booking.listing?._id}`)}
                                            disabled={!isListingAvailable}
                                            style={{ flex: 1, opacity: !isListingAvailable ? 0.5 : 1 }}
                                        >
                                            View Listing
                                        </button>
                                        
                                        {/* Action 2: Dynamic Action Button based on status */}
                                        {computedStatus === 'pending' && (
                                            <button 
                                                onClick={() => handleCancel(booking._id)}
                                                className="btn-cancel-booking" 
                                                style={{ flex: 1, backgroundColor: '#f1f1f1', color: '#222', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                Cancel Request
                                            </button>
                                        )}

                                        {computedStatus === 'completed' && isListingAvailable && (
                                            <button 
                                                onClick={() => navigate(`/listing/${booking.listing._id}#reviews`)}
                                                className="btn-cancel-booking" 
                                                style={{  backgroundColor: '#222', color: 'white' }}
                                            >
                                                Leave a Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="empty-state">
                        <p>{filter === 'all' ? 'No bookings found' : `No ${filter} bookings found`}</p>
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