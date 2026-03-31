import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, requireAdmin = false }) {
    if (requireAdmin) {
        const isAdminLoggedIn = localStorage.getItem('adminAuth')
        
        if (!isAdminLoggedIn || isAdminLoggedIn !== 'true') {
            alert('Please log in as admin to access this page')
            return <Navigate to="/admin-login" replace />
        }
        
        return children
    }
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (!user || !user.id) {
        alert('Please log in to access this page')
        return <Navigate to="/" replace />
    }
    
    return children
}

export default ProtectedRoute