// import React, { useEffect, useState } from "react";

// const ClientDetailForm = ({ client, onSave }) => {
//   const [formData, setFormData] = useState(null);

//   useEffect(() => {
//     if (client) {
//       setFormData({
//         altura: client.altura || "",
//         peso: client.peso || "",
//         rutina: client.rutina || "",
//         observaciones: client.observaciones || "",
//         estado: client.estado || "",
//       });
//     }
//   }, [client]);

//   if (!client) return <p>Selecciona un cliente</p>;

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const submit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <form onSubmit={submit} className="card p-4 shadow">
//       <h4>{client.name}</h4>

//       <input className="form-control mb-2" name="altura" value={formData.altura} onChange={handleChange} placeholder="Altura" />
//       <input className="form-control mb-2" name="peso" value={formData.peso} onChange={handleChange} placeholder="Peso" />

//       <select className="form-select mb-2" name="rutina" value={formData.rutina} onChange={handleChange}>
//         <option value="">Rutina</option>
//         <option value="Principiante">Principiante</option>
//         <option value="Intermedio">Intermedio</option>
//         <option value="Avanzado">Avanzado</option>
//       </select>

//       <select className="form-select mb-2" name="estado" value={formData.estado} onChange={handleChange}>
//         <option value="Activo">Activo</option>
//         <option value="Inactivo">Inactivo</option>
//       </select>

//       <textarea className="form-control mb-2" name="observaciones" value={formData.observaciones} onChange={handleChange} />

//       <button className="btn btn-primary">Guardar</button>
//     </form>
//   );
// };

// export default ClientDetailForm;

import React, { useEffect, useState } from "react";

const ClientDetailForm = ({ client, isCreating, onSave, onCancelCreate }) => {
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
    if (client) {
      setFormData(prev => ({
        ...prev,
        name: client.name || "",
        email: client.email || "",
        altura: client.altura || "",
        peso: client.peso || "",
        rutina: client.rutina || "",
        observaciones: client.observaciones || "",
        estado: client.estado || "Activo",
      }));
    } else if (isCreating) {
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
    }
  }, [client, isCreating]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    // En creación, enviar name/email/password para que el backend pueda crear el User
    if (isCreating) {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        altura: formData.altura,
        peso: formData.peso,
        rutina: formData.rutina,
        observaciones: formData.observaciones,
        estado: formData.estado,
      };
      onSave(payload);
    } else {
      // En edición, enviar solo los campos del Client
      const payload = {
        altura: formData.altura,
        peso: formData.peso,
        rutina: formData.rutina,
        observaciones: formData.observaciones,
        estado: formData.estado,
      };
      onSave(payload);
    }
  };

  if (!client && !isCreating) return <p>Selecciona un cliente</p>;

  return (
    <form onSubmit={submit} className="card p-4 shadow">
      <h4>{isCreating ? "Nuevo Cliente" : client?.name}</h4>

      {isCreating && (
        <>
          <input className="form-control mb-2" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" />
          <input className="form-control mb-2" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input type="password" className="form-control mb-2" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        </>
      )}

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

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">{isCreating ? "Crear" : "Guardar"}</button>
        {isCreating && (
          <button type="button" className="btn btn-secondary" onClick={onCancelCreate}>Cancelar</button>
        )}
      </div>
    </form>
  );
};

export default ClientDetailForm;