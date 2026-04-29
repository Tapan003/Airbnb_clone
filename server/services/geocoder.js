
async function geocodeAddress(address, city, country) {

    const fullAddress = `${address}, ${city}, ${country}`;
    
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AirbnbClone_DevApp/1.0' 
            }
        });
        
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon) 
            };
        }
        
        console.warn(`Could not geocode address: ${fullAddress}`);
        return null;

    } catch (error) {
        console.error("Geocoding API Error:", error);
        return null;
    }
}

module.exports = { geocodeAddress };