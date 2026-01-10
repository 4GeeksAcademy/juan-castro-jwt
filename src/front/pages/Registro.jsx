import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");
    const [loading, setLoading] = useState(false);
    
    let navigate = useNavigate()
    const handlerRegistro = async () => {
        if (name.length < 2 || email.length < 7 || password.length < 8) {
            alert("Algún dato quedó corto");
            return;
        }
        const payload = {
            name,
            email,
            password,
            role 
        };
        try {
            setLoading(true);
            const response = await fetch(
                "https://legendary-spoon-xjv5ppjxwv5hpgwq-3001.app.github.dev/api/create_user",
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch { data = { message: text }; }

            console.log('Registro response status:', response.status, 'body:', data);

            if (response.ok) {
                alert("El usuario se creó con éxito");
                navigate("/login");
                console.log(data.nuevo_usuario || data);
            } else {
                alert("Error al crear usuario: " + (data.message || response.status));
                console.error('Detalle error:', data);
            }
        } catch (error) {
            console.error('Network/fetch error:', error);
            alert('Error de red al crear usuario');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: "420px", width: "100%" }}>
                <h2 className="text-center mb-4">Registro</h2>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="form-label">Tipo de usuario</label>
                    <select
                        id="role"
                        className="form-select"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        <option value="adm">Administrador</option>
                        <option value="trainer">Entrenador</option>
                        <option value="client">Cliente</option>
                    </select>
                </div>
                <button
                    className="btn btn-primary w-100"
                    onClick={handlerRegistro}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                        "Registrar"
                    )}
                </button>
            </div>
        </div>
    );
};
export default Registro;