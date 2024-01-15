import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { UserOutlined } from '@ant-design/icons';

const headerStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  background: '#001529',
  padding: '10px',
  position: 'fixed',
  top: 0,
  zIndex: 1000,
};

const logoStyle = {
  width: '60px',
  height: '50px',
  marginTop: '-5px',
  marginRight: '10px',
};

const menuItemStyle = {
  fontSize: '16px',
  color: 'white',
  marginRight: '20px',
  textDecoration: 'none',
};

const activeMenuItemStyle = {
  ...menuItemStyle,
  borderBottom: '2px solid #1890ff', // Cambia el color de la línea inferior al color deseado
};

const loginStyle = {
  marginLeft: 'auto',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  textDecoration: 'none',
};

const Header = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  const handleMenuClick = (path, section) => {
    navigate(path);
    setActiveSection(section);
  };

  return (
    <>
      <div style={headerStyle}>
        <Link to="/">
          <div className="logo-container">
          <img src={logo} alt="Mi logotipo" style={logoStyle} className="logo" />
          </div>
        </Link>

        <Link
          to="/aboutUs"
          style={activeSection === 'aboutUs' ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleMenuClick('/aboutUs', 'aboutUs')}
        >
          Nosotros
        </Link>

        <Link
          to="/testimonials"
          style={activeSection === 'testimonials' ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleMenuClick('/testimonials', 'testimonials')}
        >
          Testimonios
        </Link>

        <Link
          to="/asesores"
          style={activeSection === 'asesores' ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleMenuClick('/asesores', 'asesores')}
        >
          Asesores
        </Link>

        <Link
          to="/contact"
          style={activeSection === 'contact' ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleMenuClick('/contact', 'contact')}
        >
          Contacto
        </Link>

        <Link
          to="/propertyList"
          style={activeSection === 'propertyList' ? activeMenuItemStyle : menuItemStyle}
          onClick={() => handleMenuClick('/propertyList', 'propertyList')}
        >
          Inmuebles
        </Link>

        <Link to="/login" style={loginStyle}>
          <UserOutlined style={{ marginRight: '5px' }} />
          Iniciar Sesión
        </Link>
      </div>
    </>
  );
};

export default Header;
