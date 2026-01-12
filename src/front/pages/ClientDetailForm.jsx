import React, { useEffect, useState } from "react";
import "./ClientDetailForm.css";

const ClientDetailForm = ({
  client,
  isCreating,
  onSave,
  onCancelCreate,
  saving,
  error
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    altura: "",
    peso: "",
    rutina: "",
    observaciones: "",
    estado: "Activo",
  });


  useEffect(() => {
    if (isCreating) {
      setFormData({
        name: "",
        email: "",
        password: "",
        altura: "",
        peso: "",
        rutina: "",
        observaciones: "",
        estado: "Activo",
      });
    } else if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        password: "",
        altura: client.altura || "",
        peso: client.peso || "",
        rutina: client.rutina || "",
        observaciones: client.observaciones || "",
        estado: client.estado || "Activo",
      });
    }
  }, [client, isCreating]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = isCreating
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          altura: formData.altura,
          peso: formData.peso,
          rutina: formData.rutina,
          observaciones: formData.observaciones,
          estado: formData.estado,
        }
      : {
          altura: formData.altura,
          peso: formData.peso,
          rutina: formData.rutina,
          observaciones: formData.observaciones,
          estado: formData.estado,
        };

    onSave(payload);
  };

  if (!client && !isCreating) {
    return <p className="trainer-loading">Selecciona un cliente</p>;
  }


  return (
    <form className="client-detail-card" onSubmit={handleSubmit}>
      <h3 className="client-name">
        {isCreating ? "Nuevo Cliente" : client?.name}
      </h3>

      {/* CAMPOS SOLO EN CREACIÓN */}
      {isCreating && (
        <div className="client-form-grid">
          <input
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
      )}

      {/* DATOS DEL CLIENTE */}
      <div className="client-form-grid">
        <input
          name="altura"
          placeholder="Altura (cm)"
          value={formData.altura}
          onChange={handleChange}
          disabled={saving}
        />

        <input
          name="peso"
          placeholder="Peso (kg)"
          value={formData.peso}
          onChange={handleChange}
          disabled={saving}
        />

        <select
          name="rutina"
          value={formData.rutina}
          onChange={handleChange}
          disabled={saving}
        >
          <option value="">Rutina</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>

        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          disabled={saving}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo (no pago)</option>
        </select>

        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          disabled={saving}
          className="full-width"
        />
      </div>

      {error && <p className="trainer-error">{error}</p>}

      {/* BOTONES */}
      <div className="trainer-form-actions">
        {isCreating && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancelCreate}
            disabled={saving}
          >
            Cancelar
          </button>
        )}

        <button type="submit" className="btn-neon" disabled={saving}>
          {saving ? "Guardando..." : isCreating ? "Crear Cliente" : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default ClientDetailForm;
