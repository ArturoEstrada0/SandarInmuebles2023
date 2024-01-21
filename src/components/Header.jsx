import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

import './Header.css'
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
  justifyContent: "space-between", // Nueva propiedad para centrar los elementos y agregar espacio entre ellos

};

const logoStyle = {
  width: "170px",
  height: "75px",
  marginTop: "-5px",
  marginRight: "10px",
};

const menuItemStyle = {
  fontSize: "16px",
  color: "white",
  marginRight: "90px", // Ajuste en el margen derecho
  textDecoration: "none",
};

const activeMenuItemStyle = {
  ...menuItemStyle,
  borderBottom: "2px solid #1890ff",
};

const loginStyle = {
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (path, section) => {
    navigate(path);
    setActiveSection(section);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div style={headerStyle}>
          {/* Toggle Button */}
          <div className="toggle-button" onClick={toggleMenu}>
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </div>

          {/* Logo */}
          <Link to="/">
            <img
              src={logo}
              alt="Mi logotipo"
              style={logoStyle}
              className="logo"
            />
          </Link>

          {/* Navigation Links */}
          <div className={`menu-links ${menuOpen ? "open" : ""}`}>
            <Link
              to="/aboutUs"
              style={
                activeSection === "aboutUs" ? activeMenuItemStyle : menuItemStyle
              }
              onClick={() => handleMenuClick("/aboutUs", "aboutUs")}
            >
              Nosotros
            </Link>

            <Link
              to="/asesores"
              style={
                activeSection === "asesores" ? activeMenuItemStyle : menuItemStyle
              }
              onClick={() => handleMenuClick("/asesores", "asesores")}
            >
              Asesores
            </Link>
            <Link
              to="/contact"
              style={
                activeSection === "contact" ? activeMenuItemStyle : menuItemStyle
              }
              onClick={() => handleMenuClick("/contact", "contact")}
            >
              Contacto
            </Link>
            <Link
              to="/propertyList"
              style={
                activeSection === "propertyList"
                  ? activeMenuItemStyle
                  : menuItemStyle
              }
              onClick={() => handleMenuClick("/propertyList", "propertyList")}
            >
              Inmuebles
            </Link>
          </div>

          {/* Login/Logout */}
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
    </>
  );
};

export default Header;
