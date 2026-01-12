import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "client",
    estado: "Desactivado",
  });

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  /* =========================
     CARGAR USUARIOS
  ========================= */
  useEffect(() => {
    fetch(`${BACKEND}/api/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  /* =========================
     FILTRO
  ========================= */
  const matches = (u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  };

  const adminsAndTrainers = users.filter(
    (u) => (u.role === "adm" || u.role === "trainer") && matches(u)
  );

  const clients = users.filter(
    (u) => u.role === "client" && matches(u)
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <section className="admin-wrapper">
      <div className="admin-container">

        <h2>Panel de Administración</h2>

        {/* BUSCADOR */}
        <input
          type="text"
          className="admin-search"
          placeholder="Buscar por nombre, email o rol"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* ================= USERS ================= */}
        <div className="admin-card">
          <h4>Lista de Usuarios</h4>

          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {adminsAndTrainers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === "adm" ? "bg-success" : "bg-warning"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= CLIENTES ================= */}
        <div className="admin-card">
          <h4>Lista de Clientes</h4>

          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span
                      className={`badge ${
                        u.estado === "Activo" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {u.estado}
                    </span>
                  </td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="badge bg-info">client</span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};

export default AdminDashboard;
