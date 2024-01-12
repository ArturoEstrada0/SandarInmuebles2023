import React from 'react';
import { Menu } from 'antd';
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

const loginStyle = {
  marginLeft: 'auto',
  cursor: 'pointer',
  display: 'flex', // Alinear elementos horizontalmente
  alignItems: 'center', // Alinea los elementos verticalmente
}

const menuStyle = {
  fontSize: '16px',
};

const Header = () => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <div style={headerStyle}>
        <Link to="/">
          <div className="logo-container">
            <img src={logo} alt="Mi logotipo" style={logoStyle} />
          </div>
        </Link>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={menuStyle}>
          <Menu.Item key="1" onClick={() => handleMenuClick('/aboutUs')}>
            Nosotros
          </Menu.Item>
          <Menu.Item key="2" onClick={() => handleMenuClick('/asesores')}>
            Asesores
          </Menu.Item>
          <Menu.Item key="3" onClick={() => handleMenuClick('/contact')}>
            Contacto
          </Menu.Item>
          <Menu.Item key="4" onClick={() => handleMenuClick('/propertyList')}>
            Inmuebles
          </Menu.Item>
        </Menu>

        <Link to="/login" style={loginStyle}>
          <UserOutlined style={{ marginRight: '5px' }} />
          Iniciar Sesión
        </Link>
      </div>
    </>
  );
};

export default Header;
