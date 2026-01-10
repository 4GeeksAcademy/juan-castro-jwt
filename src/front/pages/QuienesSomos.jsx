import React from "react";
import "./QuienesSomos.css";



const QuienesSomos = ()=>{
    return (
    <section className="quienes-container">
      {/* TÍTULO */}
      <h1 className="quienes-title">Quiénes Somos</h1>

      {/* MISIÓN */}
      <div className="info-block">
        <h2 className="info-title">Misión</h2>
        <p className="info-text">
          Brindar un espacio integral de bienestar físico y mental, promoviendo
          hábitos saludables a través del ejercicio, la disciplina y el
          acompañamiento profesional.
        </p>
      </div>

      {/* VISIÓN */}
      
      <div className="info-block">
        <h2 className="info-title">Visión</h2>
        <p className="info-text">
          Ser un gimnasio referente en la comunidad, reconocido por su enfoque
          humano, inclusivo y comprometido con la transformación positiva de
          nuestros miembros.
        </p>
      </div>

      {/* STAFF */}
      <div className="staff-section">
        <h2 className="info-title text-center">Nuestro Staff</h2>

        <div className="staff-carousel">
          {/* CARD 1 */}
          <div className="staff-card">
            <img
              src="https://res.cloudinary.com/drnsgjgvm/image/upload/v1767840026/Dise%C3%B1o_sin_t%C3%ADtulo_6_ld0cch.png"
              alt="Administrador"
            />
            <p>Administrador</p>
          </div>

          {/* CARD 2 */}
          <div className="staff-card">
            <img
              src="https://res.cloudinary.com/drnsgjgvm/image/upload/v1767839924/Dise%C3%B1o_sin_t%C3%ADtulo_4_oiqxb5.png"
              alt="Nutricionista"
            />
            <p>Nutricionista</p>
          </div>

          {/* CARD 3 */}
          <div className="staff-card">
            <img
              src="https://res.cloudinary.com/drnsgjgvm/image/upload/v1767840147/Dise%C3%B1o_sin_t%C3%ADtulo_5_c2j0pn.png"
              alt="trainer"
            />
            <p>Trainer</p>
          </div>

          {/* CARD 4 */}
          <div className="staff-card">
            <img
              src="https://res.cloudinary.com/drnsgjgvm/image/upload/v1767839855/Dise%C3%B1o_sin_t%C3%ADtulo_3_hooakj.png"
              alt="Trainer 4"
            />
            <p>Trainer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

  

export default QuienesSomos;



