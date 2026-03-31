import '../css/Home.css'
import { useEffect, useState } from 'react'
import Carousel1 from '../components/Carousel1'
import { CarouselsData } from '../data/HomeCarouselData'
import HomeFooter from '../components/footers/HomeFooter'

function Home() {
    const [carousels, setCarousels] = useState([])
    const [loading, setLoading] = useState(true)
    const API_URL = import.meta.env.VITE_API_URL 

    useEffect(() => {
        fetchCarousels()
    }, [])

    const fetchCarousels = async () => {
        try {
            const response = await fetch(`${API_URL}/api/carousels?page=home`)
            const data = await response.json()
            {/*console.log(data)*/}
            setCarousels(data.carousels)
        } catch (error) {
            console.error('Failed to fetch carousels:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="loading">Loading amazing stays...</div>
    }
    return (
        <div>
            {/* <h1>Home page</h1> */}
            {carousels.map(carousel => (
                <Carousel1 
                    key={carousel.id}
                    title={carousel.title}
                    cardsData={carousel.cards}
                    showLastCard={carousel.showLastCard}
                    lastCardImages={carousel.lastCardImages}
                />
            ))}
            <HomeFooter />
        </div>
    )
}
export default Home