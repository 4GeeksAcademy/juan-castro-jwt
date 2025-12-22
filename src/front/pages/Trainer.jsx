import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const Trainer = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handlerGoToDetails = async (url, type) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.result.properties
      console.log(data);
      if (type === "people") {
        dispatch({ type: "set_people_details", payload: data.result.properties });
        navigate(`/PeopleDetails`);
      } else if (type === "vehicle") {
        dispatch({ type: "set_vehicle_details", payload: data.result.properties });
        navigate(`/VehicleDetails`);
      } else if (type === "planet") {
        dispatch({ type: "set_planet_details", payload: data.result.properties });
        navigate(`/PlanetDetails`);
      }

    } catch (error) {
      console.error("Error data:", error);
    }
  };

  const handlerMovePeople = async (que) => {
    try {
      let url = "";
      if (que === "sig") {
        if (!store.data_people?.next) {
          alert("No hay mas paginas Siguientes");
          return;
        }
        url = store.data_people.next;
      } else {
        if (!store.data_people?.previous) {
          alert("No hay mas paginas Anteriores");
          return;
        }
        url = store.data_people.previous;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      dispatch({ type: "data_people", payload: data });

    } catch (error) {
      console.error(error);
    }
  };

  const handlerMovePlanet = async (que) => {
    try {
      let url = "";
      if (que === "sig") {
        if (!store.data_planet?.next) {
          alert("No hay mas paginas Siguientes");
          return;
        }
        url = store.data_planet.next;
      } else {
        if (!store.data_planet?.previous) {
          alert("No hay mas paginas Anteriores");
          return;
        }
        url = store.data_planet.previous;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      dispatch({ type: "data_planet", payload: data });

    } catch (error) {
      console.error(error);
    }
  };

  const handlerMoveVehicle = async (que) => {
    try {
      let url = "";
      if (que === "sig") {
        if (!store.data_vehicle?.next) {
          alert("No hay mas paginas Siguientes");
          return;
        }
        url = store.data_vehicle.next;
      } else {
        if (!store.data_vehicle?.previous) {
          alert("No hay mas paginas Anteriores");
          return;
        }
        url = store.data_vehicle.previous;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      dispatch({ type: "data_vehicle", payload: data });

    } catch (error) {
      console.error(error);
    }
  };

  const handlerFav = (elemento) => {
    let encontrado = store.fav_list.find((ele) => ele.uid === elemento.uid)
    if (encontrado)
      return
    dispatch({ type: "add_to_favorites", payload: elemento })
  };

  const handlerDelFav = (uid) => {
    dispatch({ type: "del_fav", payload: uid })
  };

  // para people
  useEffect(() => {
    const getPeople = async () => {
      try {
        const response = await fetch("https://supreme-spork-4xwjvvx6qwg3j6q7-3001.app.github.dev/api/hello");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.results

        dispatch({ type: "save_people_list", payload: data.results });
        dispatch({ type: "data_people", payload: data });
        console.log(data);


      } catch (error) {
        console.error("Error data:", error);
      }
    };
    getPeople();

  }
    , []);

  return (
    <div>
      <h1>Clientes</h1><br />
      
      <div className="cards-container">
        {console.log("STORE:", store)}
        {
          store.data_people?.users?.length > 0 &&
          store.data_people.users.map((ele) => {
            return (
              <div className="card" style={{ width: "18rem" }} key={ele.uid}>
                <img src="https://placehold.org/400x200/000000/ffffff" className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{ele.name}</h5>
                  <h5 className="card-title">{ele.email}</h5>
                  <h5 className="card-title">{ele.role}</h5>
                  <div className="botones cards">
                    <a href="#" className="btn btn-primary" onClick={() => handlerGoToDetails(ele.url, "people")} >Learn More!!</a>
                    <a href="#" className="btn btn-danger" onClick={() => handlerFav(ele)} ><i className="fa-solid fa-heart"></i></a>
                  </div>
                </div>

              </div>
            );
          })

        }
      </div>
    </div>
  );

};

export default Trainer;