import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { LeftOutlined } from "@ant-design/icons";

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
} from "mdb-react-ui-kit";

import "./Login.css";

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  // Agrega tus criterios de validación de contraseña aquí
  return password.length >= 6; // Por ejemplo, una longitud mínima de 6 caracteres
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado

  const auth = getAuth(); // Asegúrate de tener la instancia de autenticación de Firebase

  const signIn = async () => {
    setError("");
    setSuccessMessage(""); // Limpia el mensaje de éxito
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage("Inicio de sesión exitoso"); // Establece el mensaje de éxito
      navigate('/');

    } catch (error) {
      setError("Error al ingresar, intente de nuevo");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      signIn();
    }
  };

  return (
    <div className="fondo-cards"   style={{ marginTop: '67px' }}
    >
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="6">
            <img
              src="src/assets/img/inicioS.svg"
              class="img-fluid"
              alt="Phone image"
            />
          </MDBCol>
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                  <Link to="/">
                    <LeftOutlined
                      style={{
                        fontSize: "1.5rem",
                        marginRight: "350px",
                        color: "white",
                      }}
                    />
                  </Link>
                <MDBNavbar
                  expand="lg"
                  light
                  bgColor="dark"
                  className="w-100 mb-4"
                >
                  <MDBNavbarBrand className="d-flex align-items-center">
                    <img
                      src="src/assets/img/logo.png"
                      alt="Logo"
                      height="50"
                      className="d-inline-block align-text-top"
                    />
                    <span className="ms-2 fs-5 text-white">
                      SANDAR INMUBLES
                    </span>
                  </MDBNavbarBrand>
                </MDBNavbar>

                <h2 className="fw-bold mb-2">Inicio de Sesión</h2>

                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Correo electronico"
                  onChange={(e) => setEmail(e.target.value)}
                  id="formControlEmail"
                  type="email"
                  size="lg"
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Contraseña"
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setPassword(e.target.value)}
                  id="formControlPassword"
                  type="password"
                  size="lg"
                />

                <p className="small mb-3 pb-lg-2">
                  <Link to="/olvidoContrasena" className="text-white-50">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </p>
                <MDBBtn
                  onClick={signIn}
                  outline
                  className="mx-2 px-5"
                  color="white"
                  size="lg"
                >
                  Iniciar Sesión
                </MDBBtn>
                {error && (
                  <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                )}
                {successMessage && (
                  <p className="text-success">{successMessage}</p>
                )}
                <div className="d-flex flex-row mt-3 mb-5">
                  <MDBBtn
                    tag="a"
                    color="none"
                    className="m-3"
                    style={{ color: "white" }}
                  >
                    <MDBIcon fab icon="facebook-f" size="lg" />
                  </MDBBtn>

                  <MDBBtn
                    tag="a"
                    color="none"
                    className="m-3"
                    style={{ color: "white" }}
                  >
                    <MDBIcon fab icon="twitter" size="lg" />
                  </MDBBtn>

                  <MDBBtn
                    tag="a"
                    color="none"
                    className="m-3"
                    style={{ color: "white" }}
                  >
                    <MDBIcon fab icon="google" size="lg" />
                  </MDBBtn>
                </div>

                <div>
                  <p className="mb-0">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/registro" className="text-white-50 fw-bold">
                      Regístrate
                    </Link>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Login;
