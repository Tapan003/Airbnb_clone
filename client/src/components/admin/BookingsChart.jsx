import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function BookingsChart({ bookings }) {
    // Group bookings by month
    const monthlyBookings = bookings.reduce((acc, booking) => {
        const date = new Date(booking.createdAt)
        const monthYear = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
        
        if (!acc[monthYear]) {
            acc[monthYear] = { month: monthYear, confirmed: 0, pending: 0, cancelled: 0 }
        }
        
        if (booking.status === 'confirmed' || booking.status === 'completed') {
            acc[monthYear].confirmed++
        } else if (booking.status === 'pending') {
            acc[monthYear].pending++
        } else if (booking.status === 'cancelled') {
            acc[monthYear].cancelled++
        }
        
        return acc
    }, {})

    const data = Object.values(monthlyBookings)
        .sort((a, b) => new Date(a.month) - new Date(b.month))

    if (data.length === 0) {
        return <div className="no-data">No booking data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#717171" />
                <YAxis stroke="#717171" />
                <Tooltip />
                <Legend />
                <Bar dataKey="confirmed" fill="#00A699" name="Confirmed" />
                <Bar dataKey="pending" fill="#FFB400" name="Pending" />
                <Bar dataKey="cancelled" fill="#c13515" name="Cancelled" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BookingsChart