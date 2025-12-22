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
import QuinesSomos from "./pages/QuienesSomos.jsx";
import Contactanos from "./pages/Contactanos.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx"; // De tu rama
import Trainer from "./pages/Trainer.jsx";               // De develop

export const router = createBrowserRouter(
    createRoutesFromElements(
        // Root Route: All navigation will start from here.
        <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

            {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />   {/* Tu ruta */}
            <Route path="/single/:theId" element={<Single />} />  
            <Route path="/demo" element={<Demo />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/quienes" element={<QuinesSomos />} />
            <Route path="/trainer" element={<Trainer />} />       {/* Ruta de develop */}
        </Route>
    )
);