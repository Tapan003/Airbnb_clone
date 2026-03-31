import Carousel1 from "../components/Carousel1"
import { CarouselSerData } from "../data/ServiceCarouselData"
import { useState, useEffect } from "react"

function Services() {
    const [loading, setLoading] = useState(true)
    const [carousels, setCarousels] = useState([])

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() =>{
        fetchSliders()
    },[])

    const fetchSliders = async () =>{
        try{
            const responce = await fetch(`${API_URL}/api/carousels?page=services`)
            const data = await responce.json()
            setCarousels(data.carousels)
        }
        catch(error){
            console.error('Failed due to : ',error)
        }
        finally{
            setLoading(false)
        }
    }
    if(loading){
        return<div><h1>hold up its loading</h1></div>
    }
    return (
        <div>
            <h1>Services page</h1>
            {carousels.map(carousel => (
                <Carousel1 
                    key={carousel.id}
                    title={carousel.title}
                    cardsData={carousel.cards}
                    showLastCard={carousel.showLastCard}
                    lastCardImages={carousel.lastCardImages}
                />
            ))}
        </div>
    )
}
export default Services