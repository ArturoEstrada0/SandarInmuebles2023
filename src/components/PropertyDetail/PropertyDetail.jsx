/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Gallery from './Gallery'
import ContactForm from './ContactForm'
import Footer from '../Footer/Footer'
import {
  Grid,
  Row,
  Col,
  Typography,
  message,
  Card,
  Spin,
  Button,
  Carousel,
} from 'antd'
import { SafetyCertificateTwoTone } from '@ant-design/icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBath,
  faBed,
  faSwimmingPool,
  faMountain,
  faCar,
  faTree,
  faUtensils,
  faBell,
  faVideo,
  faVolumeUp,
  faTshirt,
  faBox,
  faFire,
  faSnowflake,
  faCouch,
  faPaw,
  faBinoculars,
  faDumbbell,
  faGlassCheers,
  faChess,
  faWater,
  faCity,
  faHome,
  faHouseFlag,
} from '@fortawesome/free-solid-svg-icons'

import axios from 'axios'

import { useParams } from 'react-router-dom'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import './PropertyDetail.css'
import Map from '../Map/Map'

import { firestore } from '../firebase/firebase'
import logo from '../../assets/img/logo.png'

const { Title } = Typography
const { useBreakpoint } = Grid

const styleLi = {
  color: '#1677FF',
  fontWeight: 'normal',
  marginRight: '10px',
}

const PropertyDetail = () => {
  const [isTextShown, setIsTextShown] = useState(false)

  const { id } = useParams()
  const [propertyDetails, setPropertyDetails] = useState(null)
  const [activeKey, setActiveKey] = useState('Habitaciones')
  const [youtubeVideoCode, setYoutubeVideoCode] = useState('')
  const [ubicacionCoords, setUbicacionCoords] = useState(null)

  const screens = useBreakpoint()

  const onCollapseChange = (key) => {
    setActiveKey(activeKey === key ? '' : key)
  }

  useEffect(() => {
    getPropertyDataFromFirebase()
  }, [id])

  const getPropertyDataFromFirebase = async () => {
    try {
      const propertyDocRef = doc(firestore, 'propiedades', id)
      const propertyDocSnapshot = await getDoc(propertyDocRef)

      if (propertyDocSnapshot.exists()) {
        const propertyData = propertyDocSnapshot.data()
        setPropertyDetails(propertyData)
        // Extrae el código del video de la URL de YouTube
        const videoCode = extractYoutubeVideoCode(propertyData.youtubeUrl)
        setYoutubeVideoCode(videoCode)
      } else {
        console.error(
          'No se encontró la propiedad con el ID proporcionado en Firebase.',
        )
      }
    } catch (error) {
      console.error('Error al obtener datos de Firestore:', error)
    }
  }

  useEffect(() => {
    if (propertyDetails && propertyDetails.ubicacion) {
      // Llama a la función de conversión con la dirección obtenida desde Firebase
      convertirDireccionACoordenadas(propertyDetails.ubicacion)
    }
  }, [propertyDetails])

  const convertirDireccionACoordenadas = async (direccion) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${direccion}`,
      )

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0]
        setUbicacionCoords([parseFloat(lat), parseFloat(lon)])
      }
    } catch (error) {
      console.error('Error al obtener coordenadas:', error)
    }
  }

  // Función para extraer el código del video de YouTube
  const extractYoutubeVideoCode = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?/\s]{11})/,
    )
    return match && match[1]
  }

  const handleContactFormSubmit = async (values, resetForm) => {
    try {
      const contactCollection = collection(firestore, 'msgpro')

      const contactDataWithPropertyInfo = {
        ...values,
        propertyId: id,
        propertyName: propertyDetails.nombre,
        propertyLocation: propertyDetails.ubicacion,
      }

      await addDoc(contactCollection, contactDataWithPropertyInfo)
      message.success('¡Tu mensaje ha sido enviado con éxito!')
      resetForm()
    } catch (error) {
      console.error('Error al enviar datos a Firestore:', error)
      message.error(
        'Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente.',
      )
    }
  }

  if (!propertyDetails) {
    return <Spin tip='Cargando...' />
  }

  const details = [
    { key: 'habitaciones', label: 'Habitaciones' },
    { key: 'baños', label: 'Baños' },
    { key: 'medio Baño', label: 'Medios Baños' },
    { key: 'metrosConstruidos', label: 'Construcción' },
    { key: 'estacionamiento', label: 'Estacionamientos' },
  ]

  const getIcon = (key) => {
    const iconMapping = {
      'Aire acondicionado': (
        <FontAwesomeIcon icon={faSnowflake} style={styleLi} />
      ),
      Alarma: <FontAwesomeIcon icon={faBell} style={styleLi} />,
      Amueblado: <FontAwesomeIcon icon={faCouch} style={styleLi} />,
      Baño: <FontAwesomeIcon icon={faBath} style={styleLi} />,
      'Medio Baño': <FontAwesomeIcon icon={faBath} style={styleLi} />,
      Bodega: <FontAwesomeIcon icon={faBox} style={styleLi} />,
      'Cámaras de seguridad': (
        <FontAwesomeIcon icon={faVideo} style={styleLi} />
      ),
      Cochera: <FontAwesomeIcon icon={faCar} style={styleLi} />,
      Estacionamiento: <FontAwesomeIcon icon={faCar} style={styleLi} />,
      Cocina: <FontAwesomeIcon icon={faUtensils} style={styleLi} />,
      Gimnasio: <FontAwesomeIcon icon={faDumbbell} style={styleLi} />,
      Habitaciones: <FontAwesomeIcon icon={faBed} style={styleLi} />,
      Jardín: <FontAwesomeIcon icon={faTree} style={styleLi} />,
      'Mascotas permitidas': <FontAwesomeIcon icon={faPaw} style={styleLi} />,
      Piscina: <FontAwesomeIcon icon={faSwimmingPool} style={styleLi} />,
      'Salón de eventos': (
        <FontAwesomeIcon icon={faGlassCheers} style={styleLi} />
      ),
      'Sistema de sonido': (
        <FontAwesomeIcon icon={faVolumeUp} style={styleLi} />
      ),
      Terraza: <FontAwesomeIcon icon={faHouseFlag} style={styleLi} />,
      Vestidor: <FontAwesomeIcon icon={faTshirt} style={styleLi} />,
      'Vista a la ciudad': <FontAwesomeIcon icon={faCity} style={styleLi} />,
      'Vista a la montaña': (
        <FontAwesomeIcon icon={faMountain} style={styleLi} />
      ),
      'Vista al mar': <FontAwesomeIcon icon={faWater} style={styleLi} />,
      'Vista panorámica': (
        <FontAwesomeIcon icon={faBinoculars} style={styleLi} />
      ),
      'Área de juegos': <FontAwesomeIcon icon={faChess} style={styleLi} />,
      Ático: <FontAwesomeIcon icon={faHome} style={styleLi} />,
      Chimenea: <FontAwesomeIcon icon={faFire} style={styleLi} />,
    }

    return iconMapping[key] || null
  }

  const formatLabel = (key) => {
    return key.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
  }

  function isInterior(key) {
    const interiorKeys = [
      'Baño',
      'Habitaciones',
      'Vestidor',
      'Medio Baño',
      'Área de juegos',
      'Chimenea',
      'Cocina',
      'Ático',
      'Alarma',
      'Bodega',
      'Mascotas permitidas',
      'Salón de eventos',
      'Amueblado',
      'Aire acondicionado',
    ]

    if (interiorKeys.includes(key)) {
      return true
    }

    return false
  }

  const keysToCheck = [
    'Alarma',
    'Aire acondicionado',
    'Cámaras de seguridad',
    'Gimnasio',
  ]

  const hasInfo = keysToCheck.some((key) => propertyDetails.cardsActivadas[key])

  console.log(hasInfo)

  return (
    <div className='property-detail'>
      <>
        {propertyDetails &&
          propertyDetails.fotos &&
          propertyDetails.fotos.length > 0 &&
          (screens.lg ? (
            <Gallery
              images={propertyDetails.fotos.map((foto) => ({
                url: foto,
                width: '2500',
                height: '1600',
              }))}
            />
          ) : (
            <Carousel>
              {propertyDetails.fotos.map((foto, index) => (
                <div key={index}>
                  <img src={foto} alt={`foto-${index}`} />
                </div>
              ))}
            </Carousel>
          ))}
      </>
      <div className='body-property'>
        <div className='detail-content'>
          <h2
            className='title-main'
            style={{ fontFamily: 'Geometos', fontSize: '2em' }}>
            {propertyDetails.nombre}
          </h2>
          <h4
            className='subtitle-main'
            style={{ fontFamily: 'Geometos', fontSize: '1.1em' }}>
            {propertyDetails.ubicacion}
          </h4>
          <hr />

          <Col span={24}>
            <div style={{ marginBottom: '20px' }}>
              <h3 className='subtitle-section'>Detalles de la propiedad</h3>
              <Row gutter={[16, 16]}>
                {details.map((detail, index) => (
                  <Col key={index} xl={4}>
                    <Card
                      hoverable
                      title={detail.label}
                      size='small'
                      style={{
                        borderRadius: '5px',
                        backgroundColor: '#f5f5f5',
                        minHeight: '80px',
                        padding: '4px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Title level={3} style={{ color: '#1890ff' }}>
                        {propertyDetails[detail.key] || 0}
                      </Title>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>

          <div className='list-info'>
            <h3 className='subtitle-section'>Información del inmueble</h3>
            <ul>
              {Object.entries(propertyDetails.cardsActivadas)
                .filter(([value]) => value)
                .map(([key]) => (
                  <Col span={12} key={key}>
                    <li>
                      {getIcon(key)}
                      {formatLabel(key)}
                    </li>
                  </Col>
                ))}
            </ul>
            <hr />
            <h3 className='subtitle-section'>Descripción</h3>
            <p>
              {isTextShown
                ? propertyDetails.descripcion
                : `${propertyDetails.descripcion.substring(0, 600)}${
                    propertyDetails.descripcion.length > 600 ? '...' : ''
                  }`}
            </p>
            {propertyDetails.descripcion.length > 600 && (
              <button
                onClick={() => setIsTextShown(!isTextShown)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#1677FF',
                  padding: '0',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  outline: 'none',
                }}>
                {isTextShown ? 'Ver menos \u25B2' : 'Ver más \u25BC'}
              </button>
            )}
            <hr />
            {youtubeVideoCode && (
              <>
                <div
                  style={{
                    marginTop: '20px',
                    marginBottom: '20px',
                    width: '85%',
                    margin: '0 auto',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}>
                  <iframe
                    width='100%'
                    height='325'
                    src={`https://www.youtube.com/embed/${youtubeVideoCode}?controls=1&showinfo=0&fs=1`}
                    title='YouTube Video'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    style={{ borderRadius: '8px' }}></iframe>
                  <hr />
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p
                      style={{
                        fontSize: '16px',
                        color: '#333',
                        fontFamily: 'Geometos',
                      }}>
                      {propertyDetails.nombre +
                        ' $' +
                        propertyDetails.precio.toLocaleString('es-MX', {
                          minimumFractionDigits: 2,
                        }) +
                        ' MXN'}
                    </p>
                  </div>
                </div>
                <hr />
              </>
            )}

            <h3 className='subtitle-section'>Ubicación del inmueble</h3>
            <Map
              id='map'
              height={'400px'}
              width={'100%'}
              markerCoords={ubicacionCoords}
            />
            <hr />
            <Col span={24}>
              <div style={{ padding: '20px', backgroundColor: '#fcfeff' }}>
                <div className='header'>
                  <h3 className='subtitle-section'>Más información</h3>
                </div>
                <div className='button-group'>
                  <Button
                    className={`custom-button ${
                      activeKey === 'Habitaciones' ? 'active' : ''
                    }`}
                    onClick={() => onCollapseChange('Habitaciones')}>
                    Habitaciones
                  </Button>
                  <Button
                    className={`custom-button ${
                      activeKey === 'Interiores/Exteriores' ? 'active' : ''
                    }`}
                    onClick={() => onCollapseChange('Interiores/Exteriores')}>
                    Interiores/Exteriores
                  </Button>
                  <Button
                    className={`custom-button ${
                      activeKey === 'Estacionamiento' ? 'active' : ''
                    }`}
                    onClick={() => onCollapseChange('Estacionamiento')}>
                    Estacionamiento
                  </Button>
                  <Button
                    className={`custom-button ${
                      activeKey === 'Seguridad/Tecnologiá' ? 'active' : ''
                    }`}
                    onClick={() => onCollapseChange('Seguridad/Tecnologiá')}>
                    Seguridad/Tecnología
                  </Button>
                </div>
                <div className='content-container'>
                  <div
                    style={{
                      marginTop: '20px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-around',
                    }}>
                    {activeKey === 'Habitaciones' &&
                      Array.from({ length: propertyDetails.habitaciones }).map(
                        (_, index) => (
                          <Card
                            className='card-more-info'
                            key={index}
                            title={`Habitación ${index + 1}`}
                            style={{
                              flex: '1 0 30%',
                              maxWidth: '31%',
                              margin: '10px',
                              borderRadius: '12px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                              transition: 'transform 0.3s ease-in-out',
                            }}>
                            <p>Habitación {index + 1}</p>
                          </Card>
                        ),
                      )}
                    {activeKey === 'Interiores/Exteriores' && (
                      <>
                        <Card
                          title='Espacios interiores'
                          style={{
                            width: '100%',
                            margin: '10px',
                            borderRadius: '12px',
                          }}>
                          <ul
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              padding: 0,
                              listStyleType: 'none',
                            }}>
                            {Object.entries(propertyDetails.cardsActivadas)
                              .filter(
                                ([key, value]) => value && isInterior(key),
                              )
                              .map(([key]) => (
                                <li
                                  key={key}
                                  style={{
                                    textAlign: 'left',
                                    width: '33.33%',
                                    boxSizing: 'border-box',
                                    padding: '0 10px',
                                  }}>
                                  {getIcon(key)}
                                  {formatLabel(key)}
                                </li>
                              ))}
                          </ul>
                        </Card>
                        <Card
                          title='Espacios exteriores'
                          style={{
                            width: '100%',
                            margin: '10px',
                            borderRadius: '12px',
                          }}>
                          <ul
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              padding: 0,
                              listStyleType: 'none',
                            }}>
                            {Object.entries(propertyDetails.cardsActivadas)
                              .filter(
                                ([key, value]) => value && !isInterior(key),
                              )
                              .map(([key]) => (
                                <li
                                  key={key}
                                  style={{
                                    textAlign: 'left',
                                    width: '33.33%',
                                    boxSizing: 'border-box',
                                    padding: '0 10px',
                                  }}>
                                  {getIcon(key)}
                                  {formatLabel(key)}
                                </li>
                              ))}
                          </ul>
                        </Card>
                      </>
                    )}
                    {activeKey === 'Estacionamiento' &&
                      Array.from({
                        length: propertyDetails.estacionamiento,
                      }).map((_, index) => (
                        <Card
                          className='card-more-info'
                          key={index}
                          title={`Estacionamiento ${index + 1}`}
                          style={{
                            flex: '1 0 30%',
                            maxWidth: '31%',
                            margin: '10px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease-in-out',
                          }}>
                          <p>Estacionamiento {index + 1}</p>
                        </Card>
                      ))}
                    {activeKey === 'Seguridad/Tecnologiá' && (
                      <Card
                        style={{
                          width: '100%',
                          margin: '10px',
                          borderRadius: '12px',
                        }}>
                        <ul
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyleType: 'none',
                            padding: 0,
                          }}>
                          {propertyDetails.cardsActivadas.Alarma && (
                            <li
                              style={{
                                textAlign: 'left',
                                width: '50%',
                                boxSizing: 'border-box',
                                padding: '0 10px',
                              }}>
                              <SafetyCertificateTwoTone /> Alarma
                            </li>
                          )}
                          {propertyDetails.cardsActivadas[
                            'Aire acondicionado'
                          ] && (
                            <li
                              style={{
                                textAlign: 'left',
                                width: '50%',
                                boxSizing: 'border-box',
                                padding: '0 10px',
                              }}>
                              <SafetyCertificateTwoTone /> Aire acondicionado
                            </li>
                          )}
                          {propertyDetails.cardsActivadas[
                            'Cámaras de seguridad'
                          ] && (
                            <li
                              style={{
                                textAlign: 'left',
                                width: '50%',
                                boxSizing: 'border-box',
                                padding: '0 10px',
                              }}>
                              <SafetyCertificateTwoTone /> Cámaras de seguridad
                            </li>
                          )}
                          {propertyDetails.cardsActivadas.Gimnasio && (
                            <li
                              style={{
                                textAlign: 'left',
                                width: '50%',
                                boxSizing: 'border-box',
                                padding: '0 10px',
                              }}>
                              <SafetyCertificateTwoTone /> Gimnasio
                            </li>
                          )}
                        </ul>
                      </Card>
                    )}
                  </div>
                </div>
                <hr />
              </div>
            </Col>
          </div>
        </div>
        <div className='detail-form'>
          <div className='sandar-logo'>
            <img src={logo} alt='Descripción de la imagen' />
            <h2>Sandar Inmuebles</h2>
          </div>
          <div className='section-form'>
            <h3 style={{ fontFamily: 'Geometos' }}>Venta</h3>
            <div className='price'>
              $
              {propertyDetails.precio.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
              })}
            </div>
            <h3
              style={{
                fontSize: '1.1rem',
                marginTop: '25px',
                textTransform: 'none',
                fontFamily: 'Geometos',
              }}>
              Contacta con el anunciante
            </h3>
            <ContactForm onFinish={handleContactFormSubmit} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PropertyDetail;