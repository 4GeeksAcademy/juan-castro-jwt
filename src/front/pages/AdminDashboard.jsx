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

                        {/* <button className='btn btn-success' onClick={handleCreateClick}>
                            Nuevo cliente
                        </button> */}
                    </div>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Estado</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClient.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <span className={
                                            user.estado === 'Activo' ? 'badge bg-success' :
                                                user.estado === 'Desactivado' ? 'badge bg-danger text-emphasis-light' : 'badge bg-secondary'
                                        }>
                                            {user.estado}
                                        </span>
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={
                                            user.role === 'adm' ? 'badge bg-primary' :
                                                user.role === 'trainer' ? 'badge bg-warning text-dark' :
                                                    'badge bg-info text-dark'
                                        }>
                                            {user.role}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className='btn btn-outline-primary btn-sm me-2'
                                            onClick={() => handleEditClick(user)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='card p-4 shadow-sm' style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h4 className='mb-3'>Editar Usuario</h4>
                    <form onSubmit={handleSave}>
                        <div className='mb-3'>
                            <label className='form-label'>Nombre</label>
                            <input
                                type='text'
                                name='name'
                                className='form-control'
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Email</label>
                            <input
                                type='email'
                                name='email'
                                className='form-control'
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Estado</label>
                            <select
                                name='estado'
                                className='form-select'
                                value={formData.estado}
                                onChange={handleInputChange}
                            >
                                <option value='Activo'>Activo</option>
+                               <option value='Desactivado'>Desactivado</option>
                            </select>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Rol</label>
                            <select
                                name='role'
                                className='form-select'
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value='adm'>Admin</option>
                                <option value='trainer'>Trainer</option>
                                <option value='client'>Cliente</option>
                            </select>
                        </div>

                        <div className='d-flex justify-content-between'>
                            <button type='button' className='btn btn-secondary'
                                onClick={handleCancel}>Cancelar</button>

                            <div>
                                {currentUser.role === 'admin' && editingUser?.id && (
                                    <button
                                        type='button'
                                        className='btn btn-danger me-2'
                                        onClick={() => handleDeleteUser(editingUser.id)}>
                                        Eliminar Usuario
                                    </button>
                                )}
                                <button type='submit' className='btn btn-primary'>
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
