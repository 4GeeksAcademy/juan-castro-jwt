import React from "react";
import { useState } from "react";


const Registro = ()=>{

    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")



    const handlerRegistro = async ()=>{
        if(name.length < 2 || email.length < 7 || password.length < 8){
            alert("algun dato quedo corto")
            return
        }
        const payload = {
            name,
            email,
            password
        }

        try {
            const response = await fetch("https://symmetrical-space-dollop-4jg7j5xxgxr376jr-3001.app.github.dev/api/create_user",{
                method:"POST",
                body: JSON.stringify(payload),
                headers:{
                    "Content-Type": "application/json"
                }
            })

            let data = await response.json()
            if(data){
                alert("el usuario se creo con exito")
                console.log(data.nuevo_usuario)
            }

        } catch (error) {
            console.error(error)
        }
        
    }

    return(
        <div>
            <h1>registro</h1>
            <label htmlFor="name">nombre:</label>
            <input type="text" id="name" onChange={e => setName(e.target.value)} />
            <label htmlFor="email">email:</label>
            <input type="email" id="email" onChange={e => setEmail(e.target.value)} />
            <label htmlFor="password">password:</label>
            <input type="password" id="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handlerRegistro}>confirmar tus datos</button>
        </div>

    )
} 

export default Registro; 