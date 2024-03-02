import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'

import Home from './components/Home'
import PropertyList from './components/PropertyList/PropertyList'
import AboutUs from './components/AboutUs/AboutUs'
import Vender from './components/Vender/Vender'
import Comprar from './components/Comprar/Comprar'

import Contact from './components/Contact/Contact'
import AdminPanel from './components/Admin/AdminPanel'

import Login from './components/Auth/Login'
import OlvidoContrasena from './components/Auth/OlvidoContrasena'
import Registro from './components/Auth/Registro'

import PropertyDetail from './components/PropertyDetail/PropertyDetail'

import { collection, getDoc, getDocs, doc } from 'firebase/firestore'
import { firestore } from './components/firebase/firebase'
import { AuthProvider, useAuth } from './context/AuthContext'
import Footer from './components/Footer/Footer'

function App() {
  const { isAuthenticated, user } = useAuth()
  const [propertyData, setPropertyData] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAsociado, setIsAsociado] = useState(false)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (user && user.uid) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(firestore, 'usuarios', user.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            setUserData(userDoc.data())
            setIsAdmin(userDoc.data().role === 'admin')
            setIsAsociado(userDoc.data().role === 'asociado')
          } else {
            console.error(
              'No se encontró el documento del usuario en Firestore.',
            )
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error)
        }
      }

      fetchUserData()
    }
  }, [user])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesSnapshot = await getDocs(
          collection(firestore, 'propiedades'),
        )
        const properties = propertiesSnapshot.docs.map((doc) => {
          const data = doc.data()
          const features = data.activeFeatures || {}

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
          }
        })
        setPropertyData(properties)
      } catch (error) {
        console.error('Error al obtener propiedades:', error)
      }
    }

    fetchProperties()
  }, [])

  return (
    <Router>
      <Header isAdmin={isAdmin} isAuthenticated={isAuthenticated} isAsociado={isAsociado} />
      <Routes>
        {isAuthenticated && (isAdmin || isAsociado ) && (
          <Route path='/' element={<AdminPanel />} />
        )}
        {(!isAuthenticated || !isAdmin) && (
          <>
            <Route path='/' element={<Home />} />
            <Route path='/aboutUs' element={<AboutUs />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/propertyList' element={<PropertyList />} />
            <Route
              path='/property/:id'
              element={<PropertyDetail propertyData={propertyData} />}
            />
            <Route path='/vender' element={<Vender />} />{' '}
            {/* Agrega esta línea */}
            <Route path='/comprar' element={<Comprar />} />
            <Route path='/login' element={<Login />} />
            <Route path='/olvidoContrasena' element={<OlvidoContrasena />} />
            <Route path='/registro' element={<Registro />} />
          </>
        )}
      </Routes>

      <Footer />
    </Router>
  )
}

const AppWithAuthProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
)

export default AppWithAuthProvider
