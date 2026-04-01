import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/admin/ManageUsers.css'

function ManageUsers() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [showEditUserForm, setShowEditUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch users from the correct endpoint
            const usersRes = await fetch(`${API_URL}/api/users`)
            const usersData = await usersRes.json()
            //console.log(usersData)
            setUsers(usersData.users)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUserDelete = async (userId, phoneNumber) => {
        if (!confirm(`Are you sure you want to delete user ${phoneNumber}?`)) return

        try {
            const response = await fetch(`${API_URL}/api/users/${userId}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (response.ok) {
                alert('User deleted successfully!')
                fetchData()
            } else {
                alert(data.message || 'Failed to delete user')
            }
        } catch (error) {
            console.error('Delete user error:', error)
            alert('Something went wrong')
        }
    }

    const handleUserEditClick = (user) => {
        setEditingUser({
            id: user._id,
            phoneNumber: user.phoneNumber,
            name: user.name || '',
            email: user.email || '',
            country: user.country || 'India'
        })
        setShowEditUserForm(true)
    }

    const handleUpdateUser = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${API_URL}/api/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: editingUser.phoneNumber,
                    name: editingUser.name,
                    email: editingUser.email,
                    country: editingUser.country
                })
            })

            if (response.ok) {
                alert('User updated successfully!')
                setShowEditUserForm(false)
                setEditingUser(null)
                fetchData()
            } else {
                alert('Failed to update user')
            }
        } catch (error) {
            console.error('Update user error:', error)
            alert('Something went wrong')
        }
    }

    const filteredUsers = users.filter(user => 
        user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return <div className="admin-loading">Loading users...</div>
    }

    return (
        <div className="manage-users-page">
            <div className="admin-header">
                <h1>Manage Users</h1>
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
                        <p>Unverified</p>
                    </div>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by phone, name, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input-u"
                    />
                </div>
            </div>
            <div className="users-container">
                <div className="user-grid">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div key={user._id} className={`user-card ${!user.isVerified ? 'unverified' : ''}`}>
                                <div className="user-header">
                                    <div className="user-avatar">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.phoneNumber.charAt(0)}
                                    </div>
                                    <div className="user-status">
                                        {user.isVerified ? (
                                            <span className="badge verified">✓ Verified</span>
                                        ) : (
                                            <span className="badge unverified">⚠ Not Verified</span>
                                        )}
                                    </div>
                                </div>

                                <div className="user-info">
                                    <h3>{user.name || 'No Name'}</h3>
                                    <p className="user-phone">📱 {user.phoneNumber}</p>
                                    {user.email && <p className="user-email">📧 {user.email}</p>}
                                    <p className="user-country">🌍 {user.country || 'N/A'}</p>
                                    <p className="user-date">
                                        Joined: {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="user-actions">
                                    <button 
                                        onClick={() => handleUserEditClick(user)}
                                        className="btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleUserDelete(user._id, user.phoneNumber)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>No users found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
            {showEditUserForm && editingUser && (
                <div className="modal-backdrop" onClick={() => {
                    setShowEditUserForm(false)
                    setEditingUser(null)
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit User</h2>
                        <form onSubmit={handleUpdateUser}>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    value={editingUser.phoneNumber}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        phoneNumber: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        name: e.target.value
                                    })}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        email: e.target.value
                                    })}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    value={editingUser.country}
                                    onChange={(e) => setEditingUser({
                                        ...editingUser,
                                        country: e.target.value
                                    })}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditUserForm(false)
                                        setEditingUser(null)
                                    }}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageUsers