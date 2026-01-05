import React, { useEffect, useState } from "react";
import ClientDetailForm from "./ClientDetailsForm";

const Trainer = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${BACKEND}/api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setClients(data);
    setLoading(false);
  };

  const handleSave = async (formData) => {
    const token = localStorage.getItem("access_token");

    const url = isCreating
      ? `${BACKEND}/api/users`
      : `${BACKEND}/api/clients/${selectedClient.id}`;

    const method = isCreating ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

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
            onCancelCreate={() => setIsCreating(false)}
          />
        </div>

      </div>
    </div>
  );
};
export default Trainer;
