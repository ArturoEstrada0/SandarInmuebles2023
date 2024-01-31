import React, { useState, useEffect } from "react";
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
  width: "90px",
  height: "50px",
  marginTop: "-5px",
  marginRight: "10px",
};

const menuItemStyle = {
  fontSize: "16px",
  color: "white",
  marginRight: "20px",
  textDecoration: "none",
};

const activeMenuItemStyle = {
  ...menuItemStyle,
  borderBottom: "2px solid #1890ff",
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
  const { isAuthenticated, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(window.innerWidth <= 1024);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleMenuClick = (path, section) => {
    navigate(path);
    setActiveSection(section);
    setMenuOpen(false);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  useEffect(() => {
    const handleResize = () => {
      setShowToggle(window.innerWidth <= 1024);
    };
    // Agrega el event listener para cambiar el estado en función del tamaño de la pantalla
    window.addEventListener("resize", handleResize);
    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div style={headerStyle}>
                 {/* Toggle Button */}
                 {showToggle && (
            <div className={`toggle-button ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
              {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </div>
          )}
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
          to="/vender"
          style={
            activeSection === "vender" ? activeMenuItemStyle : menuItemStyle
          }
          onClick={() => handleMenuClick("/vender", "vender")}
        >
          Vender
        </Link>

        <Link
          to="/comprar"
          style={
            activeSection === "comprar" ? activeMenuItemStyle : menuItemStyle
          }
          onClick={() => handleMenuClick("/comprar", "comprar")}
        >
          Comprar
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