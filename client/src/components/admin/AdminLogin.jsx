import '../../css/admin/AdminLogin.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL

    const HandleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const response = await fetch(`${API_URL}/api/auth/admin-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('adminAuth', 'true')                
                alert('Login successful!')
                navigate('/admin-dashboard')
            } else {
                alert(data.message || 'Invalid credentials. Please try again.')
            }
        } catch (error) {
            console.error('Admin login error:', error)
            alert('Something went wrong. Please check your connection.')
        }
    }

    return (
        <div className="admin-login-container">
            <h1>Admin Login</h1>
            <div className="admin-login-form-container">
                <form className="admin-login-form" onSubmit={HandleSubmit}> 
                    <input className='username' type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <input className='password' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button className="admin-login-button" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin