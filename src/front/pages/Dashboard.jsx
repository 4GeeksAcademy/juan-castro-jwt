import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


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
        <div>
            <h1>Dashboard</h1>
            <h2>Bienvenido: {store.current_user?.name || user?.name}</h2>

            {/* Modal de suscripción impaga */}
            {showPaymentModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">⚠️ Suscripción Impaga</h5>
                            </div>
                            <div className="modal-body">
                                <p>Tu suscripción ha expirado o está impaga.</p>
                                <p>Para continuar usando nuestros servicios, por favor realiza el pago.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cerrar
                                </button>
                                <a
                                    href="https://www.mercadopago.com.ar"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-success"
                                >
                                    💳 Ir a Mercado Pago
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sección de ejercicios asignados */}
            <div className="mt-5">
                <h3>Mis Ejercicios Asignados</h3>
                {loading ? (
                    <p>Cargando ejercicios...</p>
                ) : exercises.length === 0 ? (
                    <p className="alert alert-info">No tienes ejercicios asignados aún.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre del Ejercicio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercises.map(exercise => (
                                    <tr key={exercise.id}>
                                        <td>{exercise.exercise_name}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm">Ver Detalles</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;