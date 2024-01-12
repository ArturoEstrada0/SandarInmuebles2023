// api.js
export const sendResetPasswordEmail = async (email) => {
  const token = generateUniqueToken();
  await sendEmail(email, token);
  return token;
};

export const resetPassword = async (token, newPassword) => {
  // Lógica para restablecer la contraseña en el servidor
  const response = await fetch('URL_DE_TU_API/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    throw new Error('Error al restablecer la contraseña');
  }
};
