import React, { useState, useEffect } from 'react'
import './Hero.css';

const Hero = () => {
    const [heroImage, setHeroImage] = useState("");

    useEffect(() => {
        const fetchGymImage = () => {
            // URL de cloudinary 
            const cloudinaryUrl = "https://res.cloudinary.com/drnsgjgvm/image/upload/v1766169545/Dise%C3%B1o_sin_t%C3%ADtulo_2_ylt060.png";

            setHeroImage(cloudinaryUrl);
        }

        fetchGymImage();
    }, []);

    return (
        <>
        <section
            className='hero-container'
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-label='Imagen de la sede del gimnasio'
        >
            <div className='hero-cover'></div>
            <div className='hero-content'>
                <h1 className='hero-title'>Nuestra Sede</h1>
            </div>
        </section>

        <section className="container my-5 text-center">
        <h3>Información de Contacto</h3>

        <p>📞 Teléfono: +57 301 555 4829 </p>
        <p>📍 Dirección: Calle los Aromos, local 5, Barrio Central</p>
        <p>🕒 Horarios: Lunes a Viernes: 6:00 AM - 10:00 PM, Sábado: 8:00 AM - 8:00 PM, Domingo: 8:00 AM - 2:00 PM</p>

        {/* MAPA */}
        <div className="mt-4">
          <img
            src="https://res.cloudinary.com/drnsgjgvm/image/upload/v1767414333/Mapa-gym_stxmyh.png"
            alt="Mapa de ubicación"
            className="img-fluid rounded"
            style={{
            width: "40rem",
            maxWidth: "100%",
          }}
          />
        </div>
      </section>
    </>



        
    );
};

export default Hero;