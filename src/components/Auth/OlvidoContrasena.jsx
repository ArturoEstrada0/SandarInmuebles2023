import React, { useState } from "react";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import './Olvidocontrasena.css'

const OlvidoContrasena = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOlvidoContrasenaSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Se ha enviado un enlace de restablecimiento a ${email}.`);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al enviar el enlace de restablecimiento:", error);
      setErrorMessage("Error al enviar el enlace de restablecimiento. Verifica la dirección de correo electrónico e inténtalo de nuevo.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="fondo">
    <div className="olvido-contrasena-container">
      <form className=".olvido-contrasena-container form" onSubmit={handleOlvidoContrasenaSubmit}>
        <p style={{color: 'black'}}>Para recuperar tu contraseña, ingresa aquí tu correo electronico y recibe el enlace.</p>
        <label className="label-oc" htmlFor="email">Correo electrónico:</label>
        <input
        className="input-oc"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="button-oc" type="submit">Enviar enlace de restablecimiento</button>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    </div>
  );
};

export default OlvidoContrasena;
