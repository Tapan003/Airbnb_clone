import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/MenuDropdown.css'
import images from '../assets/images'

function MenuDropdown({ onLoginClick, user, onLogout }) {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const toggleMenu = () => setIsOpen(!isOpen)

    return (
        <>
        {/*  */}
        <div className="menu-dropdown-container">
            <button className="menu-button" onClick={toggleMenu}>
                <img src={images.menuIcon} alt="Menu" className="hamburger-icon"/>
            </button>

            {isOpen && (
                <>
                <div className="modal-backdrop-menu" onClick={toggleMenu}></div>
                <div className="dropdown-menu">
                    {user ? (
                        <>
                            <div className="dropdown-item user-info">
                                <div className='username'>{user.name || user.phoneNumber}</div>
                                <div className='useremail'>{user.email && <small>{user.email}</small>}</div>
                            </div>
                            <hr className="dropdown-divider" />
                            <button 
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/my-bookings')
                                    setIsOpen(false)
                                }}
                            >
                                My Bookings
                            </button>
                            <button 
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/my-listings')
                                    setIsOpen(false)
                                }}
                            >
                                My Listings
                            </button>
                            <button 
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/account')
                                    setIsOpen(false)
                                }}
                            >
                                Account
                            </button>
                            <hr className="dropdown-divider" />
                            <button 
                                className="dropdown-item"
                                onClick={() => {
                                    onLogout()
                                    setIsOpen(false)
                                }}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="dropdown-item bold"
                                onClick={() => {
                                    onLoginClick()
                                    setIsOpen(false)
                                }}
                            >
                                Log in
                            </button>
                            <button 
                                className="dropdown-item"
                                onClick={() => {
                                    onLoginClick()
                                    setIsOpen(false)
                                }}
                            >
                                Sign up
                            </button>
                            <hr className="dropdown-divider" />
                            <button className="dropdown-item">Gift cards</button>
                            <button className="dropdown-item">Airbnb your home</button>
                            <button className="dropdown-item">Help Center</button>
                        </>
                    )}
                </div>
                </>
            )}
        </div>
        </>
    )
}

export default MenuDropdown