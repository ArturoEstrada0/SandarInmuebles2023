import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

// Función para verificar el rol del usuario
const checkUserRole = async () => {
  try {
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });

    if (user) {
      // Si el usuario está autenticado, busca el documento de usuario en Firestore
      const userDocRef = doc(firestore, 'Usuarios', user.uid); // Cambia 'user.uid' según tu estructura de datos
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData && userData.role) {
          // Devuelve el rol del usuario desde Firestore
          return userData.role;
        }
      }

      // Si no se encontró el rol o el documento, el usuario no tiene un rol asignado.
      return null;
    } else {
      // El usuario no está autenticado, por lo que no tiene ningún rol asignado.
      return null;
    }
  } catch (error) {
    console.error('Error al verificar el rol del usuario:', error);
    return null;
  }
};

export default checkUserRole;
