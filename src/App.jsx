import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout, Spin } from "antd";
import "./App.css";
import Home from "./components/Home";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ClientDashboard from "./components/Client/ClientDashboard";
import PropertyDetail from "./components/PropertyDetail/PropertyDetail";
import PropertyList from "./components/PropertyList/PropertyList";
import AdminPanel from "./components/Admin/AdminPanel";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./components/firebase/firebase";
import Login from "./components/Auth/Login";
import OlvidoContrasena from "./components/Auth/OlvidoContrasena";
import Registro from "./components/Auth/Registro";

const { Content } = Layout;

// Crea una función que verifica el rol del usuario
const checkUserRole = () => {
  // Implementa la lógica para determinar el rol del usuario
  // Devuelve 'admin' o 'client' según corresponda.
};

// Rutas protegidas
function AdminRoute({ children }) {
  if (checkUserRole() === "admin") {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

function ClientRoute({ children }) {
  if (checkUserRole() === "client") {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

function App() {
  const [propertyData, setPropertyData] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesSnapshot = await getDocs(
          collection(firestore, "propiedades")
        );
        const properties = propertiesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const features = data.activeFeatures || {};

          return {
            id: doc.id,
            type: data.nombre,
            price: data.precio,
            state: data.ubicacion,
            city: data.ubicacion,
            rooms: features.Habitaciones || 0,
            bathrooms: features.Baño || 0,
            area: features.Tamaño || 0,
            image: data.fotos[0],
            // Agrega cualquier propiedad adicional según tu estructura
            // activeFeatures: data.activeFeatures,
          };
        });
        setPropertyData(properties);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Router>
      {/* <AdminPanel /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route path="/olvidoContrasena" element={<OlvidoContrasena />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/client"
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          }
        />
        <Route
          exact
          path="/"
          element={<PropertyList propertyData={propertyData} />}
        />
        <Route
          path="/property/:id"
          element={<PropertyDetail propertyData={propertyData} />}
        />
      </Routes>
    </Router>
  );
}

export default App;