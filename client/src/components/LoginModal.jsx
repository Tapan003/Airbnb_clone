import '../css/LoginModal.css'
import { useState } from 'react'
import images from '../assets/images'

import OtpVerfModal from './OtpVerfModal'

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null

    const [phoneNumber, setPhoneNumber] = useState('')
    const [country, setCountry] = useState('India')
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)

    // if (!isOtpModalOpen) {
    //     document.body.style = 'hidden'
    // } else {
    //     document.body.style = 'auto'
    // }

    const handleContinue = async (e) => {
    e.preventDefault()
    
    if (!phoneNumber || phoneNumber.length < 10) {
        alert('Please enter a valid phone number')
        return
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber,
                country
            })
        })

        const data = await response.json()

        if (response.ok) {
            console.log('OTP sent:', data.otp) 
            setIsOtpModalOpen(true)
        } else {
            alert(data.message || 'Failed to send OTP')
        }
    } catch (error) {
        console.error('Error sending OTP:', error)
        alert('Something went wrong. Please try again.')
    }
}

    const handleOtpClose = () => {
        setIsOtpModalOpen(false)
    }

    const handleBackToLogin = () => {
        setIsOtpModalOpen(false)
    }

        
    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            
            <div className="modal-container">
                <div className="topnav">
                    Log in or Sign up
                    <button className="close" onClick={onClose}>x</button>
                </div>
                
                <h1 className="title">Welcome to Airbnb</h1>
                <form onSubmit={handleContinue}>
                    <div className="initialinfo">
                        <div className="selectCountry">
                            <div>
                              <h3 className="phcountry">Country/Region</h3>
                            </div>
                            <div>
                           
                                <select name="country" placeholder="Country/Region" id="country" onChange={(e) => setCountry(e.target.value)}>
                                    <option value="India">India (+91)</option>
                                    <option value="Pakistan">Pakistan (+92)</option>
                                    <option value="Germany">Germany (+49)</option>
                                    <option value="China">China (+86)</option>
                                    <option value="Japan">Japan (+81)</option>
                                </select>
                            
                            </div>
                        </div>
                        <div className="selectphoneNumber">
                            <div>
                             <input type="tel" maxLength={10} minLength={10} id="phone" name="phone" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required/>
                            </div>
                        </div>
                    </div>
                
                    <p>We'll call or text you to confirm your number. Standard message and data rates may apply. <a href="#">Privacy Policy</a></p>
                
                    <div className="continueButton">
                        <button className="conbtn" type="submit" >Continue</button>
                    </div>
                </form>

                <div className="seperator">
                    <h6><span>or</span></h6>
                </div>
                
                <div className="altLogins">
                    <div className="googleLogin">   
                        <button className="gbtn" type="submit">
                            <img src={images.googleLogo} alt="Google" className="btnimg" />
                            <span>Continue with Google</span>
                        </button>
                    </div>
                    <div className="appleLogin">    
                        <button className="abtn" type="submit">
                            <img src={images.appleLogo} alt="Apple" className="btnimg" />
                            <span>Continue with Apple</span>
                        </button> 
                    </div>
                    <div className="emailLogin">
                        <button className="ebtn" type="submit">
                            <img src={images.emailLogo} alt="Email" className="btnimg" />
                            <span>Continue with Email</span>
                        </button>
                    </div>
                    <div className="facebookLogin">
                        <button className="fbtn" type="submit">
                            <img src={images.facebookLogo} alt="Facebook" className="btnimg"/>
                            <span>Continue with Facebook</span>
                        </button>
                    </div>
                </div>
            </div>

            <OtpVerfModal 
                isOpen={isOtpModalOpen} 
                onClose={handleOtpClose}
                phoneNumber={phoneNumber}
                country={country}
                onBack={handleBackToLogin}
            />
        </>
    )
}

export default LoginModal