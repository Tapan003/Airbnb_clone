import { useEffect, useRef, useState } from 'react'
import '../../css/cards/LastCard.css'

export default function LastCard({ images }) {
    const [isVisible, setIsVisible] = useState(false)
    const cardRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => {
            if (observer) observer.disconnect()
        }
    }, [])

    const defaultImages = [
        "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQ5NjI2NzkwMDYzOTA4NjMxMg==/original/45261fcb-aaa6-4eeb-9db4-704ec998a082.jpeg?im_w=480",
        "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQ5NjI2NzkwMDYzOTA4NjMxMg==/original/45261fcb-aaa6-4eeb-9db4-704ec998a082.jpeg?im_w=480",
        "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQ5NjI2NzkwMDYzOTA4NjMxMg==/original/45261fcb-aaa6-4eeb-9db4-704ec998a082.jpeg?im_w=480"
    ]

    const displayImages = images && images.length >= 3 ? images : defaultImages

    return (
        <div className={`last-card ${isVisible ? 'visible' : ''}`} ref={cardRef}>
            <div className="last-card-images">
                <img 
                    src={displayImages[0]} 
                    alt="" 
                    className="last-card-image image-1"
                />
                <img 
                    src={displayImages[1]} 
                    alt="" 
                    className="last-card-image image-2"
                />
                <img 
                    src={displayImages[2]} 
                    alt="" 
                    className="last-card-image image-3"
                />
            </div>
             <div className="last-card-text">See all</div>
        </div>
    )
}