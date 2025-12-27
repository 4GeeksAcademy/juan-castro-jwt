import React, { useState } from "react";

const Contactanos = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ nombre, email, telefono, mensaje });
        alert("formulario enviado!");

        //limpiar los campos despues de enviados
        setNombre('');
        setEmail('');
        setTelefono('');
        setMensaje('');
    };


    return (
        <div>
            <div className="container dsplay-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}>

                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">
                            <strong>Nombre</strong>                          
                            </label>

                        <input type="text" 
                        className="form-control" 
                        id="formGroupExampleInput" 
                        placeholder=""
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <strong>Email</strong>
                            </label>
                        <input type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>

                     <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">
                            <strong>Teléfono</strong>
                            </label>
                        <input type="tel" 
                        className="form-control" 
                        id='telefono'
                        placeholder= ''
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mensaje" className="form-label">
                            <strong>Mensaje</strong>
                            </label>
                        <input type="text"
                        className="form-control"
                        id='mensaje'
                        placeholder=''
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        />
                    </div>
                   
                    <button type="submit" className="btn btn-success">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Contactanos; 