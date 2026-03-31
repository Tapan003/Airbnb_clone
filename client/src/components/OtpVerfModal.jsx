import { useState, useEffect } from "react"
import OtpInput from "react-otp-input"
import ProfileCompletionModal from "./ProfileCompletionModal"
import "../css/OtpVerfModal.css"

function OtpVerfModal({ isOpen, onClose, phoneNumber, country, onBack }) {
    const [otp, setOtp] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState("")
    
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [verifiedUser, setVerifiedUser] = useState(null)

    if (!isOpen) return null

    const handleVerify = async (e) => {
        e.preventDefault()
        
        if (otp.length !== 6) {
            setError('Please enter the complete 6-digit code')
            return
        }

        setIsVerifying(true)
        setError("")
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    otp
                })
            })

            const data = await response.json()

            if (response.ok) {
                
                setVerifiedUser(data.user)
                
                if (!data.user.isProfileComplete) {
                    setShowProfileModal(true)
                    
                } else {
                    localStorage.setItem('user', JSON.stringify(data.user))
                    alert('Logged in successfully!')
                    onClose()
                }
            } else {
                setError(data.message || 'Invalid OTP. Please try again.')
            }
        } catch (error) {
            console.error('Verification error:', error)
            setError('Something went wrong. Please try again.')
        } finally {
            setIsVerifying(false)
        }
    }

    const handleProfileComplete = () => {
        alert('Welcome to Airbnb! Your profile is complete.')
        onClose()
        window.location.reload()
    }

    return (
        <>
            {!showProfileModal && (
                <>
            <div className="modal-backdrop otp-backdrop" onClick={onClose}></div>

            <div className="modal-container otp-modal-container">
                <div className="topnav">
                    <button className="close back-button" onClick={onBack} type="button">
                        ←
                    </button>
                    Confirm your number
                    <button className="close" onClick={onClose} type="button">×</button>
                </div>
                
                <div className="otp-content">
                    <p className="otp-instruction">
                        Enter the code we've sent via SMS to {phoneNumber}:
                    </p>
                    
                    <form onSubmit={handleVerify}>
                        <div className="otp-input-container">
                            <OtpInput
                                value={otp}
                                onChange={(value) => {
                                    setOtp(value)
                                    setError("")
                                }}
                                numInputs={6}
                                renderSeparator={<span className="otp-separator">-</span>}
                                renderInput={(props) => <input {...props} className="otp-input-box" />}
                                shouldAutoFocus
                                inputType="tel"
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <div className="otp-footer">
                            <button 
                                type="button" 
                                className="conbtn"
                                onClick={onBack}
                            >
                                Choose a different option
                            </button>

                            <button 
                                className="conbtn" 
                                type="submit"
                                disabled={otp.length !== 6 || isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            </>
            )}

            {/* Profile Completion Modal */}
            <ProfileCompletionModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                user={verifiedUser}
                onProfileComplete={handleProfileComplete}
            />
        </>
    )
}

export default OtpVerfModal