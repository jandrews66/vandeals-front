import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function ViewDeal(){
    const { id } = useParams();
    const [deal, setDeal] = useState(null); 

    useEffect(() => {
        fetch(`http://localhost:3000/deal/${id}`, {
            mode: 'cors',
            dataType: 'json'
        })
        .then((response) => response.json())
        .then((data) => {
            setDeal(data)
            console.log(data)
        })
        .catch((error) => {
            console.error(error)
        });
    }, [id]);

    function handleDirections(){
        const sanitizedName = deal.restaurant.replace(/[^a-zA-Z0-9\s]/g, '').trim(); // Keeps only alphanumeric characters and spaces

        window.open(`https://maps.google.com?q=${sanitizedName}, ${deal.address}` );
    }

    function handleExpired(){
        
    }
    return (  
        <>
        {deal && (
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div className="text-xl text-gray-800">{deal.restaurant}</div>
            
                    <div 
                        className="text-xs font-medium text-red-600 cursor-pointer hover:underline"
                        onClick={handleExpired}
                        >
                        Something wrong?
                    </div>
                </div>
                <div>
                    <div
                        className="py-2 text-sm text-blue-600 cursor-pointer hover:underline"
                        onClick={handleDirections}
                    >
                    Get Directions
                    </div>  
                </div>
                <hr></hr>
                <div className="py-4 text-xl font-semibold text-emerald-600">{deal.name}</div>
                <div className="pb-8 text-base text-gray-800 leading-relaxed">{deal.description}</div>
                <div className="pt-2 text-sm font-medium text-gray-600">
                    Time Periods:
                    {deal.time_periods.length > 0 && 
                        deal.time_periods.map((period, index) => (
                            <div key={index}>
                                <div className="text-gray-800">{period.start} to {period.end}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="pt-2 text-sm font-medium text-gray-600">
                    <span className="text-gray-800">Type:</span> {deal.type}
                </div>
        
                <div className="text-sm font-medium text-gray-600">
                    <span className="text-gray-800">Days:</span> {deal.days.join(', ')}
                </div>
        
                <div className="text-sm font-medium text-gray-600">
                {deal.end_date ? (
                    <span className="text-gray-800">
                    Deal ends on {format(new Date(deal.end_date), 'dd MMM yyyy')}
                    </span>
                ) : (
                    'No end date specified'
                )}

                <div className="pt-4 text-xs font-medium text-gray-600">
                <span className="text-gray-800">Terms and conditions apply. Contact restaurant for details.</span>
                </div>
                </div>
            </div>
        )}
      </>
      
        )
}