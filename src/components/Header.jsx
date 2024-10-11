import { Link } from 'react-router-dom'

export default function Header(){
    return (
        <header className="bg-gray-700 text-white p-4">
            <nav className="flex gap-2">
                <Link to="/all-day">All Day</Link>
                <Link to="/happy-hour">Happy Hour</Link>
                <Link to="/brunch">Brunch</Link>
                <Link to="/lunch">Lunch</Link>
                <Link to="/dinner">Dinner</Link>

            </nav>
        </header>

    )
}