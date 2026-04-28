import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function BookingStatus({ bookings }) {
    const statusCounts = bookings.reduce((acc, booking) => {
        const status = booking.status
        if (!acc[status]) {
            acc[status] = 0
        }
        acc[status]++
        return acc
    }, {})

    const data = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count
    }))

    const COLORS = {
        'Confirmed': '#00A699',
        'Pending': '#FFB400',
        'Cancelled': '#c13515',
        'Completed': '#767676'
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{payload[0].name}</p>
                    <p className="value">{payload[0].value} bookings</p>
                </div>
            )
        }
        return null
    }

    if (data.length === 0) {
        return <div className="no-data">No status data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default BookingStatus