import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

const Registro = () => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlerRegistro = async () => {
    if (name.length < 2 || email.length < 7 || password.length < 8) {
      alert("Algún dato quedó corto");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/create_user`, {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
        headers: { "Content-Type": "application/json" }
      });

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (response.ok) {
        alert("Usuario creado con éxito");
        navigate("/login");
      } else {
        alert("Error al crear usuario: " + (data.message || response.status));
      }
    } catch (error) {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="registro-container">
      <div className="registro-card">
        <h2 className="registro-title">Registro</h2>

        <div className="registro-group">
          <label>Nombre</label>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="registro-group">
          <label>Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="registro-group">
          <label>Password</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="registro-group">
          <label>Tipo de usuario</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="adm">Administrador</option>
            <option value="trainer">Entrenador</option>
            <option value="client">Cliente</option>
          </select>
        </div>

        <button
          className="btn-neon"
          onClick={handlerRegistro}
          disabled={loading}
        >
          {loading ? <span className="registro-spinner" /> : "Registrar"}
        </button>
      </div>
    </section>
  );
};

export default Registro;
