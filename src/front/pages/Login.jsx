import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    let navigate = useNavigate()

    const handlerLogin = async () => {

        try {
            const response = await fetch("https://symmetrical-space-dollop-4jg7j5xxgxr376jr-3001.app.github.dev/api/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            let data = await response.json()
            if (data) {
                alert("Bienvenido")
                console.log(data.access_token)
                localStorage.setItem("access_token", data.access_token)
                navigate("/dashboard")
            }

        } catch (error) {
            console.error(error)
        }

    }


    return (
        <div>
            <h1>soy el login</h1>
            <label htmlFor="email">ingresa tu email:  </label>
            <input type="email" id="email" onChange={e => setEmail(e.target.value)} />
            <br /> <br />
            <label htmlFor="password">ingresa el password:  </label>
            <input type="password" id="password" onChange={e => setPassword(e.target.value)} />
            <br /><br />
            <button onClick={handlerLogin}>ingresar</button>


        </div>
    )

}

export default Login;