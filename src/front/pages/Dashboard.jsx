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
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState(null)
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

    const handleShowDetails = (exercise) => {
        setSelectedExercise(exercise)
        setShowDetailsModal(true)
    }

    const handleCloseDetails = () => {
        setShowDetailsModal(false)
        setSelectedExercise(null)
    }

    return (
        <section className="dashboard-wrapper">
            <div className="dashboard-container">


                {showPaymentModal && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content dark-modal">
                                <div className="modal-header">
                                    <h5 className="modal-title">⚠️ Suscripción Impaga</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowPaymentModal(false)}
                                    />
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
                                        href="https://www.mercadopago.cl"
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

                {/* modal de suscripción duplicado - se puede eliminar */}

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
                                                <button
                                                    className="btn-outline btn-sm"
                                                    onClick={() => handleShowDetails(exercise)}
                                                >
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

                {/* MODAL DETALLES DEL EJERCICIO */}
                {showDetailsModal && selectedExercise && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content dark-modal">
                                <div className="modal-header">
                                    <h5 className="modal-title">📋 {selectedExercise.exercise_name}</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={handleCloseDetails}
                                    />
                                </div>
                                <div className="modal-body">
                                    <div className="mb-4">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <strong>Tipo:</strong> <span className="badge bg-primary">{selectedExercise.type || 'N/A'}</span>
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Músculo:</strong> <span className="badge bg-success">{selectedExercise.muscle || 'N/A'}</span>
                                            </div>
                                            <div className="col-md-4">
                                                <strong>Dificultad:</strong> <span className="badge bg-warning text-dark">{selectedExercise.difficulty || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="text-primary">📝 Instrucciones:</h6>
                                        <p>{selectedExercise.instructions || 'No hay instrucciones disponibles'}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h6 className="text-danger">⚠️ Seguridad y Precauciones:</h6>
                                        <p>{selectedExercise.safety_info || 'No hay información de seguridad disponible'}</p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseDetails}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );

}

export default Dashboard;