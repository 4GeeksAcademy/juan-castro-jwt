import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


const Admin = () => {
   const { store, dispatch } = useGlobalReducer();
   const [loading, setLoading] = useState(true);
   const BACKEND = import.meta.env.VITE_BACKEND_URL;
   useEffect(() => {
      const getExercises = async () => {
         try {
            const response = await fetch(`${BACKEND}/api/exercises`);
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // La API devuelve directamente un array; si viene en data.results, usarlo
            const exercises = Array.isArray(data) ? data : data.results || [];
            dispatch({ type: "data_exercises", payload: exercises });
            setLoading(false);
            console.log("STORE:", store)
         } catch (error) {
            console.error("Error data:", error);
            setLoading(false);

         }
      };

      getExercises();
   }, [dispatch]);

   const exercises = store?.data_exercises || [];

   return (
      <div>
         <h1>Ejercicios</h1>
         <h3>Bienvenido</h3>
         {loading && <p>Cargando ejercicios...</p>}
         {!loading && exercises.length === 0 && <p>No hay ejercicios cargados.</p>}

         <div className="cards-container">
            {exercises.map((ele) => (
               <div className="card" style={{ width: "18rem" }} key={ele.id || ele.uid || ele.name}>
                  <div className="card">
                     <h5 className="card-header">{ele.name}</h5>
                     <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                     </div>
                  </div>
                  
                  <img
                     src={ele.gifUrl || ele.image || ele.imageUrl || ""}
                     className="card-img-top"
                     alt={ele.name || "exercise"}
                  />
                  <div className="card-body">
                     <h5 className="card-title">{ele.name}</h5>
                     <p className="card-text">{ele.bodyPart || ele.target || ""}</p>
                  </div>
                  <div className="card">
                     <h5 className="card-header">{ele.name}</h5>
                     <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                     </div>
                  </div>
               </div>               
            ))}
            
         </div>
      </div>
   );
};

export default Admin;