import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

const headerStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  background: '#001529', // Puedes cambiar este color al que desees
  padding: '10px', // Puedes ajustar el espaciado según tus preferencias
  position: 'fixed', // Hace que el header sea fijo en la parte superior
  top: 0, // Asegura que el header esté en la parte superior de la pantalla
  zIndex: 1000, // Ajusta el z-index para que el header esté encima de otros elementos
};

const logoStyle = {
  width: '60px',
  height: '50px',
  marginTop: '-5px',
  marginRight: '10px',
};

const menuStyle = {
  fontSize: '18px', // Ajusta el tamaño de la letra del menú según tus preferencias
};

export default function Header() {
  return (
    <>
      <div style={headerStyle}>
        <div className="logo-container">
          <img src={logo} alt="Mi logotipo" style={logoStyle} />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={menuStyle}>
          <Menu.Item key="1">
            <Link to="/nosotros">Nosotros</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/contacto">Contacto</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/inmuebles">Inmuebles</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/testimonios">Testimonios</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/login">Iniciar Sesión</Link>
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
}
