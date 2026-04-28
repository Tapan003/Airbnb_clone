import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css'; // CRITICAL: This makes the map render correctly

function ListingMap({ location }) {
    // We safely extract coordinates, or fallback to a default location (12.87 N, 74.88 E) if they are missing
    const lat = location?.coordinates?.lat || 12.8700;
    const lng = location?.coordinates?.lng || 74.8800;

    return (
        // Using Tailwind for the container styling
        <div className="w-full h-[480px] rounded-xl overflow-hidden border border-border mt-4">
            <Map
                initialViewState={{
                    longitude: lng,
                    latitude: lat,
                    zoom: 13
                }}
                // This is a free, clean basemap style from CartoDB
                mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                scrollZoom={false} // Airbnb disables scroll-to-zoom initially so it doesn't trap the user's page scroll
            >
                {/* The Custom Map Pin */}
                <Marker longitude={lng} latitude={lat} anchor="bottom">
                    <div className="bg-[#e51d53] text-white p-3 rounded-full shadow-lg flex items-center justify-center border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                </Marker>

                {/* Adds standard zoom buttons to the map */}
                <NavigationControl position="bottom-right" />
            </Map>
        </div>
    );
}

export default ListingMap;