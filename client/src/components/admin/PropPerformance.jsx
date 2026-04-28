import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function PropPerformance({ bookings }) {
    const listingBookings = bookings.reduce((acc, booking) => {
        if (booking.status === 'confirmed' || booking.status === 'completed') {
            const listingId = booking.listing?._id || booking.listing
            const listingTitle = booking.listing?.title || 'Unknown'
            
            if (!acc[listingId]) {
                acc[listingId] = {
                    title: listingTitle,
                    bookings: 0,
                    revenue: 0
                }
            }
            
            acc[listingId].bookings++
            acc[listingId].revenue += booking.pricing?.totalPrice || 0
        }
        return acc
    }, {})

    const data = Object.values(listingBookings)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5)
        .map(item => ({
            ...item,
            title: item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title
        }))

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{payload[0].payload.title}</p>
                    <p className="value">{payload[0].value} bookings</p>
                    <p className="value">₹{payload[0].payload.revenue.toLocaleString('en-IN')}</p>
                </div>
            )
        }
        return null
    }

    if (data.length === 0) {
        return <div className="no-data">No property data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="title" stroke="#717171" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#717171" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#E61E4D" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default PropPerformance