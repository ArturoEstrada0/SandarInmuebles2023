import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { addDoc, auth, firestore } from "../firebase/firebase"; // Asegúrate de importar 'auth' y 'firestore' desde tu archivo de configuración de Firebase
import inicioS from '../../assets/img/inicioS.svg'
import logo from '../../assets/img/logo.png'

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
import { collection } from "firebase/firestore";
import { Helmet } from "react-helmet";

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

     // Agregar registro de inicio de sesión a Firestore con formato Unix
     const loginHistoryRef = collection(firestore, "loginHistory");
     await addDoc(loginHistoryRef, {
       email: email,
       timestamp: new Date().getTime() // Obtener la marca de tiempo en formato Unix
     });
      navigate("/");
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
    <div className='fondo-cards' style={{ marginTop: '67px' }}>
      <Helmet>
        <title>Iniciar Sesión - Sandar Inmuebles</title>
        <meta
          name='description'
          content='Inicia sesión en tu cuenta de Sandar Inmuebles. Si aún no tienes una cuenta, puedes registrarte.'
        />
        <meta
          name='keywords'
          content='iniciar sesión, login, inmuebles, Sandar Inmuebles'
        />
        <meta name='author' content='Sandar Inmuebles' />
      </Helmet>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center'>
          <MDBCol col='10' md='6'>
            <img
              src={inicioS}
              className='img-fluid d-none d-md-block' // Oculta en pantallas pequeñas
              alt='Phone image'
            />
          </MDBCol>
          <MDBCol col='12'>
            <MDBCard
              className='bg-dark text-white my-5 mx-auto'
              style={{ borderRadius: '1rem', maxWidth: '400px' }}>
              <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                <Link to='/'>
                  <LeftOutlined
                    style={{
                      fontSize: '1.5rem',
                      marginRight: '320px',
                      color: 'white',
                    }}
                  />
                </Link>
                <MDBNavbar
                  expand='lg'
                  light
                  bgColor='dark'
                  className='w-100 mb-4'>
                  <MDBNavbarBrand className='align-items-center'>
                    <img
                      src={logo}
                      alt='Logo'
                      height='50'
                      className='inicio-logo'
                    />
                    <span className='text-white'>SANDAR INMUBLES</span>
                  </MDBNavbarBrand>
                </MDBNavbar>

                <h2 className='Inicio'>Inicio de Sesión</h2>

                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  labelClass='text-white'
                  label='Correo electronico'
                  onChange={(e) => setEmail(e.target.value)}
                  id='formControlEmail'
                  type='email'
                  size='lg'
                  style={{ color: 'white' }}
                />
                <MDBInput
                  wrapperClass='mb-4 mx-5 w-100'
                  labelClass='text-white'
                  label='Contraseña'
                  onKeyPress={handleKeyPress}
                  onChange={(e) => setPassword(e.target.value)}
                  id='formControlPassword'
                  type='password'
                  size='lg'
                  style={{ color: 'white' }}
                />

                <p className='small mb-3 pb-lg-2'>
                  <Link to='/olvidoContrasena' className='text-white-50'>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </p>
                <MDBBtn
                  onClick={signIn}
                  outline
                  className='mx-2 px-5'
                  color='white'
                  size='lg'>
                  Iniciar Sesión
                </MDBBtn>
                {error && (
                  <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                )}
                {successMessage && (
                  <p className='text-success'>{successMessage}</p>
                )}
                <div className='d-flex flex-row mt-3 mb-5'>
                  <MDBBtn
                    tag='a'
                    color='none'
                    className='m-3'
                    style={{ color: 'white' }}>
                    <MDBIcon fab icon='facebook-f' size='lg' />
                  </MDBBtn>

                  <MDBBtn
                    tag='a'
                    color='none'
                    className='m-3'
                    style={{ color: 'white' }}>
                    <MDBIcon fab icon='twitter' size='lg' />
                  </MDBBtn>

                  <MDBBtn
                    tag='a'
                    color='none'
                    className='m-3'
                    style={{ color: 'white' }}>
                    <MDBIcon fab icon='google' size='lg' />
                  </MDBBtn>
                </div>

                <div>
                  <p className='mb-0 text-center align-items-center'>
                    ¿No tienes una cuenta?{' '}
                    <Link to='/registro' className='Registro'>
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
  )
};

export default Login;
