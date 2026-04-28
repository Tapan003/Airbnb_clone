import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function RevenueChart({ bookings }) {
    const monthlyRevenue = bookings.reduce((acc, booking) => {
        if (booking.status === 'confirmed' || booking.status === 'completed') {
            const date = new Date(booking.createdAt)
            const monthYear = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            
            if (!acc[monthYear]) {
                acc[monthYear] = 0
            }
            acc[monthYear] += booking.pricing.totalPrice
        }
        return acc
    }, {})

    const data = Object.entries(monthlyRevenue)
        .map(([month, revenue]) => ({
            month,
            revenue
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month))

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{payload[0].payload.month}</p>
                    <p className="value">₹{payload[0].value.toLocaleString('en-IN')}</p>
                </div>
            )
        }
        return null
    }

    if (data.length === 0) {
        return <div className="no-data">No revenue data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#717171" />
                <YAxis stroke="#717171" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#E61E4D" 
                    strokeWidth={3}
                    dot={{ fill: '#E61E4D', r: 5 }}
                    activeDot={{ r: 7 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default RevenueChart