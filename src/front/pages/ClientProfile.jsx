import React, { useEffect, useState } from "react";

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${BACKEND}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClient(data));
  }, []);

  if (!client) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>Mi Perfil</h4>
        </div>
        <div className="card-body">
          <p><b>Nombre:</b> {client.name}</p>
          <p><b>Email:</b> {client.email}</p>
          <p><b>Altura:</b> {client.altura} cm</p>
          <p><b>Peso:</b> {client.peso} kg</p>
          <p><b>Rutina:</b> {client.rutina}</p>
          <p><b>Estado:</b> {client.estado}</p>
          <p><b>Observaciones:</b></p>
          <p>{client.observaciones || "Sin observaciones"}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
