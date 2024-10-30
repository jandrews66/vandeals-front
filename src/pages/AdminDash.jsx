import { useEffect, useState, useRef } from 'react';

export default function AdminDash() {
    const [deals, setDeals] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState('')
    useEffect(() => {
        fetch(`http://localhost:3000/deal/`, {
            mode: 'cors',
            dataType: 'json',
    })
        .then((response) => response.json())
        .then((data) => setDeals(data))
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const toggleModal = (id) => {
        setIsModalOpen(!isModalOpen);
        setIdToDelete(id)
      };
    
    const handleDelete = () => {
        fetch(`http://localhost:3000/deal/${idToDelete}/delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              // Remove the deleted deal from the state
              setDeals((prevDeals) => prevDeals.filter(deal => deal._id !== idToDelete));
              setIsModalOpen(false); 
            })
            .catch((error) => {
              console.error('Error deleting deal:', error);
            });
    }
    return (
    <div className="max-w-4xl mx-auto p-2">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>

      <table className="w-full table-auto border-collapse border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border border-gray-300 px-4 py-1">ID</th>
            <th className="border border-gray-300 px-4 py-1">Restaurant</th>
            <th className="border border-gray-300 px-4 py-1">Deal Name</th>
            <th className="border border-gray-300 px-4 py-1">Actions</th>
          </tr>
        </thead>

        <tbody>
          {deals.length > 0 ? (
            deals.map((deal) => (
              <tr key={deal._id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-1 whitespace-nowrap">{deal._id}</td>
                <td className="border border-gray-300 px-4 py-1 whitespace-nowrap">{deal.restaurant}</td>
                <td className="border border-gray-300 px-4 py-1 whitespace-nowrap">{deal.name}</td>
                <td className="border border-gray-300 px-4 py-1 flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    Edit
                  </button>
                  <button 
                    className="bg-red-500 text-white px-3 py-1 rounded-md "
                    onClick={()=>toggleModal(deal._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No deals available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p>Are you sure you want to delete this deal?</p>
                <p>{idToDelete}</p>
                <div className="flex space-x-4 mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDelete}>Confirm</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={()=>toggleModal(null)}>Cancel</button>
                </div>
            </div>
        </div>
    )}

    </div>
  );
}