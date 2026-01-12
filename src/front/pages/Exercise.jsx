import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logout from "../components/Logout";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


const Exercise = () => {
   const { store, dispatch } = useGlobalReducer();
   const location = useLocation();
   const preSelectedClient = location.state?.selectedClient;
   const [loading, setLoading] = useState(true);
   const BACKEND = import.meta.env.VITE_BACKEND_URL;
   useEffect(() => {
      const getExercises = async () => {
         try {
            const response = await fetch(`${BACKEND}/api/exercises`);
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // La API devuelve directamente un array; si viene en data.results, usarlo
            const exercises = Array.isArray(data) ? data : data.results || [];
            dispatch({ type: "data_exercises", payload: exercises });
            setLoading(false);
            console.log("STORE:", store)
         } catch (error) {
            console.error("Error data:", error);
            setLoading(false);

         }
      };

      getExercises();
   }, [dispatch]);

   const exercises = store?.data_exercises || [];
   const [displayed, setDisplayed] = useState([]);

   useEffect(() => {
      // keep displayed in sync with fetched exercises when there is no active filter
      setDisplayed(exercises || []);
   }, [exercises]);

   const unique = useMemo(() => ({
      types: Array.from(new Set(exercises.map(e => e.type).filter(Boolean))).sort(),
      muscles: Array.from(new Set(exercises.map(e => e.muscle).filter(Boolean))).sort(),
      difficulties: Array.from(new Set(exercises.map(e => e.difficulty).filter(Boolean))).sort(),
   }), [exercises]);

   const [selectedTypes, setSelectedTypes] = useState("");
   const [selectedMuscles, setSelectedMuscles] = useState("");
   const [selectedDifficulties, setSelectedDifficulties] = useState("");

   const buildQueryAndFetch = async () => {
      setLoading(true);
      try {
         const params = new URLSearchParams();
         if (selectedTypes) params.append('type', selectedTypes);
         if (selectedMuscles) params.append('muscle', selectedMuscles);
         if (selectedDifficulties) params.append('difficulty', selectedDifficulties);

         const url = params.toString() ? `${BACKEND}/api/exercises?${params.toString()}` : `${BACKEND}/api/exercises`;
         const res = await fetch(url);
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         const data = await res.json();
         const list = Array.isArray(data) ? data : data.results || [];
         setDisplayed(list);
      } catch (err) {
         console.error('Error fetching filtered exercises:', err);
      } finally {
         setLoading(false);
      }
   };

   const clearFilters = () => {
      setSelectedTypes("");
      setSelectedMuscles("");
      setSelectedDifficulties("");
      setDisplayed(exercises || []);
   }

   const [showAssignModal, setShowAssignModal] = useState(false);
   const [selectedExercise, setSelectedExercise] = useState(null);
   const [clients, setClients] = useState([]);
   const [selectedClient, setSelectedClient] = useState("");
   const [assigning, setAssigning] = useState(false);

   useEffect(() => {
      // Fetch clients list for trainers
      const fetchClients = async () => {
         try {
            const token = localStorage.getItem('access_token');
            if (!token) return;

            const res = await fetch(`${BACKEND}/api/users`, {
               headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
               const data = await res.json();
               setClients(data.filter(u => u.role === 'client'));
            }
         } catch (err) {
            console.error('Error fetching clients:', err);
         }
      };
      fetchClients();
   }, [BACKEND]);

   const handleAssignExercise = async (exercise) => {
      // Si hay un cliente pre-seleccionado, asignar directamente
      if (preSelectedClient) {
         setAssigning(true);
         try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${BACKEND}/api/assign-exercise`, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify({
                  user_id: preSelectedClient.id,
                  exercise_name: exercise.name
               })
            });

            if (res.ok) {
               alert(`Ejercicio "${exercise.name}" asignado a ${preSelectedClient.name}`);
            } else {
               const error = await res.json();
               alert(error.msg || 'Error al asignar ejercicio');
            }
         } catch (err) {
            console.error('Error assigning exercise:', err);
            alert('Error al asignar ejercicio');
         } finally {
            setAssigning(false);
         }
      } else {
         // Si no hay cliente pre-seleccionado, mostrar modal
         setSelectedExercise(exercise);
         setShowAssignModal(true);
      }
   };

   const confirmAssignment = async () => {
      if (!selectedClient || !selectedExercise) return;

      setAssigning(true);
      try {
         const token = localStorage.getItem('access_token');
         const res = await fetch(`${BACKEND}/api/assign-exercise`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
               user_id: parseInt(selectedClient),
               exercise_name: selectedExercise.name
            })
         });

         if (res.ok) {
            alert('Ejercicio asignado correctamente');
            setShowAssignModal(false);
            setSelectedClient("");
            setSelectedExercise(null);
         } else {
            const error = await res.json();
            alert(error.msg || 'Error al asignar ejercicio');
         }
      } catch (err) {
         console.error('Error assigning exercise:', err);
         alert('Error al asignar ejercicio');
      } finally {
         setAssigning(false);
      }
   };

   return (
      <div>
         <h1>Ejercicios</h1>
         {preSelectedClient && (
            <div className="alert alert-info mb-3">
               Asignando ejercicios a: <strong>{preSelectedClient.name}</strong>
            </div>
         )}
         <h3>Busca tus ejercicios</h3>

         <div className="d-flex gap-2 mb-3 align-items-end">
            <div style={{ flex: '1', minWidth: '150px' }}>
               <label className="form-label small mb-1">Tipo</label>
               <select className="form-select form-select-sm" value={selectedTypes} onChange={e => setSelectedTypes(e.target.value)}>
                  <option value="">Todos</option>
                  <option value="cardio">Cardio</option>
                  <option value="olympic_weightlifting">Olympic Weightlifting</option>
                  <option value="plyometrics">Plyometrics</option>
                  <option value="powerlifting">Powerlifting</option>
                  <option value="strength">Strength</option>
                  <option value="stretching">Stretching</option>
                  <option value="strongman">Strongman</option>
               </select>
            </div>

            <div style={{ flex: '1', minWidth: '150px' }}>
               <label className="form-label small mb-1">Músculo</label>
               <select className="form-select form-select-sm" value={selectedMuscles} onChange={e => setSelectedMuscles(e.target.value)}>
                  <option value="">Todos</option>
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

            <div style={{ flex: '1', minWidth: '150px' }}>
               <label className="form-label small mb-1">Dificultad</label>
               <select className="form-select form-select-sm" value={selectedDifficulties} onChange={e => setSelectedDifficulties(e.target.value)}>
                  <option value="">Todos</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
               </select>
            </div>

            <button className="btn btn-primary" onClick={buildQueryAndFetch}>Buscar</button>
            <button className="btn btn-outline-secondary" onClick={clearFilters}>Limpiar</button>
         </div>

         {loading && <p>Cargando ejercicios...</p>}
         {!loading && displayed.length === 0 && <p>No hay ejercicios cargados.</p>}

         <div className="cards-container">
            {displayed.map((ele, idx) => {
               const instrModalId = `staticBackdrop-${idx}`;
               const safetyModalId = `staticBackdrop2-${idx}`;
               const instrLabelId = `staticBackdropLabel-${idx}`;
               const safetyLabelId = `staticBackdropLabel2-${idx}`;
               return (
                  <div className="card" style={{ width: "30rem" }} key={ele.id || ele.uid || ele.name}>
                     <div className="card-body">
                        <h5 className="card-title">{ele.name}</h5>
                        <ul className="list-group list-group-flush">
                           <li className="list-group-item">Tipo: {ele.type}</li>
                           <li className="list-group-item">Musculo que trabaja: {ele.muscle}</li>
                           <li className="list-group-item">Dificultad: {ele.difficulty}</li>
                        </ul>

                        {/* Button trigger modal */}
                        <button
                           type="button"
                           className="btn btn-primary btn-sm me-2"
                           data-bs-toggle="modal"
                           data-bs-target={`#${instrModalId}`}
                        >
                           Instrucciones
                        </button>
                        <button
                           type="button"
                           className="btn btn-primary btn-sm me-2"
                           data-bs-toggle="modal"
                           data-bs-target={`#${safetyModalId}`}
                        >
                           Info de seguridad
                        </button>
                        <button
                           type="button"
                           className="btn btn-success btn-sm"
                           onClick={() => handleAssignExercise(ele)}
                        >
                           Asignar a Cliente
                        </button>

                        {/* Modal */}
                        <div
                           className="modal fade"
                           id={instrModalId}
                           data-bs-backdrop="static"
                           data-bs-keyboard="false"
                           tabIndex={-1}
                           aria-labelledby={instrLabelId}
                           aria-hidden="true"
                        >
                           <div className="modal-dialog">
                              <div className="modal-content">
                                 <div className="modal-header">
                                    <h1 className="modal-title fs-5" id={instrLabelId}>Instrucciones</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                 </div>
                                 <div className="modal-body">
                                    {ele.instructions}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div
                           className="modal fade"
                           id={safetyModalId}
                           data-bs-backdrop="static"
                           data-bs-keyboard="false"
                           tabIndex={-1}
                           aria-labelledby={safetyLabelId}
                           aria-hidden="true"
                        >
                           <div className="modal-dialog">
                              <div className="modal-content">
                                 <div className="modal-header">
                                    <h1 className="modal-title fs-5" id={safetyLabelId}>Info de seguridad</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                 </div>
                                 <div className="modal-body">
                                    {ele.safety_info}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               );
            })}

         </div>

         {/* Modal para asignar ejercicio */}
         {showAssignModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAssignModal(false)}>
               <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                  <div className="modal-content">
                     <div className="modal-header">
                        <h5 className="modal-title">Asignar Ejercicio: {selectedExercise?.name}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                     </div>
                     <div className="modal-body">
                        <label className="form-label">Selecciona un cliente:</label>
                        <select
                           className="form-select"
                           value={selectedClient}
                           onChange={e => setSelectedClient(e.target.value)}
                           disabled={assigning}
                        >
                           <option value="">-- Seleccionar cliente --</option>
                           {clients.map(client => (
                              <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                           ))}
                        </select>
                     </div>
                     <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)} disabled={assigning}>
                           Cancelar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={confirmAssignment} disabled={!selectedClient || assigning}>
                           {assigning ? 'Asignando...' : 'Asignar'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Exercise;