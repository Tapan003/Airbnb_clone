import Carousel1 from "../components/Carousel1"
import { CarouselExpData } from "../data/ExpCarouselData"
import { useEffect,useState } from "react"


function Experiences() {
    // const firstCarousel = CarouselExpData.slice(0, 1)
    // const otherCarousels = CarouselExpData.slice(1)
    const [loading, setLoading] = useState(true)
    const [carousels, setCarousels] = useState([])

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() =>{
        fetchSliders()
    },[])

    const fetchSliders = async () =>{
        try{
            const responce = await fetch(`${API_URL}/api/carousels?page=experiences`)
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
        // <div>
        //     <h1>Experiences page</h1>
        //     {firstCarousel.map(carousel => (
        //         <Carousel1 
        //             key={carousel.id}
        //             title={carousel.title}
        //             subtitle={carousel.subtitle}
        //             cardsData={carousel.cards}
        //             showLastCard={carousel.showLastCard}
        //             cardType={carousel.cardType}
        //             lastCardImages={carousel.lastCardImages}
        //         />
        //     ))}
        //     <h1>Popular with travellers from your area</h1>
        //     {otherCarousels.map(carousel => (
        //         <Carousel1 
        //             key={carousel.id}
        //             title={carousel.title}
        //             cardsData={carousel.cards}
        //             showLastCard={carousel.showLastCard}
        //             cardType={carousel.cardType}
        //             lastCardImages={carousel.lastCardImages}
        //         />
        //     ))}
        // </div>
        <div>
            <h1>Exp Page</h1>
            {carousels.map(carousel =>(
                <Carousel1
                    key={carousel.id}
                    title={carousel.title}
                    cardsData={carousel.cards}
                    showLastCard={carousel.showLastCard}
                    lastCardImages={carousel.lastCardImages}
                />)
            )}

        </div>
    )
}
export default Experiences
    