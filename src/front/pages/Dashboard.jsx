import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Dashboard.css";


const Dashboard = () => {

    const { store, dispatch } = useGlobalReducer()
    const [user, setUser] = useState(null)
    const [exercises, setExercises] = useState([])
    const [loading, setLoading] = useState(true)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const BACKEND = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const getRestricted = async () => {
            try {
                const response = await fetch(`${BACKEND}/api/user/profile`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                })
                let data = await response.json()
                if (data) {
                    console.log("ESTA ES LA DATA", data)
                    setUser(data)
                    // Mostrar modal si la suscripción está desactivada
                    if (data.estado === "Desactivado") {
                        setShowPaymentModal(true)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }
        getRestricted()
    }, [BACKEND])

    useEffect(() => {
        const getMyExercises = async () => {
            try {
                const response = await fetch(`${BACKEND}/api/my-exercises`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    setExercises(Array.isArray(data) ? data : [])
                }
            } catch (error) {
                console.error("Error fetching exercises:", error)
            } finally {
                setLoading(false)
            }
        }
        getMyExercises()
    }, [BACKEND])

    return (
  <section className="dashboard-wrapper">
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Bienvenido: {store.current_user?.name || user?.name}
      </h1>

      {/* modal de suscripción  */}
      {showPaymentModal && (
        <div className="dashboard-modal-overlay">
          <div className="dashboard-modal">
            <h3>Suscripción Impaga</h3>
            <p>Tu suscripción ha expirado o está impaga.</p>
            <p>Para continuar usando la plataforma, realiza el pago.</p>

            <div className="dashboard-modal-actions">
              <button
                className="btn-outline"
                onClick={() => setShowPaymentModal(false)}
              >
                Cerrar
              </button>
              <a
                href="https://www.mercadopago.com.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon"
              >
                Ir a Mercado Pago
              </a>
            </div>
          </div>
        </div>
      )}

     {/* ejercicios */}
      <div className="dashboard-section">
        <h3 className="section-title">Mis Ejercicios Asignados</h3>

        {loading ? (
          <p className="dashboard-loading">Cargando ejercicios...</p>
        ) : exercises.length === 0 ? (
          <p className="dashboard-empty">
            No tienes ejercicios asignados aún.
          </p>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map(exercise => (
                  <tr key={exercise.id}>
                    <td>{exercise.exercise_name}</td>
                    <td>
                      <button className="btn-outline btn-sm">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  </section>
);

}

export default Dashboard;