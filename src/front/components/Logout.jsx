import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ()=> {
 let navigate = useNavigate()

    const handlerLogout = ()=> {


        localStorage.removeItem("access_token")
        alert("te deslogeaste")
        navigate("/")

    }

    return(
        <div>
            <button onClick={handlerLogout}>Logout</button>



        </div>
    )

}

export default Logout;