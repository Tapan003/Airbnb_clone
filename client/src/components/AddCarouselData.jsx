import { useState } from "react"

function AddCarouselData() {
    const [page, setPage] = useState()
    const [id, setId] = useState()
    const [title, setTitle] = useState()
    const [subtitle, setSubtitle] = useState()
    const [cards, setCards] = useState([])
    const [showLastCard, setShowLastCard] = useState(false)
    const [lastCardImages, setLastCardImages] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/add-carousel-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: page,
                    id: id,
                    title: title,
                    subtitle: subtitle,
                    cards: JSON.parse(cards),
                    showLastCard: showLastCard,
                    lastCardImages: lastCardImages
                })
            })
        }
        catch (error) {
            console.error('Error adding carousel data:', error)
        }
    }

    return (
        <div>
            <h1>Add Carousel Data</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter page (home, experiences, services)" value={page} onChange={(e) => setPage(e.target.value)} />
                <input type="text" placeholder="Enter carousel ID" value={id} onChange={(e) => setId(e.target.value)} />
                <input type="text" placeholder="Enter carousel title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Enter carousel subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                <input type="text" placeholder="Enter cards data (JSON format)" value={cards} onChange={(e) => setCards(e.target.value)} />
                <label>
                    <input type="checkbox" checked={showLastCard} onChange={(e) => setShowLastCard(e.target.checked)} />
                    Show last card
                </label>
                <input type="text" placeholder="Enter last card images (comma separated)" value={lastCardImages} onChange={(e) => setLastCardImages(e.target.value.split(','))} />

                <button type="submit">Add Data</button>
            </form>
        </div>
    )
} 

export default AddCarouselData