import React, { useState, useEffect } from "react";
import "./Trainer.css";

const Trainer = () => {
    const [trainers, setTrainers] = useState([]);
    const [error, setError] = useState(null);

    const BACKEND = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${BACKEND}/api/users`)
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar entrenadores");
                return res.json();
            })
            .then((data) => {
                const onlyTrainers = data.filter(user => user.role === "trainer");
                setTrainers(onlyTrainers);
            })
            .catch((err) => setError(err.message));
    }, [BACKEND]);

    return (
        <div className="admin-wrapper">
            <div className="admin-container">
                <h2 className="text-center mb-5">Gestión de Entrenadores</h2>

                <div className="trainer-layout">
                    {/* ASIDE: LISTA DE ENTRENADORES */}
                    <aside className="trainer-sidebar">
                        <h4>Entrenadores Activos</h4>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="trainer-list">
                            {trainers.map((t) => (
                                <div key={t.id} className="trainer-item-card">
                                    <p className="mb-0"><strong>{t.name}</strong></p>
                                    <small>{t.email}</small>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* CONTENIDO PRINCIPAL / FORMULARIO */}
                    <div className="trainer-content">
                        <div className="admin-card">
                            <h4>Asignar Nueva Rutina</h4>
                            <p className="text-muted">Selecciona un entrenador para ver sus detalles o asignar tareas.</p>
                            
                            <form className="mt-4">
                                <div className="mb-3">
                                    <label className="form-label">Entrenador Responsable</label>
                                    <select className="form-select">
                                        <option value="">Selecciona un entrenador...</option>
                                        {trainers.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Notas o Instrucciones</label>
                                    <textarea className="form-control" rows="4" placeholder="Escribe las instrucciones aquí..."></textarea>
                                </div>
                                <button type="button" className="btn btn-success w-100">
                                    Guardar Asignación
                                </button>
                            </form>
                        </div>
                    </div>
                </div> 
            </div> 
        </div> 
    );
};

export default Trainer;