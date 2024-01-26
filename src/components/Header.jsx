import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/img/sandarlogo1.png";

const headerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  background: "#001529",
  padding: "10px",
  position: "fixed",
  top: 0,
  zIndex: 1000,
};

const logoStyle = {
  width: "90px",
  height: "50px",
  marginTop: "-5px",
  marginRight: "100px",  // Ajusta el margen derecho del logo
};

const menuItemStyle = {
  fontSize: "16px",
  color: "white",
  marginRight: "120px",  // Ajusta el margen derecho según tus preferencias
  textDecoration: "none",
};

const activeMenuItemStyle = {
  ...menuItemStyle,
  borderBottom: "2px solid #1890ff",
};

const lastMenuItemStyle = {
  ...menuItemStyle,
  marginRight: "auto",  // Hace que el último elemento llegue al final del header
};

const firstMenuItemStyle = {
  ...menuItemStyle,
  marginLeft: "80px",  // Ajusta el margen izquierdo del primer elemento
};

const loginStyle = {
  marginLeft: "auto",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "white",
  textDecoration: "none",
};

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("");

  const handleMenuClick = (path, section) => {
    navigate(path);
    setActiveSection(section);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={headerStyle}>
      <Link to="/">
        <div className="logo-container">
          <img
            src={logo}
            alt="Mi logotipo"
            style={logoStyle}
            className="logo"
          />
        </div>
      </Link>

      <Link
        to="/aboutUs"
        style={activeSection === "aboutUs" ? activeMenuItemStyle : firstMenuItemStyle}
        onClick={() => handleMenuClick("/aboutUs", "aboutUs")}
      >
        Nosotros
      </Link>

      <Link
        to="/vender"
        style={activeSection === "vender" ? activeMenuItemStyle : menuItemStyle}
        onClick={() => handleMenuClick("/vender", "vender")}
      >
        Vender
      </Link>

      <Link
        to="/comprar"
        style={activeSection === "comprar" ? activeMenuItemStyle : menuItemStyle}
        onClick={() => handleMenuClick("/comprar", "comprar")}
      >
        Comprar
      </Link>

      <Link
        to="/contact"
        style={activeSection === "contact" ? activeMenuItemStyle : menuItemStyle}
        onClick={() => handleMenuClick("/contact", "contact")}
      >
        Contacto
      </Link>

      <Link
        to="/propertyList"
        style={activeSection === "propertyList" ? lastMenuItemStyle : menuItemStyle}
        onClick={() => handleMenuClick("/propertyList", "propertyList")}
      >
        Inmuebles
      </Link>

      {isAuthenticated ? (
        <div style={loginStyle} onClick={handleLogout} role="button">
          <LogoutOutlined style={{ marginRight: "5px" }} />
          Cerrar Sesión
        </div>
      ) : (
        <Link to="/login" style={loginStyle}>
          <UserOutlined style={{ marginRight: "5px" }} />
          Iniciar Sesión
        </Link>
      )}
    </div>
  );
};

export default Header;
