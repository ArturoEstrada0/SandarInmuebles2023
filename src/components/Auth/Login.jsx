import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; // Importa auth desde '../firebase/firebase'
import checkUserRole from './authHelpers'; // Importa la función



function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      const role = await checkUserRole(); // Utiliza la función checkUserRole
      navigate(role === 'admin' ? '/admin' : '/client');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
    }
  }



  return (
    <div>
      <h1>Iniciar sesión</h1>
      <input
        type="text"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}

export default Login;
