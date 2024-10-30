import { useState, } from 'react'
import { usePlacesWidget } from "react-google-autocomplete";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreateDeal(){
    const googleKey = import.meta.env.VITE_GOOGLE_API_KEY
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [restaurantAddress, setRestaurantAddress] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const [days, setDays] = useState([])
    const [coords, setCoords] = useState([])
    const [timePeriods, setTimePeriods] = useState([]);
    
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
            coords,
            time_periods: timePeriods
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

        const addTimePeriod = () => {
        setTimePeriods([...timePeriods, { start: '', end: '' }])
        }

        const handleTimeChange = (index, field, value) => {
            const updatedPeriods = [...timePeriods];
            updatedPeriods[index][field] = value;
            setTimePeriods(updatedPeriods)
        }

        const removeTimePeriod = () => {
            const updatedPeriods = timePeriods.slice(0, -1)
            setTimePeriods(updatedPeriods)
        }

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
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                        onChange={(e) => setDescription(e.target.value)}
                        >
                    </textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Valid On:</label>
                    <ul className="flex flex-wrap gap-4 mt-2">
                        {daysOfWeek.map((day, index) => (
                            <li key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`checkbox-${index}`}
                                    name={day}
                                    className="form-checkbox hover:cursor-pointer"
                                    onChange={() => handleCheck(day)}
                                />
                                <label 
                                    htmlFor={`checkbox-${index}`}
                                    className="ml-2 text-gray-700 hover:cursor-pointer"
                                >
                                    {day}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <hr></hr>
                <p className="block text pt-2  text-gray-700">Optional Settings:</p>
                <div>
                    {timePeriods.map((period, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Time:</label>
{/*                                 <input
                                    type="time"
                                    onClick={(e) => e.target.showPicker()}
                                    value={period.start}
                                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                    className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"

                                ></input> */}
                                <DatePicker
                                    selected={period.start ? new Date(`1970-01-01T${period.start}`) : new Date(`1970-01-01T12:00`)} //selected expects date object
                                    onChange={(date) => handleTimeChange(index, 'start', date ? date.toTimeString().slice(0, 5) : '')} //trim to only use time from date object
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15} // every 15 mins
                                    dateFormat="HH:mm"
                                    className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time:</label>
                                <DatePicker
                                    selected={period.end ? new Date(`1970-01-01T${period.end}`) : new Date(`1970-01-01T17:00`)}
                                    onChange={(date) => handleTimeChange(index, 'end', date ? date.toTimeString().slice(0, 5) : '')}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15} 
                                    dateFormat="HH:mm"
                                    className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col gap-1">
                        {timePeriods.length > 0 &&                  
                            <button type="button" onClick={removeTimePeriod} className="text-red-500 text-sm w-fit">
                                    - Remove Time Period
                            </button>
                        }
                        {timePeriods.length < 3 &&
                            <button type="button" onClick={addTimePeriod} className="text-blue-500 text-sm w-fit">
                                + Add Time Period
                            </button>

                        }
                    </div>

                </div>
                <div className="">
                    {!showStartDate && (
                        <button
                        onClick={() => setShowStartDate(true)}
                        className="text-blue-500 text-sm w-fit"
                        >
                        + Add Start Date
                        </button>
                    )}
                    {showStartDate && (
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                            <input
                                type="date"
                                id="startDate"
                                onClick={(e) => e.target.showPicker()}
                                className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <button
                            onClick={() => {
                                setShowStartDate(false);
                                setStartDate('');
                                }}
                            className="text-red-500 text-sm w-fit"
                            >
                            - Remove Start Date
                            </button>
                        </div>
                        
                    )}
                </div>
                <div>
                    {!showEndDate && (
                    <button
                    onClick={() => setShowEndDate(true)}
                    className="text-blue-500 text-sm w-fit"
                    >
                    + Add End Date
                    </button>
                    )}
                    {showEndDate && (
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            onClick={(e) => e.target.showPicker()}
                            className="mt-1 block  px-3 py-2 border border-gray-300 rounded-md shadow-sm "
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button
                        onClick={() => {
                            setShowEndDate(false);
                            setEndDate('');
                            }}
                        className="text-red-500 text-sm w-fit"
                        >
                        - Remove End Date
                        </button>
                    </div>
                    )}
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