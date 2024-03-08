import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

import './Header.css'
import logo from "../assets/img/logo2.png";
import texto from "../assets/img/sandarcom.png"

const Header = ({ isAdmin, isAsociado } ) => {
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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
<div style={headerStyle} className="header-div">
        {showToggle && (
          <div className={`toggle-button ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </div>
        )}
        <Link to="/">
          <img src={logo} alt="Mi logotipo" style={logoStyle} className="logo" />
          <img src={texto} alt="Mi logotipo" style={logoStyle} className="logo" />
        </Link>
        <div className={`menu-links ${menuOpen ? "open" : ""}`}>
        {!isAdmin && !isAsociado && (
            <>
          <Link
            to="/aboutUs"
            style={activeSection === "aboutUs" ? activeMenuItemStyle : menuItemStyle}
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
            style={activeSection === "propertyList" ? activeMenuItemStyle : menuItemStyle}
            onClick={() => handleMenuClick("/propertyList", "propertyList")}
          >
            Inmuebles
          </Link>
          </>
          )}
        </div>
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

const headerStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  background: "#001529",
  padding: "10px",
  position: "fixed",
  top: 0,
  zIndex: 1000,
  justifyContent: "space-between",
};

const logoStyle = {
  width: "90px",
  height: "50px",
  marginTop: "-5px",
  marginRight: "0",
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
