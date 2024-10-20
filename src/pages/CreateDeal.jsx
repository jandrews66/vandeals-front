import { useState } from 'react'
import { usePlacesWidget } from "react-google-autocomplete";
import { LoadScript } from '@react-google-maps/api';


export default function CreateDeal(){
    const googleKey = import.meta.env.VITE_GOOGLE_API_KEY
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [restaurantAddress, setRestaurantAddress] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [days, setDays] = useState([])
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [coords, setCoords] = useState([])
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!coords.length) {
            console.error("Address error. Please enter a location");
            return;
        }
        const formData = {
            name,
            type,
            restaurant: restaurantName,
            address: restaurantAddress,
            description,
            start_date: startDate,
            end_date: endDate,
            days,
            coords
        }
        console.log(formData)

        const response = await fetch('http://localhost:3000/deal/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok){
            console.log('deal create' + data)
        } else {
            console.log('creation failed' + data)
        }
    }

    const handleCheck = (day) => {
        setDays((prevDays) => {
            if (prevDays.includes(day)){
                return prevDays.filter((d) => d !== day);
            } else {
                return [...prevDays, day]
            }
        })
    }

    const { ref } = usePlacesWidget({
        apiKey: googleKey,
        onPlaceSelected: (place) => {
            console.log(place)
            const address = place.formatted_address || place.address_components?.[0]?.long_name || "Unknown address";
            const inputValue = ref.current.value;
                  // Extract the name before the first comma
            const name = inputValue.split(',')[0].trim();
            setRestaurantName(name);
            setRestaurantAddress(address); 

            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            //save as lng lat for GeoJSON
            setCoords([lng, lat])
        },
        options: {
            types: ["restaurant", "bar"],

            componentRestrictions: { country: "ca" },
            bounds: {
                north: 49.361304,
                south: 49.195423,
                east: -123.010890,
                west: -123.278808,
            },
            strictBounds: true, // Only return results within the bounds 
        },
      });

/*       bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(49.195423, -123.278808), // Southwest corner of Vancouver
        new window.google.maps.LatLng(49.361304, -123.010890)  // Northeast corner of Vancouver
    ),
 */
    return(
        <div>
            <form className="space-y-4 max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="restaurantSearch" className="block text-sm font-medium text-gray-700">Search for Restaurant:</label>
                    <input 
                        ref={ref}
                        id="restaurantSearch" 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="ml-6">
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">Restaurant Name:</label>
                    <input 
                        id="restaurantName" 
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="ml-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Restaurant Address:</label>
                    <input 
                        id="address" 
                        value={restaurantAddress}
                        onChange={(e) => setRestaurantAddress(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Deal Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                    <textarea
                        id="description"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        onChange={(e) => setDescription(e.target.value)}
                        >
                    </textarea>
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Deal Type:</label>
                    <select
                        id="type"
                        value={type}
                        className="mt-1 block w-fit-content px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>-</option>
                        <option value="Happy-Hour">Happy Hour</option>
                        <option value="All-Day">All Day</option>
                        <option value="Brunch">Brunch</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        className="mt-1 block w-fit-content px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        className="mt-1 block w-fit-content px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Days of the Week:</label>
                    <ul className="flex flex-wrap gap-4 mt-2">
                        {daysOfWeek.map((day, index) => (
                            <li key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`checkbox-${index}`}
                                    name={day}
                                    className="form-checkbox text-emerald-600"
                                    onChange={() => handleCheck(day)}
                                />
                                <label htmlFor={day} className="ml-2 text-gray-700">{day}</label>
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-emerald-600 text-white font-semibold rounded-md shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    Create Deal
                </button>
            </form>

        </div>
    )
}