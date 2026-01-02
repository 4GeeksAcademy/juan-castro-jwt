import React, { useState, useEffect } from "react";


const ClientDetailForm = ({ client, onSave, isCreating, onCancelCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    altura: "",
    peso: "",
    rutina: "",
    observaciones: "",
    estado: "",
  });
  const [isModified, setIsModified] = useState(false);
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
      setIsModified(true); 
    } else if (client) {
      const newData = {
        name: client.name || "",
        email: client.email || "",
        // Password no se muestra
        altura: client.altura || "",
        peso: client.peso || "",
        rutina: client.rutina || "",
        observaciones: client.observaciones || "",
        estado: client.estado || "",
      };
      setFormData(newData);
      setIsModified(false);
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        altura: "",
        peso: "",
        rutina: "",
        observaciones: "",
        estado: "",
      });
      setIsModified(false);
    }
  }, [client, isCreating]);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsModified(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreating) {
      if (!formData.name || !formData.email || !formData.password) {
        alert("Nombre, Email y Contraseña son obligatorios");
        return;
      }
    }
    onSave(formData);
    if (!isCreating) setIsModified(false);
  };
  if (!client && !isCreating) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body d-flex flex-column align-items-center justify-content-center text-center p-5">
          <i
            className="bi bi-person-circle text-muted"
            style={{ fontSize: "5rem" }}
          ></i>
          <h4 className="mt-4 text-muted">Selecciona un cliente</h4>
          <p className="text-muted">
            Elige un cliente de la lista para ver y editar sus datos
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="card shadow-sm border-primary">
      <div
        className={`card-header ${
          isCreating ? "bg-success text-white" : "bg-white"
        } border-bottom`}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div
              className={`rounded-circle ${
                isCreating ? "bg-white text-success" : "bg-primary text-white"
              } d-flex align-items-center justify-content-center me-3`}
              style={{ width: "60px", height: "60px", fontSize: "28px" }}
            >
              {isCreating ? (
                <i className="bi bi-person-plus-fill"></i>
              ) : (
                client.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h4 className="mb-0">
                {isCreating ? "Nuevo Cliente" : client.name}
              </h4>
              <p
                className={
                  isCreating ? "text-white-50 mb-0" : "text-muted mb-0"
                }
              >
                <i className="bi bi-envelope me-2"></i>
                {isCreating
                  ? "Ingresa los datos del nuevo cliente"
                  : client.email}
              </p>
            </div>
          </div>
          {isCreating && (
            <button
              type="button"
              className="btn btn-close btn-close-white"
              onClick={onCancelCreate}
            ></button>
          )}
        </div>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* CAMPOS OBLIGATORIOS SOLO AL CREAR */}
            {isCreating && (
              <div className="col-12">
                <div className="alert alert-light border mb-3">
                  <h6 className="text-primary fw-bold mb-3">
                    <i className="bi bi-lock-fill me-2"></i>Credenciales de
                    Acceso
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Nombre del cliente"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="email@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Contraseña *</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Contraseña temporal"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Datos Físicos */}
            <div className="col-12">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-heart-pulse me-2 text-danger"></i>
                Datos Físicos
              </h5>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="bi bi-arrows-vertical me-2"></i>
                Altura (cm)
              </label>
              <input
                type="number"
                name="altura"
                className="form-control"
                placeholder="Ej: 175"
                value={formData.altura}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">
                <i className="bi bi-speedometer2 me-2"></i>
                Peso (kg)
              </label>
              <input
                type="number"
                name="peso"
                className="form-control"
                placeholder="Ej: 70"
                value={formData.peso}
                onChange={handleChange}
              />
            </div>
            {/* Rutina */}
            <div className="col-12 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-calendar-check me-2 text-success"></i>
                Plan de Entrenamiento
              </h5>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">
                <i className="bi bi-clipboard-check me-2"></i>
                Rutina Asignada
              </label>
              <select
                name="rutina"
                className="form-select"
                value={formData.rutina}
                onChange={handleChange}
              >
                <option value="">Seleccionar rutina...</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Pérdida de peso">Pérdida de peso</option>
                <option value="Ganancia muscular">Ganancia muscular</option>
                <option value="Resistencia">Resistencia</option>
                <option value="Personalizada">Personalizada</option>
              </select>
            </div>
            {/* Estado */}
            <div className="col-12">
              <label className="form-label fw-bold">
                <i className="bi bi-activity me-2"></i>
                Estado del Cliente
              </label>
              <select
                name="estado"
                className="form-select"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">Seleccionar estado...</option>
                <option value="Activo">✓ Activo</option>
                <option value="Inactivo">⏸ Inactivo</option>
                <option value="En progreso">🔄 En progreso</option>
                <option value="Pausado">⏹ Pausado</option>
                <option value="Completado">✔ Completado</option>
              </select>
            </div>
            {/* Observaciones */}
            <div className="col-12 mt-4">
              <h5 className="border-bottom pb-2 mb-3">
                <i className="bi bi-journal-text me-2 text-info"></i>
                Notas y Observaciones
              </h5>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">
                <i className="bi bi-pencil-square me-2"></i>
                Observaciones
              </label>
              <textarea
                name="observaciones"
                className="form-control"
                rows="4"
                placeholder="Notas sobre el progreso, lesiones, objetivos específicos, etc."
                value={formData.observaciones}
                onChange={handleChange}
              />
              <small className="text-muted">
                Máximo 200 caracteres ({formData.observaciones.length}/200)
              </small>
            </div>
            {/* Botones */}
            <div className="col-12 mt-4">
              <div className="d-flex justify-content-end gap-2">
                {!isCreating && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setFormData({
                        altura: client.altura || "",
                        peso: client.peso || "",
                        rutina: client.rutina || "",
                        observaciones: client.observaciones || "",
                        estado: client.estado || "",
                      });
                      setIsModified(false);
                    }}
                    disabled={!isModified}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    Descartar Cambios
                  </button>
                )}
                {isCreating && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancelCreate}
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className={`btn ${
                    isCreating ? "btn-success" : "btn-primary"
                  }`}
                  disabled={!isModified && !isCreating}
                >
                  <i
                    className={`bi ${
                      isCreating ? "bi-plus-circle" : "bi-save"
                    } me-2`}
                  ></i>
                  {isCreating ? "Crear Cliente" : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* Footer con información adicional (Solo si no es CREANDO) */}
      {!isCreating && (
        <div className="card-footer bg-light">
          <div className="row text-center">
            <div className="col-md-4">
              <small className="text-muted d-block">Altura</small>
              <strong>{formData.altura ? `${formData.altura} cm` : "-"}</strong>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">Peso</small>
              <strong>{formData.peso ? `${formData.peso} kg` : "-"}</strong>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">IMC</small>
              <strong>
                {formData.altura && formData.peso
                  ? (formData.peso / (formData.altura / 100) ** 2).toFixed(1)
                  : "-"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClientDetailForm;
