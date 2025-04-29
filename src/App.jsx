import { useState, useEffect } from "react";
import appFirebase from "../src/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "../src/components/Login";
import Home from "../src/components/Home";
import "./App.css";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUsuario(usuarioFirebase); // Actualizamos el estado con el usuario
      setLoading(false); // Terminamos la carga
    });

    return () => unsubscribe(); // Limpieza del listener
  }, []);

  // Mientras estamos verificando el estado de autenticación, mostramos un loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Cargando...</span> {/* Aquí puedes poner un spinner de carga si prefieres */}
      </div>
    );
  }

  return (
    <div>
      {usuario ? <Home correoUsuario={usuario.email} /> : <Login />}
    </div>
  );
}

export default App;
