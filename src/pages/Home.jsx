import { useEffect, useState } from 'react'
import GetUserLocation from '../components/GetUserLocation.jsx'
import { getDistance } from 'geolib';
import DayPicker from '../components/DayPicker.jsx'

export default function Home(){
    const [deals, setDeals] = useState([])
    const [selectedTypes, setSelectedTypes] = useState(["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"])
    const types = ["All-Day", "Happy-Hour", "Brunch", "Lunch", "Dinner"]
    const [userLocation, setUserLocation] = useState();

    const todayIndex = new Date().getDay();
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const today = daysOfWeek[todayIndex];
    const [selectedDay, setSelectedDay] = useState({ day: today, index: 0 })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        GetUserLocation(setUserLocation);
    }, []);

    useEffect(() => {
        if (selectedTypes.length > 0 && userLocation){
            const typesQuery = selectedTypes.join(',');
            const { day, index } = selectedDay;
            setLoading(true)
            fetch(`http://localhost:3000/deal/todays?types=${typesQuery}&location=${userLocation}&day=${day}&index=${index}`)
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
        }
        return 'Calcuating...'; // Return something while waiting for userLocation
    }



    return (
        <>
        <div className="flex flex-col items-center px-10 py-4">
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