import React, { useEffect, useState } from "react";
import ClientDetailForm from "./ClientDetailsForm";

const Trainer = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${BACKEND}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    const clientsOnly = Array.isArray(data) ? data.filter(u => u.role === 'client') : [];
    setClients(clientsOnly);
    setLoading(false);
  };

  const handleSave = async (formData) => {
    const token = localStorage.getItem("access_token");
    setSaving(true);
    setError(null);

    const url = isCreating
      ? `${BACKEND}/api/users`
      : `${BACKEND}/api/users/${selectedClient?.id}`;

    const method = isCreating ? "POST" : "PUT";

    // Al actualizar, combinar los datos existentes del cliente con los
    // cambios del formulario para evitar enviar campos como `name` o `email`
    // con valor `null` y romper restricciones de la BD.
    const payload = isCreating ? formData : { ...(selectedClient || {}), ...formData };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errMsg = `Error ${res.status}`;
        try {
          const errJson = await res.json();
          errMsg = errJson.message || JSON.stringify(errJson);
        } catch (e) {
          const text = await res.text();
          if (text) errMsg = text;
        }
        setError(errMsg);
        setSaving(false);
        return;
      }

      const updated = await res.json();

      if (isCreating) {
        setClients(prev => [...prev, updated]);
      } else {
        setClients(prev =>
          prev.map(c => (c.id === updated.id ? updated : c))
        );
      }

      setSelectedClient(updated);
      setIsCreating(false);
    } catch (err) {
      setError(err.message || 'Error de red');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando clientes...</p>;

  return (
    <div className="container mt-4">
      <div className="row">

        <div className="col-md-4">
          <div className="list-group">
            <button
              className="list-group-item list-group-item-action text-success"
              onClick={() => {
                setSelectedClient(null);
                setIsCreating(true);
              }}
            >
              ➕ Nuevo Cliente
            </button>

            {clients.map(client => (
              <button
                key={client.id}
                className={`list-group-item list-group-item-action ${selectedClient?.id === client.id ? "active" : ""
                  }`}
                onClick={() => {
                  setSelectedClient(client);
                  setIsCreating(false);
                }}
              >
                {client.name}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-8">
          <ClientDetailForm
            client={selectedClient}
            isCreating={isCreating}
            onSave={handleSave}
            saving={saving}
            error={error}
            onCancelCreate={() => setIsCreating(false)}
          />
        </div>

      </div>
    </div>
  );
};
export default Trainer;
