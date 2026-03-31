import { useState } from 'react'
import '../css/ProfileCompletionModal.css'

function ProfileCompletionModal({ isOpen, onClose, user, onProfileComplete }) {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            const response = await fetch('http://localhost:5000/api/auth/complete-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    name: formData.name,
                    email: formData.email
                })
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user))
                onProfileComplete()
                window.location.reload()
                onClose()
            } else {
                setErrors({ submit: data.message || 'Failed to complete profile' })
            }
        } catch (error) {
            console.error('Profile completion error:', error)
            setErrors({ submit: 'Something went wrong. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSkip = () => {
        onClose()
    }

    return (
        <>
            <div className="modal-backdrop profile-backdrop"></div>
            <div className="modal-container profile-modal-container">
                <div className="topnav">
                    Complete Your Profile
                </div>
                <div className="profile-content">
                    <p className="profile-instruction">
                        Welcome! Let's get to know you better. 
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Your Name </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value })
                                    setErrors({ ...errors, name: '' })
                                }}
                                placeholder="Kim Jong Un"
                                className={errors.name ? 'error-input' : ''}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value })
                                    setErrors({ ...errors, email: '' })
                                }}
                                placeholder="john@example.com"
                                className={errors.email ? 'error-input' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                        {errors.submit && (
                            <div className="submit-error">{errors.submit}</div>
                        )}
                        <div className="profile-actions">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="btn-skip"
                            >
                                Skip for now
                            </button>
                            <button
                                type="submit"
                                className="btn-complete"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Complete Profile'}
                            </button>
                        </div>
                    </form>
                    <p className="privacy-note">
                        We'll use this to personalize your experience and send important updates.
                    </p>
                </div>
            </div>
        </>
    )
}

export default ProfileCompletionModal