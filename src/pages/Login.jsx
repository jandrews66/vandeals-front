import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function LoginPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginData = { username, password }

        const response = await fetch (`${import.meta.env.VITE_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token)
            navigate('/admin/dashboard')
        } else {
            console.log("login error: " + data.message)
        }
    }
    return (
        <form className="flex flex-col space-y-4 max-w-sm mx-auto p-4 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
            <div className="m-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
                <input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="m-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                <input 
                    id="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
                >
                    Login
                </button>
            </div>  
        </form>
    )
}