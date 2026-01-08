import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();

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

            <li className="nav-item">
              <Link className="nav-link" to="/trainer">
                Trainer
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/ejercicios">
                Ejercicios
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/perfil">
                Mi Perfil
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            {localStorage.getItem("access_token") ? (
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem("access_token");
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
