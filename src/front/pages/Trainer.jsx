import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import { useEffect,useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


const Trainer = ()=> {
    
const {store, dispatch} = useGlobalReducer()
    const [user, setUser] = useState("")
    // useEffect(()=>{
    //     const getRestricted = async ()=> {
    //         try {
    //             const response = await fetch("https://symmetrical-space-dollop-4jg7j5xxgxr376jr-3001.app.github.dev/api/restringido",{
    //                 headers:{
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    //                 }
    //             })
    //         let data = await response.json()
    //         if (data) {
    //             console.log("ESTA ES LA DATA",data.user)
    //             setUser(data.user)
    //         }
    //         } catch (error) {
    //            console.error(error) 
    //         }
    //     }
    //     getRestricted()
    // },[])

   return(
     <div>
        <h1>soy el Dashboard</h1>
        <h2>bienvenido: {
        store.current_user.name && store.current_user.name
        }</h2>
    </div>
   )
}

export default Trainer;