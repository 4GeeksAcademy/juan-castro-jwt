import React, { useEffect, useState } from "react";

const ClientDetailForm = ({ client, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (client) {
      setFormData({
        altura: client.altura || "",
        peso: client.peso || "",
        rutina: client.rutina || "",
        observaciones: client.observaciones || "",
        estado: client.estado || "",
      });
    }
  }, [client]);

  if (!client) return <p>Selecciona un cliente</p>;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={submit} className="card p-4 shadow">
      <h4>{client.name}</h4>

      <input className="form-control mb-2" name="altura" value={formData.altura} onChange={handleChange} placeholder="Altura" />
      <input className="form-control mb-2" name="peso" value={formData.peso} onChange={handleChange} placeholder="Peso" />

      <select className="form-select mb-2" name="rutina" value={formData.rutina} onChange={handleChange}>
        <option value="">Rutina</option>
        <option value="Principiante">Principiante</option>
        <option value="Intermedio">Intermedio</option>
        <option value="Avanzado">Avanzado</option>
      </select>

      <select className="form-select mb-2" name="estado" value={formData.estado} onChange={handleChange}>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>

      <textarea className="form-control mb-2" name="observaciones" value={formData.observaciones} onChange={handleChange} />

      <button className="btn btn-primary">Guardar</button>
    </form>
  );
};

export default ClientDetailForm;
