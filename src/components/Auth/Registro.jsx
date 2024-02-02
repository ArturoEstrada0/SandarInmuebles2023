import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBCol,
  MDBNavbar,
  MDBNavbarBrand,
} from "mdb-react-ui-kit";

import "./Login.css";

const Registro = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [registrationDate, setRegistrationDate] = useState(0); // Nuevo estado para la fecha de registro


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const authInstance = getAuth();
  const firestore = getFirestore();

  const checkIfEmailExists = async (email) => {
    const usersRef = collection(firestore, "usuarios");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const register = async () => {
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!phone) {
      setError("Por favor, ingrese un número de teléfono.");
      return;
    }

    try {
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        setError("El correo electrónico ya está registrado.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
        role: role,
      });
      const timestamp = new Date().getTime(); // Definir timestamp antes de su uso

      const usersCollection = collection(firestore, "usuarios");
      const userDocRef = doc(usersCollection, user.uid);

      await setDoc(userDocRef, {
        uid: user.uid,
        name: name,
        email: email,
        phone: phone,
        registrationDate: timestamp, // timestamp es un número de marca de tiempo UNIX

      });

      setSuccessMessage("Registro exitoso. ¡Bienvenido!");
    } catch (error) {
      console.error("Error al registrar:", error);
      setError("Error al registrar, intente de nuevo");
    }
  };

  return (
    <div className="fondo-cards" style={{ marginTop: "65px" }}>
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center vh-100"
      >
        <MDBCol col="12" md="6" className="order-md-2 mt-5">
          <MDBCard
            className="bg-dark text-white my-5 mx-auto"
            style={{ borderRadius: "1rem", maxWidth: "400px" }}
          >
            <MDBCardBody className="p-5 d-flex flex-column align-items-center">
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
                  <span className="ms-2 fs-5 text-white">SANDAR INMUBLES</span>
                </MDBNavbarBrand>
              </MDBNavbar>

              <h2 className="fw-bold mb-2">Registro de Sesión</h2>

              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                inputClass="text-white" // Aquí se define el color del texto
                label="Nombre"
                size="lg"
                id="form1"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ color: "white" }}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                inputClass="text-white" // Aquí se define el color del texto
                label="Correo Electrónico"
                size="lg"
                id="form2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ color: "white" }}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                inputClass="text-white" // Aquí se define el color del texto
                label="Contraseña"
                size="lg"
                id="form3"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ color: "white" }}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                inputClass="text-white" // Aquí se define el color del texto
                label="Confirmar Contraseña"
                size="lg"
                id="form4"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ color: "white" }}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                labelClass="text-white"
                inputClass="white" // Aquí se define el color del texto
                label="Teléfono"
                size="lg"
                id="form6"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ color: "white" }}
              />

              <div className="d-flex flex-row justify-content-center mb-4">
                <MDBCheckbox
                  name="flexCheck"
                  id="flexCheckDefault"
                  label="Acepto todos los términos del servicio"
                />
              </div>
              <MDBBtn
                outline
                className="mx-2 px-5"
                color="white"
                size="lg"
                onClick={register}
              >
                Registrar
              </MDBBtn>
              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}
              {successMessage && (
                <p style={{ color: "green", marginTop: "10px" }}>
                  {successMessage}
                </p>
              )}
              <div>
                <p className="mb-0">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/login" className="text-white-50 fw-bold">
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol col="12" md="6" className="order-md-1">
          <img
            src="src/assets/img/registro.svg"
            className="img-fluid"
            alt="Phone image"
          />
        </MDBCol>
      </MDBContainer>
    </div>
  );
};

export default Registro;
