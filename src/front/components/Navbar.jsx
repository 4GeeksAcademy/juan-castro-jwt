import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const [userRole, setUserRole] = useState(null);
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Si hay token pero no tenemos current_user, obtener perfil
    const token = localStorage.getItem("access_token");
    if (token && (!store.current_user || !store.current_user.role)) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`${BACKEND}/api/user/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            dispatch({ type: "current_user", payload: userData });
            setUserRole(userData?.role);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    } else if (store.current_user?.role) {
      setUserRole(store.current_user.role);
    } else if (!token) {
      // Si no hay token, limpiar los datos del usuario
      setUserRole(null);
      dispatch({ type: "current_user", payload: {} });
    }
  }, [store.current_user, BACKEND, dispatch]);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          2-Gym
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/quienes">
                Quienes Somos
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contactanos">
                Contáctanos
              </Link>
            </li>

            {store.current_user?.role === "trainer" || userRole === "trainer" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/trainer">
                  Volver
                </Link>
              </li>
            ) : null}

            {/* <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            </li> */}

            {/* <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li> */}


            {/* <li className="nav-item">
              <Link className="nav-link" to="/ejercicios">
                Ejercicios
              </Link>
            </li> */}

            {store.current_user?.role === "client" || userRole === "client" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Volver
                </Link>
              </li>
            ) : null}

            {store.current_user?.role === "client" || userRole === "client" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/perfil">
                  Mi Perfil
                </Link>
              </li>
            ) : null}
          </ul>

          <div className="d-flex">
            {localStorage.getItem("access_token") ? (
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem("access_token");
                  dispatch({ type: "current_user", payload: {} });
                  setUserRole(null);
                  navigate("/");
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => navigate("/registro")}
                >
                  Register
                </button>

                <button
                  className="btn btn-outline-primary ms-3"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
