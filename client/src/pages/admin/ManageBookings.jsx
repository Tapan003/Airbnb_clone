import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import '../../css/admin/ManageBookings.css'

function ManageBookings() {
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        fetchBookings()
    }, [])

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${API_URL}/api/bookings`)
            const data = await response.json()
            setBookings(data.bookings)
        } catch (error) {
            console.error('Failed to fetch bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (bookingId, newStatus) => {
        const confirmMessage = newStatus === 'confirmed' 
            ? 'Are you sure you want to confirm this booking?'
            : 'Are you sure you want to cancel this booking?'

        if (!confirm(confirmMessage)) return

        try {
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: newStatus,
                    cancellationReason: newStatus === 'cancelled' ? 'Cancelled by admin' : null
                })
            })

            if (response.ok) {
                alert(`Booking ${newStatus} successfully!`)
                fetchBookings()
            } else {
                alert('Failed to update booking')
            }
        } catch (error) {
            console.error('Update error:', error)
            alert('Something went wrong')
        }
    }

    const handleDeleteBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to delete this booking? This cannot be undone.')) return

        try {
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                alert('Booking deleted successfully!')
                fetchBookings()
            } else {
                alert('Failed to delete booking')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Something went wrong')
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'status-pending', text: ' Pending', color: '#FFB400' },
            confirmed: { class: 'status-confirmed', text: 'Confirmed', color: '#00A699' },
            cancelled: { class: 'status-cancelled', text: 'Cancelled', color: '#c13515' },
            completed: { class: 'status-completed', text: 'Completed', color: '#767676' }
        }
        return badges[status] || badges.pending
    }

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true
        return booking.status === filter
    })

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length
    }

    if (loading) {
        return <div className="admin-loading">Loading bookings...</div>
    }

    return (
        <div className="manage-bookings-page">
            <div className="admin-header">
                <h1>Manage Bookings</h1>
                <button onClick={() => navigate('/admin-dashboard')} className="btn-back">
                    Back to Dashboard
                </button>
            </div>

            {/* Stats Cards
            <div className="stats-container">
                <div className="stat-card">
                    <h3>{stats.total}</h3>
                    <p>Total Bookings</p>
                </div>
                <div className="stat-card pending">
                    <h3>{stats.pending}</h3>
                    <p>Pending</p>
                </div>
                <div className="stat-card confirmed">
                    <h3>{stats.confirmed}</h3>
                    <p>Confirmed</p>
                </div>
                <div className="stat-card cancelled">
                    <h3>{stats.cancelled}</h3>
                    <p>Cancelled</p>
                </div>
            </div> */}

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button 
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All ({stats.total})
                </button>
                <button 
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                     Pending ({stats.pending})
                </button>
                <button 
                    className={filter === 'confirmed' ? 'active' : ''}
                    onClick={() => setFilter('confirmed')}
                >
                     Confirmed ({stats.confirmed})
                </button>
                <button 
                    className={filter === 'cancelled' ? 'active' : ''}
                    onClick={() => setFilter('cancelled')}
                >
                     Cancelled ({stats.cancelled})
                </button>
            </div>

            {/* Bookings List */}
            <div className="bookings-list">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => {
                        const badge = getStatusBadge(booking.status)
                        return (
                            <div key={booking._id} className="booking-row">
                                {console.log(booking)}
                                <div className="booking-left">
                                    <img 
                                        src={booking.listing.mainImage} 
                                        alt={booking.listing.title}
                                        className="booking-thumbnail"
                                    />
                                    
                                    <div className="booking-details">
                                        <h3>{booking.listing.title}</h3>
                                        <p className="location">
                                             {booking.listing.location.city}, {booking.listing.location.country}
                                        </p>
                                        
                                        <div className="guest-info">
                                            <div>
                                            <span className="user-name">
                                                 {booking.user.name || booking.user.phoneNumber}
                                            </span>
                                            </div>
                                            <div>
                                            <span className="phone">{booking.user.phoneNumber}</span>
                                            </div>
                                        </div>

                                        <div className="date-info">
                                            <div>
                                                <span className="label">Check-in:</span>
                                                <span className="value">{format(new Date(booking.checkIn), 'MMM d, yyyy')}</span>
                                            </div>
                                            <span className="separator">→</span>
                                            <div>
                                                <span className="label">Check-out:</span>
                                                <span className="value">{format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                                            </div>
                                        </div>

                                        <div className="booking-meta">
                                            <span> {booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                                            <span> {booking.pricing.nights} night{booking.pricing.nights > 1 ? 's' : ''}</span>
                                            <span> ₹{booking.pricing.totalPrice} total</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-right">
                                    <span className={`status-badge ${badge.class}`}>
                                        {badge.text}
                                    </span>

                                    <div className="booking-actions">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    className="btn-confirm"
                                                >
                                                    Confirm
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                    className="btn-cancel-booking"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        {booking.status === 'confirmed' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                className="btn-cancel-booking"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => handleDeleteBooking(booking._id)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <p className="booking-time">
                                        Booked: {format(new Date(booking.createdAt), 'MMM d, h:mm a')}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="empty-state">
                        <p>No bookings found for this filter</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageBookings