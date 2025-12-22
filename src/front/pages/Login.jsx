import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();

    const handlerLogin = async () => {
        if (email.length < 7 || password.length < 8) {
            alert("Email o password inválidos");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://supreme-spork-4xwjvvx6qwg3j6q7-3001.app.github.dev/api/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();
            console.log("esta es la data: ", data)

            if (response.ok) {
                localStorage.setItem("access_token", data.access_token);
                dispatch({ type: "current_user", payload: data })
                window.alert("Bienvenido");
                
                const role = data?.user?.role || data?.role || data?.current_user?.role || null;
                const roleRouteMap = {
                    adm: "/admin",
                    trainer: "/trainer",                    
                    client: "/dashboard"
                };
                const destination = role ? (roleRouteMap[role] || "/dashboard") : "/dashboard";
                navigate(destination);
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: "420px", width: "100%" }}>
                <h2 className="text-center mb-4">Login</h2>

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


                <button
                    className="btn btn-success w-100"
                    onClick={handlerLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                        "Ingresar"
                    )}
                </button>
            </div>
        </div>
    );
};

export default Login;