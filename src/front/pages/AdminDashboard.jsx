import React, { useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'client' });

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

    const handleSave = (e) => {
        e.preventDefault();
        if (editingUser && editingUser.id) {
            const updatedUsers = users.map(u => (u.id === editingUser.id ? { ...u, ...formData } : u));
            setUsers(updatedUsers);
        } else {
            const newUser = { ...formData, id: Date.now() };
            setUsers([...users, newUser]);
        }
        setEditingUser(null);
        alert('Usuario guardado');
    };

    const handleCancel = () => setEditingUser(null);

    return (
        <div className='container mt-5'>
            <h2 className='mb-4'>Panel de Administración</h2>

            {!editingUser ? (
                <div className='table-view'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h4>Lista de Usuarios</h4>
                        <button className='btn btn-success' onClick={handleCreateClick}>
                            + Nuevo usuario
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
                                <tr key={users.id}>
                                    <td>{users.name}</td>
                                    <td>{users.email}</td>
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
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                            <button type='submit' className='btn btn-primary'>Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;