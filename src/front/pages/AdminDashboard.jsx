import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'client' });
    const [currentUser] = useState({ id: 1, name: 'Admin User', role: 'admin' });


    //Cargar los usuarios del back 
    useEffect(() => {
        fetch('/api/users', { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error))
    }, []);

    const handleCreateClick = () => {
        setEditingUser({});
        setFormData({ name: '', email: '', role: 'client' });
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name || '', email: user.email || '', role: user.role || 'client', id: user.id });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (editingUser && editingUser.id) {
                const response = await fetch(`/api/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...formData } : u)));
                    alert('Usuario actualizado');
                }
            } else {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    const newUser = await response.json();
                    const id = (newUser && newUser.id) ? newUser.id : Date.now();
                    setUsers(prev => [...prev, { ...formData, id }]);
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

    return (
        <div className='container mt-5'>
            {/* <Navbar /> */}
            <h2 className='mb-4'>Panel de Administración</h2>

            {!editingUser ? (
                <div className='table-view'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h4>Lista de Usuarios</h4>
                        <button className='btn btn-success' onClick={handleCreateClick}>
                            Nuevo usuario
                        </button>
                    </div>

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
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={
                                            user.role === 'admin' ? 'badge bg-primary' :
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
                            <label className='form-label'>Rol</label>
                            <select
                                name='role'
                                className='form-select'
                                value={formData.role}
                                onChange={handleInputChange}
                            >
                                <option value='admin'>Admin</option>
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