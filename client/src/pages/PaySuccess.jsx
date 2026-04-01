import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import '../css/PaymentResult.css'

function PaymentSuccess() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        verifyPayment()
    }, [])

    const verifyPayment = async () => {
        const sessionId = searchParams.get('session_id')
        const bookingId = searchParams.get('booking_id')

        if (!sessionId || !bookingId) {
            alert('Invalid payment link')
            navigate('/')
            return
        }

        try {
            const response = await fetch('http://localhost:5000/api/payment/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionId, bookingId })
            })

            const data = await response.json()

            if (data.success) {
                setVerified(true)
            } else {
                alert('Payment verification failed')
                navigate('/my-bookings')
            }
        } catch (error) {
            console.error('Verification error:', error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="payment-loading">Verifying payment...</div>
    }

    return (
        <div className="payment-result-page">
            <div className="payment-success-card">
                <div className="success-icon">✓</div>
                <h1>Payment Successful!</h1>
                <p>Your booking has been confirmed.</p>
                <p className="booking-info">
                    You will receive a confirmation email shortly.
                </p>
                <div className="action-buttons">
                    <button 
                        className="btn-primary"
                        onClick={() => navigate('/my-bookings')}
                    >
                        View My Bookings
                    </button>
                    <button 
                        className="btn-secondary"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess