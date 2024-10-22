import { useEffect, useState } from 'react'


export default function DayPicker( {selectedDay, setSelectedDay, daysOfWeek} ){
    const todayIndex = new Date().getDay();

    const orderedDays = [
        ...daysOfWeek.slice(todayIndex),
        ...daysOfWeek.slice(0, todayIndex)
    ]
    
    function handleClick(day, i){
        setSelectedDay({ day: day, index: i })
    }
    return(
        <>  
            <ul className="flex border-2 rounded border-gray-700">
                {orderedDays.map((day, i) => (
                    <li 
                    key={i}
                    className={`hover:cursor-pointer p-1 flex items-center justify-center w-10 text-sm text-gray-700 font-semibold ${selectedDay.day === day ? 'bg-teal-400 hover:bg-blue-400' : 'bg-white hover:bg-pink-400'}`}
                    onClick={() => handleClick(day, i)}
                    >
                        {day.substring(0,3)}
                    </li>
                ))}
            </ul>

        </>
    )
}