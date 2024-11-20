import DealForm from '../components/DealForm'
import { useNavigate } from "react-router-dom";

export default function CreateDeal() {
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/deal/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok){
            console.log("Deal created")
            navigate('/')
        } else {
            console.error('Error creating deal')
        }
    };

    return (
    
        <DealForm onSubmit={handleCreate} />

    )
}