// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import QuienesSomos from "./pages/QuienesSomos.jsx";
import Contactanos from "./pages/Contactanos.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx"; 
import Trainer from "./pages/Trainer.jsx";               

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />  
            <Route path="/single/:theId" element={<Single />} />  
            <Route path="/demo" element={<Demo />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/quienes" element={<QuienesSomos />} />
            <Route path="/trainer" element={<Trainer />} />       
        </Route>
    )
);