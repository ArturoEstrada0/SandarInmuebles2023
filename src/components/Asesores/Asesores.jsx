import React from 'react';
import { Layout, Typography, Row, Col, Statistic, Divider } from 'antd';
import asesores from '../../assets/img/asesores.jpg'
import './Asesores.css'; // Asegúrate de tener un archivo de estilos para personalizar según tus necesidades

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function Asesores() {
  return (
    <Content style={{backgroundColor: "#ffff"}}>
    <div className="asesores-container">
      <div className="image-container">
        {/* Aquí deberías poner la ruta de tu imagen */}
        <img src={asesores} alt="Imagen de asesor" />
      </div>
      <div className="text-container">
        {/*<h4>ASESORES</h4>*/}
        <Title level={2} className="asesor-title">
          Encuentra a tu Asesor
          </Title>
        <p>
          Texto descriptivo o información sobre los asesores que puede ir aquí.
          Puedes agregar múltiples párrafos según sea necesario.
          Vender, rentar o comprar una propiedad es un momento sumamente importante en la vida; por eso te acercamos 
          a los asesores 
          más destacados de la industria para acompañarte en ese camino.
        </p>
        <Divider/>
        <div className='button-asesor'>
        <button>Contactar</button>
        </div>
      </div>
    </div>
    </Content>
  );
}
