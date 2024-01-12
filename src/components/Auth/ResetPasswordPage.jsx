// ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from './api'; // Asegúrate de ajustar la ruta correcta

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    try {
      await resetPassword(token, password);
      console.log('Contraseña restablecida con éxito');
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error.message);
    }
  };

  return (
    <form onSubmit={handleResetPasswordSubmit}>
      <label htmlFor="password">Nueva Contraseña:</label>
      {/* ... Resto del código de tu formulario */}
      <button type="submit">Restablecer Contraseña</button>
    </form>
  );
};

export default ResetPasswordPage;
