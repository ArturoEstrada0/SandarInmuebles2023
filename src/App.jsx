import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
// Importa tus componentes
import Home from "./components/Home";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ClientDashboard from "./components/Client/ClientDashboard";
import PropertyDetail from "./components/PropertyDetail/PropertyDetail";
import PropertyList from "./components/PropertyList/PropertyList";
import AdminPanel from "./components/Admin/AdminPanel";
import Login from "./components/Auth/Login";
import OlvidoContrasena from "./components/Auth/OlvidoContrasena";
import Registro from "./components/Auth/Registro";


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
  return (
    <Router>

      {/* <AdminPanel /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Agrega la ruta de inicio de sesión */}

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
        <Route exact path="/" element={<PropertyList />} />
        <Route path="/property/:id" element={<PropertyDetail />} />

        <Route exact path="/login" element={<Login />} />
        <Route path="/olvidoContrasena" element={<OlvidoContrasena />} />
        <Route path="/registro" element={<Registro />} />


      </Routes>
    </Router>
  );
}

export default App;
