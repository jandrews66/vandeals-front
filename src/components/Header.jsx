import { Link } from 'react-router-dom'

export default function Header(){
    return (
        <header className="bg-gray-700 text-white p-4">
            <nav className="flex gap-2">
                <Link to="/create">Add a Deal</Link>


            </nav>
        </header>

    )
}