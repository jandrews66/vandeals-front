import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { getDistance } from 'geolib';
import { useLocation } from '../contexts/LocationContext.jsx';
import DayPicker from '../components/DayPicker.jsx'
import Logo from '../components/Logo.jsx'
import SanitizedHtml from '../components/SanitzedHtml'
import LocationModal from '../components/Modal.jsx'

export default function Home(){
    const navigate = useNavigate();
    const [deals, setDeals] = useState([])
    const [selectedTypes, setSelectedTypes] = useState(["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"])
    const types = ["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"]
    const todayIndex = new Date().getDay();
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = daysOfWeek[todayIndex];
    const [selectedDay, setSelectedDay] = useState({ day: today, index: 0 })
    const [loading, setLoading] = useState(null)
    const [limit, setLimit] = useState(5)
    const { location, setLocation } = useLocation(); // Get location from context\
    const [error, setError] = useState(null)

    useEffect(() => {
        if (selectedTypes.length > 0){

            setLoading(true)
            const typesQuery = selectedTypes.join(',');
            const { day, index } = selectedDay;
            const locationQuery = `${location.lng}, ${location.lat}`

            fetch(`http://localhost:3000/deal/todays?types=${typesQuery}&location=${locationQuery}&day=${day}&index=${index}&limit=${limit}`)
            .then((response) => response.json())
            .then((data) => {
                setDeals(data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err)
                setDeals([]);
            });
        } else {
            setDeals([]);
        }

    }, [selectedTypes, selectedDay, limit, location, error]);

    function handleCheck(type){
        setSelectedTypes((prevTypes) => {
            if (prevTypes.includes(type)){
                return prevTypes.filter((t) => t !== type);
            } else {
                return [...prevTypes, type]
            }
        })
    }

    function checkedInput(type){
        return selectedTypes.includes(type)
    }

    function calcDistance(dealCoords) {
        const lnglat = [location.lng, location.lat];
        const result = getDistance(lnglat, dealCoords);
        const resultKms = (result / 1000).toFixed(1); 

        return `${resultKms} km away`; // Add units for better readability 
    }

    function handleNavigate(id){
        navigate(`/deals/${id}`)
    }

    function getDirections(name, address){
        const sanitizedName = name.replace(/[^a-zA-Z0-9\s]/g, '').trim(); // Keeps only alphanumeric characters and spaces

        window.open(`https://maps.google.com?q=${sanitizedName}, ${address}` );
    }



    return (
        <>
        <div className="flex flex-col items-center sm:px-10 px-2 pt-2">
            <Logo />

            <div className="p-1 mb-4 border-2 rounded border-gray-700">
                <ul className="sm:flex sm:gap-3 grid grid-cols-2 gap-1 items-center">
                    {types.map((type, index) => (
                        <li key={index} className="flex items-center">
                            <input 
                                type="checkbox"
                                name="type"
                                checked={checkedInput(type)}
                                onChange={() => handleCheck(type)}
                                className="mx-1 hover:cursor-pointer" 
                            />
                            <label className="font-semibold text-gray-700 text-sm whitespace-nowrap">
                                {type}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center mb-4">
                <DayPicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} daysOfWeek={daysOfWeek}/>
                <LocationModal />
            </div>
            <div className="">
                {loading ? 
                    <div className="text-center">Finding amazing deals...</div>
                    :
                    <div className="flex flex-col items-center space-y-4">
                        {deals.length > 0 ? deals.map((deal) => (
                        <div 
                        key={deal._id} 
                        className="flex flex-col p-4 bg-gray-50 w-full max-w-[480px] md:w-[4800px] border-2 rounded border-gray-700 shadow-md hover:cursor-pointer"
                        onClick={() => handleNavigate(deal._id)}
                        >
                            <div className="flex justify-between">
                                <div className="font-semibold text-teal-600">{deal.restaurant}</div>
                                <div 
                                    className="text-sm text-right text-blue-600 hover:underline"
                                    onClick={() => getDirections(deal.restaurant, deal.address)}
                                    >
                                        {calcDistance(deal.location.coordinates)}
                                </div>

                            </div>

                            <div className="pb-2 font-semibold text-gray-600">{deal.name}</div>
                            <div className="text-sm text-gray-600 overflow-hidden line-clamp-4">
                                <SanitizedHtml htmlContent={deal.description} />
                            </div>

                        </div>
                    )) : "No deals found for the selected filters."}
                    </div>
                }
            </div>

            {deals.length >= limit &&
                <button className="m-4 py-2 px-4 border-2 rounded border-gray-700 bg-blue-400 hover:bg-pink-400 text-gray-800 text-sm font-semibold" onClick={()=> setLimit(limit + limit)}>Show More</button>
            }
        </div>
       

        </>

    )
}