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
            {exercises.map((ele, idx) => {
               const instrModalId = `staticBackdrop-${idx}`;
               const safetyModalId = `staticBackdrop2-${idx}`;
               const instrLabelId = `staticBackdropLabel-${idx}`;
               const safetyLabelId = `staticBackdropLabel2-${idx}`;
               return (
                  <div className="card" style={{ width: "30rem" }} key={ele.id || ele.uid || ele.name}>
                     <div className="card-body">
                        <h5 className="card-title">{ele.name}</h5>
                        <ul className="list-group list-group-flush">
                           <li className="list-group-item">Tipo: {ele.type}</li>
                           <li className="list-group-item">Musculo que trabaja: {ele.muscle}</li>
                           <li className="list-group-item">Dificultad: {ele.difficulty}</li>
                        </ul>

                        {/* Button trigger modal */}
                        <button
                           type="button"
                           className="btn btn-primary"
                           data-bs-toggle="modal"
                           data-bs-target={`#${instrModalId}`}
                        >
                           Instrucciones
                        </button>
                        <button
                           type="button"
                           className="btn btn-primary"
                           data-bs-toggle="modal"
                           data-bs-target={`#${safetyModalId}`}
                        >
                           Info de seguridad
                        </button>

                        {/* Modal */}
                        <div
                           className="modal fade"
                           id={instrModalId}
                           data-bs-backdrop="static"
                           data-bs-keyboard="false"
                           tabIndex={-1}
                           aria-labelledby={instrLabelId}
                           aria-hidden="true"
                        >
                           <div className="modal-dialog">
                              <div className="modal-content">
                                 <div className="modal-header">
                                    <h1 className="modal-title fs-5" id={instrLabelId}>Instrucciones</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                 </div>
                                 <div className="modal-body">
                                    {ele.instructions}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div
                           className="modal fade"
                           id={safetyModalId}
                           data-bs-backdrop="static"
                           data-bs-keyboard="false"
                           tabIndex={-1}
                           aria-labelledby={safetyLabelId}
                           aria-hidden="true"
                        >
                           <div className="modal-dialog">
                              <div className="modal-content">
                                 <div className="modal-header">
                                    <h1 className="modal-title fs-5" id={safetyLabelId}>Info de seguridad</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                 </div>
                                 <div className="modal-body">
                                    {ele.safety_info}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}

         </div>
      </div>
   );
};

export default Admin;