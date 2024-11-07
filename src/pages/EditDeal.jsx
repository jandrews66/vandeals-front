import DealForm from '../components/DealForm'
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function EditDeal(){
    const { id } = useParams();
    const [dealData, setDealData] = useState(null)
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const response = await fetch(`http://localhost:3000/deal/${id}`);
                if (!response.ok) throw new Error('Failed to fetch deal');
                const data = await response.json();
                setDealData(data)
            } catch (error){
                console.error(error)
                setError("Failed to load deal data")
            } finally {
                setLoading(false)
            }

        }
        fetchDeal();
    }, [id]);

    const handleUpdate = async (formData) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                console.error('No token found')
                localStorage.removeItem('token')
                navigate('/login')
            }
            const response = await fetch(`http://localhost:3000/deal/${id}/edit`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to update deal');

            const updatedDeal = await response.json();
            setDealData(updatedDeal);
            setSuccessMessage('Deal updated successfully!');
            setError(null);  // Clear any previous error
            setTimeout(() => setSuccessMessage(null), 3000);  // Hide after 3 seconds
        } catch (error) {
            console.error(error)
            setError('Failed to update deal')
            setSuccessMessage(null)
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <DealForm onSubmit={handleUpdate} initialData={dealData} />
            {successMessage && (
                <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </p>
            )}
        </div>
    );
}