import React, { useEffect, useState } from "react";
import "./ClientProfile.css";

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

  if (!client) return <p className="profile-loading">Cargando...</p>;

  return (
    <section className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Mi Perfil</h2>

        <div className="profile-info">
          <p><span>Nombre:</span> {client.name}</p>
          <p><span>Email:</span> {client.email}</p>
          <p><span>Altura:</span> {client.altura} cm</p>
          <p><span>Peso:</span> {client.peso} kg</p>
          <p><span>Rutina:</span> {client.rutina}</p>
          <p><span>Estado:</span> {client.estado}</p>

          <div className="profile-observations">
            <span>Observaciones:</span>
            <p>{client.observaciones || "Sin observaciones"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientProfile;
