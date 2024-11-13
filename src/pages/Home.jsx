import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import GetUserLocation from '../components/GetUserLocation.jsx'
import { getDistance } from 'geolib';
import DayPicker from '../components/DayPicker.jsx'
import Logo from '../components/Logo.jsx'
import SanitizedHtml from '../components/SanitzedHtml'
import LocationModal from '../components/Modal.jsx'

export default function Home(){
    const navigate = useNavigate();
    const [deals, setDeals] = useState([])
    const [selectedTypes, setSelectedTypes] = useState(["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"])
    const types = ["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"]
    const [userLocation, setUserLocation] = useState(null);
    const todayIndex = new Date().getDay();
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = daysOfWeek[todayIndex];
    const [selectedDay, setSelectedDay] = useState({ day: today, index: 0 })
    const [loading, setLoading] = useState(null)
    const [limit, setLimit] = useState(5)
    const [latlng, setLatlng] = useState({ lat: 49.28204, lng: -123.1171})
    

    useEffect(() => {
        if (selectedTypes.length > 0){

            setLoading(true)
            const typesQuery = selectedTypes.join(',');
            const { day, index } = selectedDay;
            const locationQuery = `${latlng.lng}, ${latlng.lat}`

            fetch(`http://localhost:3000/deal/todays?types=${typesQuery}&location=${locationQuery}&day=${day}&index=${index}&limit=${limit}`)
            .then((response) => response.json())
            .then((data) => {
                setDeals(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
            });
        } else {
            setDeals([]);
        }

    }, [selectedTypes, userLocation, selectedDay, limit, latlng.lng, latlng.lat]);

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
        const lnglat = [latlng.lng, latlng.lat];
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
        <div className="flex flex-col items-center px-10 py-2">
            <Logo />
            <LocationModal latlng={latlng} setLatlng={setLatlng}/>
            <DayPicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} daysOfWeek={daysOfWeek}/>
            <div className="py-2">
                <ul className="flex gap-2 py-2">
                    {types.map((type, index) => (
                        <li key={index}>
                            <label className="mr-1 text-sm">{type}</label>
                            <input 
                                type="checkbox"
                                name="type"
                                checked={checkedInput(type)}
                                onChange={()=>handleCheck(type)}
                            >
                            </input>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="">
                {loading ? 
                    <div className="text-center">Finding amazing deals...</div>
                    :
                    <div className="flex flex-col items-center space-y-4">
                        {deals.length > 0 && deals.map((deal) => (
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
                    ))}
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