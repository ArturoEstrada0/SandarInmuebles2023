import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const GoogleB = () => {
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

  const [user] = useAuthState(auth);

  return (
    <div>
      {user ? (
        <p>Bienvenido, {user.displayName}!</p>
      ) : (
        <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>
      )}
    </div>
  );
};

export default GoogleB;
