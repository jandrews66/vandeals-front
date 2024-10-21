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
            <ul className="flex">
                {orderedDays.map((day, i) => (
                    <li 
                    key={i}
                    className={`hover:cursor-pointer border p-1 flex items-center justify-center w-10 text-sm ${selectedDay.day === day ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => handleClick(day, i)}
                    >
                        {day.substring(0,3)}
                    </li>
                ))}
            </ul>

        </>
    )
}