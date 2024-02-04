import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo2.png';
import texto from '../../assets/img/sandarcom.png';

const { Footer: AntFooter } = Layout;

function Footer() {
  return (
    <AntFooter style={{ backgroundColor: '#001529' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <img src={logo} alt="Mi logotipo" style={{ width: '120px', height: '85px', marginBottom: '15px', marginTop: '-10px' }} />
        <img src={texto} alt="Mi logotipo" style={{ width: '120px', height: '85px', marginBottom: '15px', marginTop: '-10px', marginLeft: '-15px' }} />
        <p style={{ color: '#f0f2f5', textAlign: 'center', marginTop: '0', marginBottom: '20px' }}>Descubre tu hogar ideal con nosotros.
          Nuestro compromiso es ayudarte a encontrar la propiedad que siempre has soñado.
          Contáctanos hoy y deja que hagamos realidad tus sueños inmobiliarios.</p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" style={linkStyle} target="_self">Inicio</Link>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>          
          <Link to="/aboutUs" style={linkStyle}>Nosotros</Link>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <Link to="/vender" style={linkStyle}>Vender</Link>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <Link to="/comprar" style={linkStyle}>Comprar</Link>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <Link to="/contact" style={linkStyle}>Contacto</Link>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <Link to="/propertyList" style={linkStyle}>Inmuebles</Link>
        </div>
        <hr style={{ margin: '20px 0', borderColor: '#ccc' }} />
        <p style={{ color: 'gray' }}>Copyright 2023 © Todos los Derechos Reservados del Diseño por Imagine Codes</p>
      </div>
    </AntFooter>
  );
}

const linkStyle = {
  color: '#FFD700',
  cursor: 'pointer',
  textDecoration: 'none',
  padding: '5px',
};

export default Footer;
