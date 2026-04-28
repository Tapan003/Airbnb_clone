import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/admin/Analytics.css'
import RevenueChart from '../../components/admin/RevenueChart.jsx'
import BookingsChart from '../../components/admin/BookingsChart.jsx'
import BookingStatusPie from '../../components/admin/BookingStatus.jsx'
import PropPerformance from '../../components/admin/PropPerformance.jsx'

function Analytics() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [listings, setListings] = useState([])
    const [bookings, setBookings] = useState([])
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
            fetchData()
        }, [])

    const fetchData = async () => {
        setLoading(true)
        try{
        const usersRes = await fetch(`${API_URL}/api/users`)
        const usersData = await usersRes.json()
        setUsers(usersData.users)

        const listingsRes = await fetch(`${API_URL}/api/listings`)
        const listingsData = await listingsRes.json()
        setListings(listingsData.listings)

        const bookingsRes = await fetch(`${API_URL}/api/bookings`)
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData.bookings)
        // console.log(usersData, listingsData, bookingsData)
        } catch(error) {
            console.error('Error fetching analytics data:', error)
        } finally {
            setLoading(false)
        }
    }

    const totalRevenue = bookings.reduce((total, booking) => {
      if (booking?.status === "confirmed") {
        return total + (booking?.pricing?.totalPrice || 0);
      }
      return total;
    }, 0);

    const formattedRevenue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, 
    }).format(totalRevenue);


    if (loading) {
        return <div className="admin-loading">Loading analytics data...</div>
    }

    return (
        <div className="analytics-page">
            <div className="admin-header">
                <h1>Analytics</h1>
                <button onClick={() => navigate('/admin-dashboard')} className="btn-home">
                    Back to Dashboard
                </button>
            </div>

            {/* stats */}
            <div className="users-header">
                <div className="users-stats">
                    <div className="stat-card">
                        <h3>{users.length}</h3>
                        <p>Total Users</p>
                    </div>
                    <div className="stat-card">
                        <h3>{users.filter(u => u.isVerified).length}</h3>
                        <p>Verified Users</p>
                    </div>
                    <div className="stat-card">
                        <h3>{users.filter(u => !u.isVerified).length}</h3>
                        <p>Unverified Users</p>
                    </div>
                    <div className="stat-card">
                        <h3>{listings.length}</h3>
                        <p>Total Listings</p>
                    </div>
                    <div className="stat-card">
                        <h3>{bookings.length}</h3>
                        <p>Total Bookings</p>
                    </div>
                    <div className="stat-card">
                        <h3>{formattedRevenue}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card full-width">
                    <h3>Revenue Over Time</h3>
                    <RevenueChart bookings={bookings} />
                </div>

                <div className="chart-card full-width">
                    <h3>Bookings Over Time</h3>
                    <BookingsChart bookings={bookings} />
                </div>

                <div className="chart-card half-width">
                    <h3>Booking Status Distribution</h3>
                    <BookingStatusPie bookings={bookings} />
                </div>

                <div className="chart-card half-width">
                    <h3>Top Performing Properties</h3>
                    <PropPerformance bookings={bookings} />
                </div>
            </div>
        </div>
    )
}

export default Analytics