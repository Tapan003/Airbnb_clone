import {useNavigate} from 'react-router-dom'
import '../../css/admin/AdminDash.css'

function AdminDashBoard() {
    const navigate = useNavigate()

    const handleLogout = () => {        
        localStorage.removeItem('adminAuth')
        navigate('/admin-login')
    }

    const handleUsers = () => {
        navigate('/manage-users')
    }

    const handleListings = () => {
        navigate('/manage-listings')
    }

    const handleBookings = () => {
        navigate('/manage-bookings')
    }
    return (
        <div>
            <div>
            <h1>Admin Dashboard</h1>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="admin-dashboard-content">
                <div className="admin-dashboard-section">
                    <p>Welcome to the admin dashboard! Here you can manage your application.</p>
                    <div className="admin-actions">
                        {/* placeholder for future user management page */}
                        <button className="admin-action-button" onClick={handleUsers}>Manage Users</button> 
                        {/* working listing management page */}
                        <button className="admin-action-button" onClick={handleListings}>Manage Listings</button>

                        <button className="admin-action-button" onClick={handleBookings}>Manage Bookings</button>
                        {/* placeholder for future analytics page */}
                        <button className="admin-action-button">View Analytics</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashBoard