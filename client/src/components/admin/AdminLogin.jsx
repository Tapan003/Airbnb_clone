import '../../css/admin/AdminLogin.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    const HandleSubmit = (e) => {
        e.preventDefault()
        if (username === 'admin' && password === 'password') {
            
            localStorage.setItem('adminAuth', 'true')
            navigate('/admin-dashboard')
            alert('Login successful!')
        } else {
            alert('Invalid credentials. Please try again.')
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