import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Exercise.css";
const Exercise = () => {
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
  <section className="exercise-wrapper">
    <div className="exercise-container">

      <h1 className="exercise-title text-center">Ejercicios</h1>     

      {loading && <p className="exercise-loading">Cargando ejercicios...</p>}
      {!loading && exercises.length === 0 && (
        <p className="exercise-loading">No hay ejercicios cargados.</p>
      )}

      <div className="exercise-grid">
        {exercises.map((ele, idx) => {
          const instrModalId = `staticBackdrop-${idx}`;
          const safetyModalId = `staticBackdrop2-${idx}`;
          const instrLabelId = `staticBackdropLabel-${idx}`;
          const safetyLabelId = `staticBackdropLabel2-${idx}`;

          return (
            <div className="exercise-card" key={ele.id || ele.uid || ele.name}>
              <h4>{ele.name}</h4>

              <ul>
                <li>Tipo: <span>{ele.type}</span></li>
                <li>Músculo: <span>{ele.muscle}</span></li>
                <li>Dificultad: <span>{ele.difficulty}</span></li>
              </ul>

              <div className="exercise-actions">
                <button
                  type="button"
                  className="btn-outline"
                  data-bs-toggle="modal"
                  data-bs-target={`#${instrModalId}`}
                >
                  Instrucciones
                </button>

                <button
                  type="button"
                  className="btn-neon"
                  data-bs-toggle="modal"
                  data-bs-target={`#${safetyModalId}`}
                >
                  Seguridad
                </button>
              </div>

              {/* MODAL INSTRUCCIONES */}
              <div
                className="modal fade"
                id={instrModalId}
                tabIndex={-1}
                aria-labelledby={instrLabelId}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content dark-modal">
                    <div className="modal-header">
                      <h5 className="modal-title" id={instrLabelId}>Instrucciones</h5>
                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
                    </div>
                    <div className="modal-body">
                      {ele.instructions}
                    </div>
                  </div>
                </div>
              </div>

              {/* MODAL SEGURIDAD */}
              <div
                className="modal fade"
                id={safetyModalId}
                tabIndex={-1}
                aria-labelledby={safetyLabelId}
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content dark-modal">
                    <div className="modal-header">
                      <h5 className="modal-title" id={safetyLabelId}>Info de seguridad</h5>
                      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
                    </div>
                    <div className="modal-body">
                      {ele.safety_info}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  </section>
);
};
export default Exercise;
