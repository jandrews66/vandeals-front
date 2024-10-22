import { useEffect, useState } from 'react'
import GetUserLocation from '../components/GetUserLocation.jsx'
import { getDistance } from 'geolib';
import DayPicker from '../components/DayPicker.jsx'

export default function Home(){
    const [deals, setDeals] = useState([])
    const [selectedTypes, setSelectedTypes] = useState(["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"])
    const types = ["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"]
    const [userLocation, setUserLocation] = useState(null);

    const todayIndex = new Date().getDay();
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = daysOfWeek[todayIndex];
    const [selectedDay, setSelectedDay] = useState({ day: today, index: 0 })
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        GetUserLocation(setUserLocation);
    }, []);

    useEffect(() => {
        if (selectedTypes.length > 0){

            setLoading(true)

            const typesQuery = selectedTypes.join(',');
            const { day, index } = selectedDay;

            const locationQuery = userLocation
            ? `&location=${userLocation}` 
            : '';

            fetch(`http://localhost:3000/deal/todays?types=${typesQuery}${locationQuery}&day=${day}&index=${index}`)
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

    }, [selectedTypes, userLocation, selectedDay]);

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
        if (userLocation) {
            const result = getDistance(userLocation, dealCoords);
            const resultKms = (result / 1000).toFixed(1); 

            return `${resultKms} km away`; // Add units for better readability
        } else {
            return '? km away'
        }   
    }



    return (
        <>
        <div className="flex flex-col items-center px-10 py-2">
        <div className="text-center my-10">
            <div className="text-6xl font-black tracking-tighter uppercase 
                text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 
                drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rubik', sans-serif" }}>
                VANCOUVER
            </div>
            <div className="text-6xl font-black tracking-tighter uppercase 
                text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 
                drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rubik', sans-serif" }}>
                RESTAURANT
            </div>
            <div className="text-6xl font-black tracking-tighter uppercase 
                text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 
                drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                style={{ fontFamily: "'Rubik', sans-serif" }}>
                DEALS
            </div>
        </div>
            <div>
                <DayPicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} daysOfWeek={daysOfWeek}/>
            </div>
            <div>
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
                        <div key={deal._id} className="flex flex-col p-4 bg-gray-100 w-full rounded-lg shadow-md">
                            <div className="flex gap-12 justify-between">
                                <div className="font-semibold text-emerald-600">{deal.restaurant}</div>
                                <div className="text-sm text-right text-gray-600">{calcDistance(deal.location.coordinates)}</div>

                            </div>

                            <div className="font-semibold text-gray-600">{deal.name}</div>
                            <div className="p-2 text-sm text-gray-600">{deal.description}</div>

                        </div>
                    ))}
                    </div>
                }
            </div>

        </div>
       

        </>

    )
}