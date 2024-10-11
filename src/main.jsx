import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home.jsx'
import CreateDeal from './pages/CreateDeal.jsx'
import AllDay from './pages/AllDay.jsx'
import Brunch from './pages/Brunch.jsx'
import Lunch from './pages/Lunch.jsx'
import Dinner from './pages/Dinner.jsx'
import HappyHour from './pages/HappyHour.jsx';

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
        path: "/all-day",
        element: <AllDay />,
      },
      {
        path: "/brunch",
        element: <Brunch />,
      },
      {
        path: "/lunch",
        element: <Lunch />,
      },
      {
        path: "/dinner",
        element: <Dinner />,
      },
      {
        path: "/happy-hour",
        element: <HappyHour />,
      },
    ],
  }

]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
