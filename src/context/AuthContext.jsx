import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const auth = getAuth(); // Asegúrate de tener la instancia de autenticación de Firebase

  useEffect(() => {
    // Escucha los cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
    });

    // Limpia la suscripción al desmontar el componente
    return () => unsubscribe();
  }, [auth]);

  const updateUserContext = () => {
    // Puedes agregar más lógica aquí según tus necesidades
    // Por ejemplo, cargar más información del usuario desde Firebase
  };

  const contextValue = {
    user,
    isAuthenticated,
    updateUserContext,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
