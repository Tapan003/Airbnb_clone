import { useRef, useState, useEffect } from 'react'
import '../css/Carousel1.css'
import Card1 from '../utils/bangalore/Card1';
import Card2 from '../utils/bangalore/Card2';
import LastCard from '../utils/bangalore/LastCard'
import { Link } from 'react-router-dom';

function Carousel1({ title, subtitle, cardsData, showLastCard = true, cardType = 'card1', lastCardImages }) {
    const scrollRef = useRef(null)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)

      const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setShowLeftButton(scrollLeft > 0)
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        const scrollContainer = scrollRef.current
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScroll)
            checkScroll() 
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', checkScroll)
            }
        }
    }, [])

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -400 : 400
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    const CardComponent = cardType === 'card2' ? Card2 : Card1

    const lastCardImagesFinal = lastCardImages || cardsData.slice(0, 3).map(card => card.imageUrl)
        
    return (
       <div className="carousel1-wrapper">
            <div className="carousel1-header">
                <div className="carousel1-title-section">
                    <h2 className="carousel1-title">{title}</h2>
                    {subtitle && <p className="carousel1-subtitle">{subtitle}</p>}
                </div>
                <div className="scroll-buttons">
                    <button 
                        className={`scroll-btn scroll-left ${!showLeftButton ? 'disabled' : ''}`}
                        onClick={() => scroll('left')}
                        type="button"
                        disabled={!showLeftButton}
                    >
                        <svg viewBox="0 0 32 32" style={{width: '12px', height: '12px'}}>
                            <path fill="none" stroke="currentColor" strokeWidth="3" d="M20 28 L8.7 16.7a1 1 0 0 1 0-1.4L20 4"></path>
                        </svg>
                    </button>
                    <button 
                        className={`scroll-btn scroll-right ${!showRightButton ? 'disabled' : ''}`}
                        onClick={() => scroll('right')}
                        type="button"
                        disabled={!showRightButton}
                    >
                        <svg viewBox="0 0 32 32" style={{width: '12px', height: '12px'}}>
                            <path fill="none" stroke="currentColor" strokeWidth="3" d="M12 4 l11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div className="carousel1-container">
                <div className="carousel1-slides" ref={scrollRef}>
                    {cardsData.map(card => (
                        <CardComponent 
                            key={card.id}
                            {...card}    
                        />
                        
                    ))}
                    {showLastCard && <LastCard images={lastCardImagesFinal} />}
                </div>
            </div>
        </div>
    )
}

export default Carousel1