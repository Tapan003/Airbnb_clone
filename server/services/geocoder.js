// utils/geocoder.js

async function geocodeAddress(address, city, country) {
    // Combine the fields to give the API the best chance of finding it
    const fullAddress = `${address}, ${city}, ${country}`;
    
    // OpenStreetMap Nominatim API endpoint
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;

    try {
        // Nominatim requires a custom User-Agent header, otherwise they block the request
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AirbnbClone_DevApp/1.0' 
            }
        });
        
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon) // Note: The API returns 'lon', but your schema uses 'lng'
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