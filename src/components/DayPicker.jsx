export default function DayPicker({selectedDay, setSelectedDay, daysOfWeek}){

    function handleClick(day, i){
        setSelectedDay(day)
        console.log(i)
    }
    return(
        <>  
            {selectedDay}
            <ul className="flex">
                {daysOfWeek.map((day, i) => (
                    <li 
                    key={i}
                    className={`hover:cursor-pointer border p-1 ${selectedDay === day ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => handleClick(day, i)}
                    >
                        {day.substring(0,3)}
                    </li>
                ))}
            </ul>

        </>
    )
}