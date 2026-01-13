import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logout from "../components/Logout";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import "./Exercise.css";
const Exercise = () => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const BACKEND = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchExercises();
    // Detectar si viene un cliente seleccionado desde Trainer
    if (location.state?.selectedClient) {
      setSelectedClient(location.state.selectedClient);
    } else {
      // Si no viene cliente, cargar lista de clientes
      fetchClients();
    }
  }, [dispatch, location]);

  const fetchExercises = async (params = {}) => {
    try {
      setLoading(true);
      // Construir query string con los parámetros
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.muscle) queryParams.append('muscle', params.muscle);
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params.name) queryParams.append('name', params.name);

      const url = `${BACKEND}/api/exercises${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const exercises = Array.isArray(data) ? data : data.results || [];
      dispatch({ type: "data_exercises", payload: exercises });
      setLoading(false);
    } catch (error) {
      console.error("Error data:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (filterType) params.type = filterType;
    if (filterMuscle) params.muscle = filterMuscle;
    if (filterDifficulty) params.difficulty = filterDifficulty;
    if (searchName.trim()) params.name = searchName.trim();

    fetchExercises(params);
  };

  const handleClearFilters = () => {
    setSearchName("");
    setFilterType("");
    setFilterMuscle("");
    setFilterDifficulty("");
    fetchExercises();
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${BACKEND}/api/users`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const clientsOnly = data.filter(user => user.role === "client");
        setClients(clientsOnly);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleAssignExercise = (exercise) => {
    setSelectedExercise(exercise);
    if (selectedClient) {
      // Si hay cliente pre-seleccionado, asignar directamente
      assignExerciseToClient(exercise, selectedClient);
    } else {
      // Si no, mostrar modal para seleccionar cliente
      setShowClientModal(true);
    }
  };

  const assignExerciseToClient = async (exercise, client) => {
    try {
      const response = await fetch(`${BACKEND}/api/assign-exercise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify({
          user_id: client.id,
          exercise_name: exercise.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Ejercicio "${exercise.name}" asignado a ${client.name}`);
        setShowClientModal(false);
        setSelectedExercise(null);
      } else {
        alert(`❌ Error: ${data.msg || 'No se pudo asignar el ejercicio'}`);
      }
    } catch (error) {
      console.error("Error assigning exercise:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleConfirmAssignment = () => {
    if (selectedExercise && selectedClient) {
      assignExerciseToClient(selectedExercise, selectedClient);
    }
  };

  const exercises = store?.data_exercises || [];

  return (
    <section className="exercise-wrapper">
      <div className="exercise-container">

        <h1 className="exercise-title text-center">Ejercicios</h1>

        {/* BUSCADOR Y FILTROS */}
        <div className="exercise-filters mb-4">
          <form onSubmit={handleSearch} className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Buscar por nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre del ejercicio..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Tipo</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="cardio">Cardio</option>
                <option value="olympic_weightlifting">Olympic Weightlifting</option>
                <option value="plyometrics">Plyometrics</option>
                <option value="powerlifting">Powerlifting</option>
                <option value="strength">Strength</option>
                <option value="stretching">Stretching</option>
                <option value="strongman">Strongman</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Músculo</label>
              <select
                className="form-select"
                value={filterMuscle}
                onChange={(e) => setFilterMuscle(e.target.value)}
              >
                <option value="">Todos los músculos</option>
                <option value="abdominals">Abdominals</option>
                <option value="abductors">Abductors</option>
                <option value="adductors">Adductors</option>
                <option value="biceps">Biceps</option>
                <option value="calves">Calves</option>
                <option value="chest">Chest</option>
                <option value="forearms">Forearms</option>
                <option value="glutes">Glutes</option>
                <option value="hamstrings">Hamstrings</option>
                <option value="lats">Lats</option>
                <option value="lower_back">Lower Back</option>
                <option value="middle_back">Middle Back</option>
                <option value="neck">Neck</option>
                <option value="quadriceps">Quadriceps</option>
                <option value="traps">Traps</option>
                <option value="triceps">Triceps</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Dificultad</label>
              <select
                className="form-select"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="">Todas las dificultades</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary me-2">
                🔍 Buscar
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
                🔄 Limpiar Filtros
              </button>
            </div>
          </form>
        </div>

        {loading && <p className="exercise-loading">Cargando ejercicios...</p>}
        {!loading && exercises.length === 0 && (
          <p className="exercise-loading">No se encontraron ejercicios con los filtros seleccionados.</p>
        )}

        <div className="exercise-grid">
          {exercises.map((ele, idx) => {
            const instrModalId = `staticBackdrop-${idx}`;
            const safetyModalId = `staticBackdrop2-${idx}`;
            const instrLabelId = `staticBackdropLabel-${idx}`;
            const safetyLabelId = `staticBackdropLabel2-${idx}`;

            return (
              <div className="exercise-card" key={ele.id || ele.uid || ele.name}>
                <h4>{ele.name}</h4>

                <ul>
                  <li>Tipo: <span>{ele.type}</span></li>
                  <li>Músculo: <span>{ele.muscle}</span></li>
                  <li>Dificultad: <span>{ele.difficulty}</span></li>
                </ul>

                <div className="exercise-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    data-bs-toggle="modal"
                    data-bs-target={`#${instrModalId}`}
                  >
                    Instrucciones
                  </button>

                  <button
                    type="button"
                    className="btn-neon"
                    data-bs-toggle="modal"
                    data-bs-target={`#${safetyModalId}`}
                  >
                    Seguridad
                  </button>

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => handleAssignExercise(ele)}
                  >
                    ✅ Asignar
                  </button>
                </div>

                {/* MODAL INSTRUCCIONES */}
                <div
                  className="modal fade"
                  id={instrModalId}
                  tabIndex={-1}
                  aria-labelledby={instrLabelId}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content dark-modal">
                      <div className="modal-header">
                        <h5 className="modal-title" id={instrLabelId}>Instrucciones</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
                      </div>
                      <div className="modal-body">
                        {ele.instructions}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL SEGURIDAD */}
                <div
                  className="modal fade"
                  id={safetyModalId}
                  tabIndex={-1}
                  aria-labelledby={safetyLabelId}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content dark-modal">
                      <div className="modal-header">
                        <h5 className="modal-title" id={safetyLabelId}>Info de seguridad</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" />
                      </div>
                      <div className="modal-body">
                        {ele.safety_info}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* MODAL SELECCIONAR CLIENTE */}
        {showClientModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Seleccionar Cliente</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowClientModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <p>Asignar ejercicio: <strong>{selectedExercise?.name}</strong></p>
                  <label className="form-label">Selecciona un cliente:</label>
                  <select
                    className="form-select"
                    value={selectedClient?.id || ""}
                    onChange={(e) => {
                      const client = clients.find(c => c.id === parseInt(e.target.value));
                      setSelectedClient(client);
                    }}
                  >
                    <option value="">-- Selecciona un cliente --</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowClientModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleConfirmAssignment}
                    disabled={!selectedClient}
                  >
                    Asignar Ejercicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default Exercise;
