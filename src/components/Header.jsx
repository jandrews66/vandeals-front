import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function Header(){
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    function handleLogout(){
        localStorage.removeItem('token')
        navigate('/admin/login')
    }

    return (
        <header className="bg-gray-700 text-white p-4">
            <nav className="flex gap-4">
                <Link to="/">Home</Link>
                <Link to="/create">Add a Deal</Link>

            {token && 
                <div className="ml-auto">
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <button className="ml-4" onClick={handleLogout}>Log Out</button>

                </div>
                }
            </nav>
        </header>
        

    )
}