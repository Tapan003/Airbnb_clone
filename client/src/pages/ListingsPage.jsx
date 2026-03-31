import { useEffect, useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { differenceInDays, format } from "date-fns"
import ProductNavbar from "../components/ProductPage/ProductNavbar"
import ProductFooter from "../components/footers/ProductFooter"
import Calendar from "../components/Calendar"
import '../css/ProductPage/ListingsPage.css'
import {loadStripe} from '@stripe/stripe-js';

function ListingsPage() {
    const [loading, setLoading] = useState(true)
    const [Listing, setListings] = useState()
    const { id } = useParams()
    const [checkIn, setCheckIn] = useState(null)
    const [checkOut, setCheckOut] = useState(null)
    const [guests, setGuests] = useState(1)
    const [showCalendar, setShowCalendar] = useState(false)
    const [showGuests, setShowGuests] = useState(false)
    const calendarPopupRef = useRef(null)
    const guestPopupRef = useRef(null)
    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {   
        fetchData()
    }, [id])

    const fetchData = async () => {
        setLoading(true)
        try {
            const listingsRes = await fetch(`${API_URL}/api/listings/${id}`)
            const listingsData = await listingsRes.json()
            setListings(listingsData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarPopupRef.current && !calendarPopupRef.current.contains(event.target)) {
                setShowCalendar(false)
            }
            if (guestPopupRef.current && !guestPopupRef.current.contains(event.target)) {
                setShowGuests(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    if (loading) return <div className="loading-listing">Loading Listing...</div>
    if (!Listing || !Listing.listing) return <div className="loading-listing">Listing not found.</div>

    const { listing } = Listing

    //price
    const nights = (checkIn && checkOut) ? differenceInDays(checkOut, checkIn) : 0;
    const basePriceTotal = nights * (listing.pricing?.basePrice || 0);
    const cleaningFee = listing.pricing?.cleaningFee || 0;
    const serviceFee = listing.pricing?.serviceFee || 0;
    const totalPrice = basePriceTotal > 0 ? basePriceTotal + cleaningFee + serviceFee : 0;
    const currencySym = listing.pricing?.currency === 'INR' ? '₹' : '$';

    const handleSubmit = async () => {
        // user log in check
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        
        if (!user || !user.id) {
            alert("Please log in to make a booking.")
            //open login modal or redirect to login here
            navigate('/')
            return
        }

        if (!checkIn || !checkOut) {
            alert("Please select your check-in and check-out dates.")
            return
        }

        try {
            const response = await fetch(`${API_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id, 
                    listing: listing._id,
                    checkIn: checkIn.toISOString(),
                    checkOut: checkOut.toISOString(),
                    guests: guests,
                    totalPrice: totalPrice 
                })
            })

            const data = await response.json()

            if (!response.ok) {
                alert(data.message || "Failed to create booking.")
                return
            }

            alert("✓ Booking request sent! Waiting for host confirmation.")

            // navigate('/my-bookings')           

        } catch (error) {
            console.error("Error submitting booking:", error)
            alert("Something went wrong. Please try again.")
        }
    }

    return (
        <div>
        <ProductNavbar/>
        <div className="page-wrapper">
            <main className="listings-container">
                <div className="listing-header">
                    <h2>{listing.title}</h2>
                    <p className="listing-subheader">{listing.location.city}, {listing.location.country}</p>
                </div>

                <div className="gallery-grid">
                    <div className="main-image">
                        <img src={listing.mainImage} alt="Main view" />
                    </div>
                    <div className="sub-images">
                        {[1, 2, 3, 4].map((num, idx) => (
                            <img 
                                key={idx}
                                src={listing.images?.[num]?.url || listing.mainImage} 
                                alt={`View ${num + 1}`} 
                                className={idx === 1 ? "top-right-img" : idx === 3 ? "bottom-right-img" : ""}
                            />
                        ))}
                    </div>
                </div>

                <div className="content-layout">
                    <div className="listing-details">
                        <div className="host-info-brief">
                            <h3>{listing.propertyType} hosted by {listing.host?.name || "Host"}</h3>
                            <ul className="basic-amenities">
                                <li>{listing.details?.guests || 0} guests</li>
                                <li>· {listing.details?.bedrooms || 0} bedrooms</li>
                                <li>· {listing.details?.beds || 0} beds</li>
                                <li>· {listing.details?.bathrooms || 0} baths</li>
                            </ul>
                        </div>
                        <hr className="divider" />
                        <div className="about-section"><p>{listing.description}</p></div>
                        <hr className="divider" />
                        <div className="calendar-section">
                            <h3>{nights > 0 ? `${nights} nights in ${listing.location.city}` : 'Select check-in date'}</h3>
                            <Calendar checkIn={checkIn} checkOut={checkOut} setCheckIn={setCheckIn} setCheckOut={setCheckOut} />
                        </div>
                    </div>

                    <div className="sidebar">
                        <div className="booking-card">
                            <div className="booking-card-header">
                                <span className="price"><strong>{currencySym}{listing.pricing?.basePrice || 0}</strong> <span className="night-text">night</span></span>
                            </div>
                            <div className="booking-inputs">
                                <div className="dates-input-container" ref={calendarPopupRef}>
                                    <div className="dates-input" onClick={() => { setShowCalendar(true); setShowGuests(false); }}>
                                        <div className="check-in">
                                            <div className="label">CHECK-IN</div>
                                            <div className="value-text">{checkIn ? format(checkIn, 'MM/dd/yyyy') : 'Add date'}</div>
                                        </div>
                                        <div className="check-out">
                                            <div className="label">CHECKOUT</div>
                                            <div className="value-text">{checkOut ? format(checkOut, 'MM/dd/yyyy') : 'Add date'}</div>
                                        </div>
                                    </div>
                                    {showCalendar && (
                                        <div className="floating-popover calendar-popover">
                                            <div className="popover-header">
                                                <h4>{nights > 0 ? `${nights} nights` : 'Select dates'}</h4>
                                                <p>{checkIn && checkOut ? `${format(checkIn, 'MMM d, yyyy')} - ${format(checkOut, 'MMM d, yyyy')}` : 'Minimum stay: 1 night'}</p>
                                            </div>
                                            <Calendar checkIn={checkIn} checkOut={checkOut} setCheckIn={setCheckIn} setCheckOut={setCheckOut} />
                                            <div className="popover-footer">
                                                <button className="text-btn" onClick={() => {setCheckIn(null); setCheckOut(null);}}>Clear dates</button>
                                                <button className="solid-btn-small" onClick={() => setShowCalendar(false)}>Close</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="guests-input-container" ref={guestPopupRef}>
                                    <div className="guests-input" onClick={() => { setShowGuests(!showGuests); setShowCalendar(false); }}>
                                        <div className="label">GUESTS</div>
                                        <div className="value-text">{guests} guest{guests > 1 ? 's' : ''}</div>
                                        <span className={`dropdown-arrow ${showGuests ? 'up' : ''}`}>▼</span> 
                                    </div>

                                    {showGuests && (
                                        <div className="floating-popover guest-popover">
                                            <div className="guest-row">
                                                <div className="guest-info">
                                                    <h4>Adults</h4>
                                                    <p>Age 13+</p>
                                                </div>
                                                <div className="guest-counter">
                                                    <button 
                                                        className="round-btn" 
                                                        onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                                        disabled={guests <= 1}
                                                    >-</button>
                                                    <span>{guests}</span>
                                                    <button 
                                                        className="round-btn" 
                                                        onClick={() => setGuests(prev => Math.min(listing.details?.guests || 1, prev + 1))}
                                                        disabled={guests >= (listing.details?.guests || 1)}
                                                    >+</button>
                                                </div>
                                            </div>
                                            <p className="max-guests-note">This place has a maximum of {listing.details?.guests || 1} guests, not including infants.</p>
                                            <div className="popover-footer-right">
                                                <button className="text-btn-bold" onClick={() => setShowGuests(false)}>Close</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <button className="reserve-btn" onClick={handleSubmit}>
                                {checkIn && checkOut ? 'Reserve' : 'Check availability'}
                            </button>
                            
                            {checkIn && checkOut && (
                                <div className="price-breakdown">
                                    <p className="charge-notice">You won't be charged yet</p>
                                    <div className="price-row">
                                        <span>{currencySym}{listing.pricing?.basePrice} x {nights} nights</span>
                                        <span>{currencySym}{basePriceTotal}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Cleaning fee</span>
                                        <span>{currencySym}{cleaningFee}</span>
                                    </div>
                                    <div className="price-row">
                                        <span>Airbnb service fee</span>
                                        <span>{currencySym}{serviceFee}</span>
                                    </div>
                                    <hr className="divider-small" />
                                    <div className="price-row total">
                                        <span>Total before taxes</span>
                                        <span>{currencySym}{totalPrice}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            
        </div>
        <ProductFooter />
        </div>
    )
}

export default ListingsPage