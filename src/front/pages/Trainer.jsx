import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Trainer.css";

const Trainer = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        altura: "",
        peso: "",
        observaciones: "",
        estado: ""
    });

    const BACKEND = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, [BACKEND]);

    const fetchClients = () => {
        fetch(`${BACKEND}/api/users`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar clientes");
                return res.json();
            })
            .then((data) => {
                const onlyClients = data.filter(user => user.role === "client");
                setClients(onlyClients);
            })
            .catch((err) => setError(err.message));
    };

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setFormData({
            name: client.name || "",
            email: client.email || "",
            altura: client.altura || "",
            peso: client.peso || "",
            observaciones: client.observaciones || "",
            estado: client.estado || ""
        });
        setEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateClient = async () => {
        if (!selectedClient) return;

        try {
            const updateData = {
                ...formData,
                role: selectedClient.role  // Preservar el role original
            };

            const response = await fetch(`${BACKEND}/api/users/${selectedClient.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cliente actualizado correctamente");
                setEditMode(false);
                fetchClients();
                const updatedClient = { ...selectedClient, ...formData };
                setSelectedClient(updatedClient);
            } else {
                console.error("Error del servidor:", data);
                alert(`Error al actualizar cliente: ${data.msg || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert(`Error al actualizar cliente: ${error.message}`);
        }
    };

    const handleAssignExercise = () => {
        if (selectedClient) {
            navigate('/ejercicios', { state: { selectedClient } });
        } else {
            alert("Por favor selecciona un cliente primero");
        }
    };

    return (
        <div className="admin-wrapper">
            <div className="admin-container">
                <h2 className="text-center mb-5">Gestión de Clientes</h2>

                <div className="trainer-layout">
                    {/* ASIDE: LISTA DE CLIENTES */}
                    <aside className="trainer-sidebar">
                        <h4>Clientes Activos</h4>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="trainer-list">
                            {clients.map((client) => (
                                <div
                                    key={client.id}
                                    className={`trainer-item-card ${selectedClient?.id === client.id ? 'active' : ''}`}
                                    onClick={() => handleSelectClient(client)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <p className="mb-0"><strong>{client.name}</strong></p>
                                    <small>{client.email}</small>
                                    <small className={`d-block mt-1 ${client.estado === 'Activo' ? 'text-success' : 'text-danger'}`}>
                                        {client.estado || 'Sin estado'}
                                    </small>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* CONTENIDO PRINCIPAL / FORMULARIO */}
                    <div className="trainer-content">
                        <div className="admin-card">
                            {!selectedClient ? (
                                <>
                                    <h4>Selecciona un Cliente</h4>
                                    <p className="text-muted">Haz clic en un cliente de la lista para ver sus detalles y gestionar sus ejercicios.</p>
                                </>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4>Detalles de {selectedClient.name}</h4>
                                        <div>
                                            {!editMode ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary me-2"
                                                    onClick={() => setEditMode(true)}
                                                >
                                                    Editar
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success me-2"
                                                        onClick={handleUpdateClient}
                                                    >
                                                        Guardar Cambios
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary me-2"
                                                        onClick={() => {
                                                            setEditMode(false);
                                                            handleSelectClient(selectedClient);
                                                        }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-warning"
                                                onClick={handleAssignExercise}
                                            >
                                                Asignar Ejercicio
                                            </button>
                                        </div>
                                    </div>

                                    <form className="mt-4">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Nombre</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Altura (cm)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="altura"
                                                    value={formData.altura}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Peso (kg)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="peso"
                                                    value={formData.peso}
                                                    onChange={handleInputChange}
                                                    disabled={!editMode}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                            >
                                                <option value="">Selecciona estado...</option>
                                                <option value="Activo">Activo</option>
                                                <option value="Desactivado">Desactivado</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Observaciones</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                name="observaciones"
                                                value={formData.observaciones}
                                                onChange={handleInputChange}
                                                disabled={!editMode}
                                                placeholder="Notas sobre el cliente..."
                                            />
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trainer;