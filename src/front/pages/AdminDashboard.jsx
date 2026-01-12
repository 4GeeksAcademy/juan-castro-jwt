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

    // cargar usuarios desde el back 
    useEffect(() => {
        fetch(`${BACKEND}/api/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, [BACKEND]);


    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            role: user.role || "client",
            estado: user.estado || "Desactivado",
        });
    };

    const handleCancel = () => {
        setEditingUser(null);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        alert("Cambios guardados localmente (Falta implementar fetch)");
        setEditingUser(null);
    };

//    filtro
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

    const filteredClients = users.filter(
        (u) => u.role === "client" && matches(u)
    );

    
    return (
        <div className="admin-wrapper">
            <section className="admin-container">
                <h2>Panel de Administración</h2>

                {!editingUser ? (
                    <>
                        {/* BUSCADOR */}
                        <input
                            type="text"
                            className="admin-search mb-4"
                            placeholder="Buscar por nombre, email o rol"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {/* users */}
                        <div className="admin-card mb-5">
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
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleEditClick(u)}
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* clientes */}
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
                                    {filteredClients.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <span className={
                                                    user.estado === 'Activo' ? 'badge bg-success' :
                                                        user.estado === 'Desactivado' ? 'badge bg-danger' : 'badge bg-secondary'
                                                }>
                                                    {user.estado}
                                                </span>
                                            </td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="badge bg-info text-dark">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-outline-primary btn-sm'
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
                    </>
                ) : (
                    // formulario de edicion
                    <div className='card p-4 shadow-sm mx-auto' style={{ maxWidth: '600px' }}>
                        <h4 className='mb-3 text-white'>Editar Usuario</h4>
                        <form onSubmit={handleSave}>
                            <div className='mb-3'>
                                <label className='form-label text-white'>Nombre</label>
                                <input
                                    type='text'
                                    name='name'
                                    className='form-control'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className='mb-3'>
                                <label className='form-label text-white'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    className='form-control'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className='mb-3'>
                                <label className='form-label text-white'>Estado</label>
                                <select
                                    name='estado'
                                    className='form-select'
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                >
                                    <option value='Activo'>Activo</option>
                                    <option value='Desactivado'>Desactivado</option>
                                </select>
                            </div>

                            <div className='mb-3'>
                                <label className='form-label text-white'>Rol</label>
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
                                <button type='button' className='btn btn-secondary' onClick={handleCancel}>
                                    Cancelar
                                </button>
                                <button type='submit' className='btn btn-primary'>
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;