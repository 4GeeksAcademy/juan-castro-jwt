import React, { useEffect, useState } from "react";
import ClientDetailForm from "./ClientDetailForm.jsx";


const Trainer = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveMessage, setSaveMessage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const BACKEND =
    import.meta && import.meta.env && import.meta.env.VITE_BACKEND_URL
      ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")
      : "";
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = () => {
    const token = localStorage.getItem("token");
    const url = BACKEND ? `${BACKEND}/api/clients` : "/api/clients";
    setLoading(true);
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar clientes o no autorizado");
        }
        return res.json();
      })
      .then((data) => {
        setClients(Array.isArray(data) ? data : data.clients || []);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsCreating(false); // Cancelar creación si selecciona uno
    setSaveMessage(null);
  };
  const handleCreateClient = () => {
    setSelectedClient(null); // Deseleccionar
    setIsCreating(true);
    setSaveMessage(null);
  };
  const handleCancelCreate = () => {
    setIsCreating(false);
  };
  const handleSaveClientData = (formData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSaveMessage({
        type: "danger",
        text: "Debes iniciar sesión para guardar cambios",
      });
      return;
    }
    // Determinar URL y método
    let url, method;
    if (isCreating) {
      url = BACKEND ? `${BACKEND}/api/clients` : `/api/clients`;
      method = "POST";
    } else {
      if (!selectedClient) return;
      url = BACKEND
        ? `${BACKEND}/api/clients/${selectedClient.id}`
        : `/api/clients/${selectedClient.id}`;
      method = "PUT";
    }
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            throw new Error(errData.msg || "Error al guardar cliente");
          });
        }
        return res.json();
      })
      .then((updated) => {
        if (isCreating) {

          // Añadir a lista
          setClients((prev) => [...prev, updated]);
          setIsCreating(false);
          setSelectedClient(updated); // Seleccionar el nuevo
          setSaveMessage({
            type: "success",
            text: "✓ Cliente creado correctamente",
          });
        } else {

          // Actualizar lista
          setClients((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
          setSelectedClient(updated);
          setSaveMessage({
            type: "success",
            text: "✓ Datos actualizados correctamente",
          });
        }
        setTimeout(() => setSaveMessage(null), 3000);
      })
      .catch((err) => {
        console.error(err);
        setSaveMessage({
          type: "danger",
          text: err.message || "Error al guardar los datos",
        });
      });
  };
  // Filtrar clientes por búsqueda
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading && clients.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando clientes...</p>
      </div>
    );
  }
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Panel izquierdo - Lista de clientes */}
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-people-fill me-2"></i>
                Mis Clientes
              </h5>
              <button
                className="btn btn-sm btn-light text-primary fw-bold"
                onClick={handleCreateClient}
                title="Añadir nuevo cliente"
              >
                <i className="bi bi-plus-lg"></i>
              </button>
            </div>
            <div
              className="card-body p-0 d-flex flex-column"
              style={{ height: "80vh" }}
            >
              {/* Barra de búsqueda */}
              <div className="p-3 border-bottom">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Error message */}
              {error && (
                <div
                  className="alert alert-warning m-2 text-center"
                  style={{ fontSize: "0.8rem" }}
                >
                  {error.includes("no autorizado")
                    ? "Inicia sesión para ver clientes"
                    : error}
                </div>
              )}
              {/* Lista de clientes  */}
              <div
                className="list-group list-group-flush flex-grow-1"
                style={{ overflowY: "auto" }}
              >
                {filteredClients.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <p className="mt-2">No hay clientes</p>
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <button
                      key={client.id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedClient?.id === client.id ? "active" : ""
                        }`}
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "18px",
                          }}
                        >
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-start">
                          <div className="fw-bold">{client.name}</div>
                          <small
                            className={
                              selectedClient?.id === client.id
                                ? "text-white-50"
                                : "text-muted"
                            }
                          >
                            {client.email}
                          </small>
                        </div>
                      </div>
                      {selectedClient?.id === client.id && (
                        <i className="bi bi-chevron-right"></i>
                      )}
                    </button>
                  ))
                )}
              </div>
              {/* Botón flotante grande en móvil o fijo abajo */}
              <div className="p-2 border-top bg-light">
                <button
                  className="btn btn-success w-100"
                  onClick={handleCreateClient}
                >
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Añadir Cliente
                </button>
              </div>
            </div>
            <div className="card-footer text-muted text-center">
              <small>
                {filteredClients.length} cliente
                {filteredClients.length !== 1 ? "s" : ""}
              </small>
            </div>
          </div>
        </div>
        {/* Panel derecho - Detalles del cliente */}
        <div className="col-md-8 col-lg-9">
          {saveMessage && (
            <div
              className={`alert alert-${saveMessage.type} alert-dismissible fade show`}
              role="alert"
            >
              {saveMessage.text}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSaveMessage(null)}
              ></button>
            </div>
          )}
          <ClientDetailForm
            client={selectedClient}
            onSave={handleSaveClientData}
            isCreating={isCreating}
            onCancelCreate={handleCancelCreate}
          />
        </div>
      </div>
    </div>
  );
};
export default Trainer;
