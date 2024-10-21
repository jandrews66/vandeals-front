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

    useEffect(() => {
        GetUserLocation(setUserLocation);
    }, []);

    useEffect(() => {
        if (selectedTypes.length > 0 && userLocation){
            const typesQuery = selectedTypes.join(',');
            const { day, index } = selectedDay;

            fetch(`http://localhost:3000/deal/todays?types=${typesQuery}&location=${userLocation}&day=${day}&index=${index}`)
            .then((response) => response.json())
            .then((data) => {
                setDeals(data)
                console.log(data)
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
        <div>
            <DayPicker selectedDay={selectedDay} setSelectedDay={setSelectedDay} daysOfWeek={daysOfWeek}/>
        </div>
        <div>
            <ul>
                {types.map((type, index) => (
                    <li key={index}>
                        <input 
                            type="checkbox"
                            name="type"
                            checked={checkedInput(type)}
                            onChange={()=>handleCheck(type)}
                        >
                        </input>
                        <label>{type}</label>
                    </li>
                ))}
            </ul>
        </div>

        <div className="space-y-4">
            {deals.length > 0 && deals.map((deal) => (
                <ul key={deal._id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <li className="font-semibold text-lg text-emerald-600">{deal.name}</li>
                    <li className="font-semibold text-emerald-600">{deal.restaurant}</li>
                    <li className="text-sm text-gray-600">Type: {deal.type}</li>
                    <li className="text-sm text-gray-600">Description: {deal.description}</li>
                    <li className="text-sm text-gray-600">Days: {deal.days.join(', ')}</li>
                    <li className="text-sm text-gray-600">Distance: {calcDistance(deal.location.coordinates)}</li>

                </ul>
            ))}
        </div>
        </>

    )
}