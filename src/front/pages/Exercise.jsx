import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Exercise.css";
const Exercise = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;


  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalType, setModalType] = useState("instructions"); // 'instructions'
  useEffect(() => {
    const getExercises = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/exercises`);
        const data = await res.json();
        const exercises = Array.isArray(data) ? data : data.results || [];
        dispatch({ type: "data_exercises", payload: exercises });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getExercises();
  }, [dispatch]);

  // limpieza de seguridad
  useEffect(() => {
    return () => {
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((bd) => bd.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);
  const exercises = store?.data_exercises || [];
  const handleOpenModal = (exercise, type) => {
    setSelectedExercise(exercise);
    setModalType(type);
  };
  return (
    <section className="exercise-wrapper">
      <div className="exercise-container">
        <h2 className="exercise-title">Ejercicios</h2>
        {loading && <p className="exercise-loading">Cargando ejercicios...</p>}
        <div className="exercise-grid">
          {exercises.map((ex, i) => (
            <div className="exercise-card" key={i}>
              <h4>{ex.name}</h4>
              <ul>
                <li>
                  <span>Tipo:</span> {ex.type}
                </li>
                <li>
                  <span>Músculo:</span> {ex.muscle}
                </li>
                <li>
                  <span>Dificultad:</span> {ex.difficulty}
                </li>
              </ul>
              <div className="exercise-actions">
                <button
                  className="btn-neon"
                  data-bs-toggle="modal"
                  data-bs-target="#exerciseModal"
                  onClick={() => handleOpenModal(ex, "instructions")}
                >
                  Instrucciones
                </button>
                <button
                  className="btn-outline"
                  data-bs-toggle="modal"
                  data-bs-target="#exerciseModal"
                  onClick={() => handleOpenModal(ex, "safety")}
                >
                  Seguridad
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="modal fade"
        id="exerciseModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content dark-modal">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedExercise
                  ? modalType === "instructions"
                    ? "Instrucciones"
                    : "Info de seguridad"
                  : "Cargando..."}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedExercise ? (
                modalType === "instructions" ? (
                  <p>{selectedExercise.instructions}</p>
                ) : (
                  <p>{selectedExercise.safety_info}</p>
                )
              ) : (
                <p>Selecciona un ejercicio...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Exercise;
