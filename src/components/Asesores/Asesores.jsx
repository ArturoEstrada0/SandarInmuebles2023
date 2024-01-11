import React from 'react';
import asesores from '../../assets/img/asesores.jpg'
import './Asesores.css'; // Asegúrate de tener un archivo de estilos para personalizar según tus necesidades

export default function Asesores() {
  return (
    <div className="asesores-container">
      <div className="image-container">
        {/* Aquí deberías poner la ruta de tu imagen */}
        <img src={asesores} alt="Imagen de asesor" />
      </div>
      <div className="text-container">
        <h4>ASESORES</h4>
        <h1>ENCUENTRA A TU ASESOR</h1>
        <p>
          Texto descriptivo o información sobre los asesores que puede ir aquí.
          Puedes agregar múltiples párrafos según sea necesario.
          Vender, rentar o comprar una propiedad es un momento sumamente importante en la vida; por eso te acercamos 
          a los asesores 
          más destacados de la industria para acompañarte en ese camino.
        </p>
        <div className='button-asesor'>
        <button>Botón</button>
        </div>
      </div>
    </div>
  );
}
