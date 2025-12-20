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
        <section
        className='hero-container'
        style={{backgroundImage: `url(${heroImage})` }}
        aria-label='Imagen de la sede del gimnasio'
        >
        <div className='hero-cover'></div>    
        <div className='hero-content'>
            <h1 className='hero-title'>Nuestra Sede</h1>
        </div>
        </section>
    );
    };

export default Hero;