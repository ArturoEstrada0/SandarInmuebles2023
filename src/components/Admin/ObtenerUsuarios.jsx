import { firestore } from '../firebase/firebase';  // Asegúrate de importar la instancia correcta de firestore

const obtenerUsuarios = async () => {
  const usuariosCollection = firestore.collection('usuarios');

  try {
    const querySnapshot = await getDocs(usuariosCollection);
    
    const usuarios = [];
    querySnapshot.forEach((doc) => {
      usuarios.push({ id: doc.id, ...doc.data() });
    });

    return usuarios;
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    // Puedes manejar el error según tus necesidades
    return [];
  }
};

export default obtenerUsuarios;
