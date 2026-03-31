import { useState } from 'react'
import '../../css/cards/Card2.css'

export default function Card2({ imageUrl, badge, title, location, price, rating, isGuestFavorite }) {
    const [isFavorited, setIsFavorited] = useState(false)

    const toggleFavorite = (e) => {
        e.preventDefault()
        setIsFavorited(!isFavorited)
    }

    return (
        <div className="card2">
            <div className="card2-image-container">
                <img src={imageUrl} alt={title} className="card2-image" />
                {badge && (
                    <div className="card2-badge">
                        <span className="badge-icon">✦</span>
                        <span>{badge}</span>
                    </div>
                )}
                <button 
                    className={`heart-button ${isFavorited ? 'favorited' : ''}`}
                    onClick={toggleFavorite}
                    type="button"
                    aria-label="Add to wishlist"
                >
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 28c-0.25 0-0.5-0.094-0.688-0.281l-9.75-9.406c-0.125-0.109-3.563-3.25-3.563-7.813 0-4.266 2.734-7.5 6.5-7.5 2.547 0 4.781 1.453 6.5 3.609 1.719-2.156 3.953-3.609 6.5-3.609 3.766 0 6.5 3.234 6.5 7.5 0 4.563-3.438 7.703-3.563 7.813l-9.75 9.406c-0.188 0.187-0.438 0.281-0.688 0.281z"></path>
                    </svg>
                </button>
            </div>
            <div className="card2-content">
                <div className="card2-title">{title}</div>
                <div className="card2-location">{location}</div>
                <div className="card2-details">
                    <span className="card2-price">{price}</span>
                    {rating && (
                        <>
                            <span className="card2-separator">·</span>
                            <span className="card2-star-icon">★</span>
                            <span className="card2-rating">{rating}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}