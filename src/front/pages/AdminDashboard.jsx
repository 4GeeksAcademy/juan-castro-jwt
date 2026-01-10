import React, { useEffect, useState } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer";


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'client', estado: 'Desactivado' });
    const [currentUser] = useState({ id: 1, name: 'Admin User', role: 'admin', estado: '' }); // Simulación de usuario actual, reemplazar con lógica real de autenticación


    //Cargar los usuarios del back 
    const BACKEND = (import.meta && import.meta.env && import.meta.env.VITE_BACKEND_URL)
        ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')
        : '';

    useEffect(() => {
        const url = BACKEND ? `${BACKEND}/api/users` : '/api/users';
        fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })
            .then(async res => {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    setUsers(Array.isArray(data) ? data : (data.users || []));
                } catch (err) {
                    console.error('Respuesta inválida al pedir usuarios:', text);
                    setUsers([]);
                }
            })
            .catch(error => console.error(error));
    }, []);

    const handleCreateClick = () => {
        setEditingUser({});
        setFormData({ name: '', email: '', role: 'client', estado: 'Desactivado' });
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name || '', email: user.email || '', role: user.role || 'client', id: user.id, estado: user.estado });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        try {
            if (editingUser && editingUser.id) {
                const url = BACKEND ? `${BACKEND}/api/users/${editingUser.id}` : `/api/users/${editingUser.id}`;
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...formData } : u)));
                    alert('Usuario actualizado');
                }
            } else {
                const url = BACKEND ? `${BACKEND}/api/users` : '/api/users';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    const newUser = await response.json();
                    const created = newUser.user || newUser || { ...formData, id: Date.now() };
                    setUsers(prev => [...prev, created]);
                    alert('Usuario creado');
                } else {
                    console.error('Creación de usuario falló:', response.status, response.statusText);
                    const tempId = Date.now();
                    setUsers(prev => [...prev, { ...formData, id: tempId }]);
                    alert('Usuario añadido localmente');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Error al guardar usuario');
        }

        setEditingUser(null);
    };

    const handleCancel = () => setEditingUser(null);

    const handleDeleteUser = (userId) => {
        if (window.confirm('Estás seguro que deseas eliminar este usuario?')) {
            setUsers(users.filter(user => user.id !== userId));
            alert('Usuario Eliminado');
            setEditingUser(null);
        }
    };

    const matches = (u) => {
        if (!query) return true;
        const q = query.trim().toLowerCase();
        return (u.name && u.name.toLowerCase().includes(q)) ||
               (u.email && u.email.toLowerCase().includes(q)) ||
               ((u.role || '').toLowerCase().includes(q));
    };

    const filteredUsers = users.filter(u => (u.role === 'adm' || u.role === 'trainer') && matches(u));
    const filteredClient = users.filter(u => u.role === 'client' && matches(u));

    return (
        <div className='container mt-5'>
            <h2 className='mb-4'>Panel de Administración</h2>

            {!editingUser ? (
                <div className='table-view'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h4>Lista de Usuarios</h4>
                        {/* <button className='btn btn-success' onClick={handleCreateClick}>
                            Nuevo usuario
                        </button> */}
                    </div>
                    <input
                        type='text'
                        className='form-control w-50'
                        placeholder='Buscar por nombre, email o rol'
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    /> <br />

                    <table className='table table-striped table-bordered'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={
                                            user.role === 'adm' ? 'badge bg-primary' :
                                                user.role === 'trainer' ? 'badge bg-warning text-dark' :
                                                    'badge bg-success'
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
                    <br />

                    <div className='d-flex justify-content-between align-items-center mb-3'>
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