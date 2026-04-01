import { useNavigate, useSearchParams } from 'react-router-dom'
import '../css/PaymentResult.css'

function PaymentCancelled() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const bookingId = searchParams.get('booking_id')

    return (
        <div className="payment-result-page">
            <div className="payment-cancelled-card">
                <div className="cancel-icon">✕</div>
                <h1>Payment Cancelled</h1>
                <p>Your payment was not completed.</p>
                <p className="info-text">
                    Your booking is still saved. You can complete payment anytime from "My Bookings".
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

export default PaymentCancelled