import React, { useState } from "react";
import "./Contactanos.css";

const Contactanos = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, email, telefono, mensaje });
    alert("Formulario enviado");

    setNombre("");
    setEmail("");
    setTelefono("");
    setMensaje("");
  };

  return (
    <section className="contact-container">
      <h1 className="contact-title">Contacto</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mensaje</label>
          <textarea
            rows="4"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn-neon">
          Enviar
        </button>
      </form>
    </section>
  );
};

export default Contactanos;
