import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Login.css";

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
                "https://legendary-spoon-xjv5ppjxwv5hpgwq-3001.app.github.dev/api/login",
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

            if (response.ok) {
                localStorage.setItem("access_token", data.access_token);
                dispatch({ type: "current_user", payload: data })
                window.alert("Bienvenido");
                
                const role = data?.user?.role || data?.role || data?.current_user?.role || null;
                const roleRouteMap = {
                    adm: "/admin",
                    trainer: "/trainer",                    
                    client: "/perfil"
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
    <section className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <div className="login-group">
          <label>Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-group">
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-neon"
          onClick={handlerLogin}
          disabled={loading}
        >
          {loading ? <span className="login-spinner" /> : "Ingresar"}
        </button>
      </div>
    </section>
  );
};

export default Login;
