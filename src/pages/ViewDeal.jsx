import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import SanitizedHtml from '../components/SanitzedHtml'

export default function ViewDeal(){
    const { id } = useParams();
    const [deal, setDeal] = useState(null); 
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/deal/${id}`, {
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

    return (  
        <>

        {deal && (
            <div className="max-w-xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="my-2 py-1 px-2 border-2 rounded border-gray-700 bg-teal-500 hover:bg-pink-400 text-gray-800 text-xs font-semibold" 
                    >
                    Go Back
                </button>
                <div className=" bg-gray-50 shadow-md rounded p-6 border-2  border-gray-700">

                <div className="flex items-center justify-between">
                    <div className="text-xl text-gray-800">{deal.restaurant}</div>
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
                <div className="description-content text-base text-gray-800 list-disc list-inside">
                    <SanitizedHtml htmlContent={deal.description} />
                </div>
                <hr className="my-4"></hr>
                <div className="text-sm font-medium text-gray-700">
                    <span className="text-gray-500 font-normal">Available on:</span> 
                    <p>{deal.days.join(', ')}</p>
                </div>
        
                {deal.time_periods.length > 0 && (
                    <div className="pt-2 text-sm  text-gray-500">
                    Valid from:
                    {deal.time_periods.map((period, index) => (
                        <div key={index}>
                            <div className="font-medium text-gray-700">{period.start} to {period.end}</div>
                        </div>
                    ))}
                    </div>
                )}
        

                <div className="text-sm font-medium text-gray-500">
                    {deal.end_date ? (
                        <span className="text-gray-700">
                        Deal ends on {format(new Date(deal.end_date), 'dd MMM yyyy')}
                        </span>
                    ) : (
                        ''
                    )}
                </div>
                <div className="pt-4 text-xs text-gray-600">
                        Terms and conditions apply. Contact restaurant for details 
                </div>
                </div>
            </div>
        )}
      </>
      
        )
}