import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home.jsx'
import CreateDeal from './pages/CreateDeal.jsx'
import ViewDeal from './pages/ViewDeal.jsx'
import AdminDash from './pages/AdminDash.jsx'
import EditDeal from './pages/EditDeal.jsx'
import Login from './pages/Login.jsx'

import { LocationProvider } from './contexts/LocationContext.jsx'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/create",
        element: <CreateDeal />,
      },
      {
        path: "/deals/:id",
        element: <ViewDeal />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDash />,
      },
      {
        path: "/admin/edit/:id",
        element: <EditDeal />,
      },
      {
        path: "/admin/login",
        element: <Login />,
      },
    ],
  }

]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocationProvider>
      <RouterProvider router={router} />
    </LocationProvider>  
  </StrictMode>,
)
