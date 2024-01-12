import { useEffect, useState } from 'react'
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Form,
  Input,
  message,
  Card,
  Spin,
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  FormOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ToolOutlined,
  CarOutlined,
  ShopOutlined,
  BankOutlined,
  ApartmentOutlined,
  FieldNumberOutlined,
  BulbOutlined,
  CrownOutlined,
  HeatMapOutlined,
  CarryOutOutlined,
  AlertOutlined,
  RiseOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  BuildOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import mapaImage from '../../assets/img/mapa.png' // Importa la imagen del mapa
import './PropertyDetail.css'
import Map from '../Map/Map'

import { firestore } from '../firebase/firebase'

const { Content } = Layout
const { Title, Paragraph } = Typography

const PropertyDetail = () => {
  const { id } = useParams()
  const [imageHeight, setImageHeight] = useState('60vh')
  const [propertyDetails, setPropertyDetails] = useState(null)
  const [activeKey, setActiveKey] = useState('')

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
      } else {
        console.error(
          'No se encontró la propiedad con el ID proporcionado en Firebase.',
        )
      }
    } catch (error) {
      console.error('Error al obtener datos de Firestore:', error)
    }
  }

  const handleContactFormSubmit = async (values) => {
    try {
      const contactCollection = collection(firestore, 'msgpro')
      // Obtén la información específica de la propiedad
      const selectedProperty = propertyData.find(
        (property) => property.id.toString() === id,
      )

      console.log('selectedProperty:', selectedProperty)

      if (!selectedProperty) {
        console.error('No se encontró la propiedad con el ID proporcionado.')
        return
      }

      // Agrega información adicional al objeto values
      const contactDataWithPropertyInfo = {
        ...values,
        propertyId: id,
        propertyName: selectedProperty.type, // O usa selectedProperty.type, dependiendo de lo que necesites
      }

      console.log('Datos del mensaje:', contactDataWithPropertyInfo)

      await addDoc(contactCollection, contactDataWithPropertyInfo)
      message.success('¡Tu mensaje ha sido enviado con éxito!')
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
    { key: 'Habitaciones', label: 'Recámaras' },
    { key: 'Baño', label: 'Baños' },
    { key: 'Medio_bano', label: 'Medios Baños' },
    { key: 'Construccion', label: 'Construcción' },
    { key: 'Estacionamientos', label: 'Estacionamientos' },
  ]

  return (
    <Content>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: '30px',
          alignItems: 'center',
        }}>
        <div
          style={{
            marginBottom: '20px',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: 'none',
            border: 'none',
          }}>
          <Title
            level={2}
            style={{
              fontFamily: 'Arial, sans-serif',
              color: '#333',
              fontWeight: 'bold',
              marginBottom: '10px',
            }}>
            {/*{propertyDetails.type}*/}
            {propertyDetails.nombre}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DollarCircleOutlined
              style={{
                fontSize: '2.5em',
                marginRight: '15px',
                color: '#1890ff',
              }}
            />
            <Title
              level={4}
              style={{
                fontFamily: 'Arial, sans-serif',
                color: '#666',
                marginBottom: 0,
              }}>
              Precio: ${propertyDetails.precio}
            </Title>
          </div>
        </div>
        {/* Agrega aquí cualquier contenido que desees alinear a la derecha */}
      </div>
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div
              style={{
                flex: '1',
                width: '70vh',
                height: '60vh',
                paddingLeft: '30px',
                paddingRight: '30px',
              }}>
              {propertyDetails && propertyDetails.image && (
                <img
                  src={propertyDetails.image} // Reemplazar por la URL correcta de la imagen
                  alt='Property Image'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                />
              )}
            </div>
            <div
              style={{
                flex: '1',
                maxWidth: '30%',
                maxHeight: '60vh',
                padding: '0 20px',
              }}>
              <Card
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  borderRadius: '12px',
                }}>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Title
                    level={4}
                    className='contact-title'
                    style={{ marginBottom: '5px' }}>
                    SANDAR INMUEBLES
                  </Title>
                  <Title
                    level={4}
                    className='contact-title'
                    style={{ marginBottom: '20px' }}>
                    CONTACTANOS Y PREGUNTA
                  </Title>
                </div>
                <Form
                  name='contact-form'
                  onFinish={handleContactFormSubmit}
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  style={{ flex: 1, overflowY: 'auto' }}>
                  <Form.Item
                    name='name'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, ingresa tu nombre',
                      },
                    ]}>
                    <Input
                      prefix={<UserOutlined />}
                      placeholder='Nombre'
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name='email'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, ingresa tu correo electrónico',
                      },
                      {
                        type: 'email',
                        message: 'Ingresa un correo electrónico válido',
                      },
                    ]}>
                    <Input
                      prefix={<MailOutlined />}
                      placeholder='Correo Electrónico'
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                  <Form.Item
                    name='message'
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, ingresa tu mensaje',
                      },
                    ]}>
                    <Input.TextArea
                      prefix={<FormOutlined />}
                      placeholder='Mensaje'
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
                    <Button
                      type='primary'
                      htmlType='submit'
                      style={{ width: '100%', borderRadius: '8px' }}>
                      Enviar Mensaje
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div style={{ padding: '20px' }}>
            <Title level={2}>Detalles de la Propiedad</Title>
            <Row gutter={[16, 16]}>
              {details.map((detail, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={8} xl={3}>
                  <Card
                    hoverable
                    title={detail.label}
                    size='small'
                    style={{
                      borderRadius: '12px',
                      backgroundColor: '#f5f5f5',
                      minHeight: '80px',
                      padding: '8px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}>
                    <Title level={4} style={{ color: '#1890ff' }}>
                      {propertyDetails.activeFeatures?.[detail.key] || 0}
                    </Title>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        {/* Insertar componentes de Detalles, Descripción y Características debajo de Detalles de la Propiedad */}
        <Col span={24}>
          <Row gutter={[16, 16]}>
            {/* Características */}
            <Col span={24}>
              <div style={{ padding: '20px', backgroundColor: '#fcfeff' }}>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />{' '}
                {/* Línea horizontal superior */}
                <Title level={2}>Información del inmueble</Title>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        fontSize: '17px',
                        lineHeight: '2',
                      }}>
                      <li>
                        <strong>
                          <CarOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Estacionamiento:
                        </strong>{' '}
                        Sí
                      </li>
                      <li>
                        <strong>
                          <HomeOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Tipo:
                        </strong>{' '}
                        {propertyDetails.tipoPropiedad}
                      </li>
                      <li>
                        <strong>
                          <EnvironmentOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Uso de la propiedad:
                        </strong>{' '}
                        Residencial
                      </li>
                      <li>
                        <strong>
                          <BankOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          ¿Está en condominio?:
                        </strong>{' '}
                        No
                      </li>
                      <li>
                        <strong>
                          <BuildOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Edificios:
                        </strong>{' '}
                        1
                      </li>
                      <li>
                        <strong>
                          <ShopOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Propiedades:
                        </strong>{' '}
                        2
                      </li>
                      <li>
                        <strong>
                          <ApartmentOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Tipo de departamento:
                        </strong>{' '}
                        N/A
                      </li>
                      <li>
                        <strong>
                          <AlertOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Estado de conservación del inmueble:
                        </strong>{' '}
                        Bueno
                      </li>
                      <li>
                        <strong>
                          <ClockCircleOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Antigüedad:
                        </strong>{' '}
                        5 años
                      </li>
                      <li>
                        <strong>
                          <HeatMapOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Orientación del inmueble:
                        </strong>{' '}
                        Norte
                      </li>
                      <li>
                        <strong>
                          <ScheduleOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Superficie de construcción:
                        </strong>{' '}
                        150 m²
                      </li>
                    </ul>
                  </Col>
                  <Col span={12}>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        fontSize: '17px',
                        lineHeight: '2',
                      }}>
                      <li>
                        <strong>
                          <CrownOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Recámaras:
                        </strong>{' '}
                        {propertyDetails.activeFeatures.Habitaciones}
                      </li>
                      <li>
                        <strong>
                          <FieldNumberOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Superficie terreno:
                        </strong>{' '}
                        250 m²
                      </li>
                      <li>
                        <strong>
                          <CarOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Baños:
                        </strong>{' '}
                        {propertyDetails.activeFeatures.Baño}{' '}
                      </li>
                      <li>
                        <strong>
                          <CarryOutOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Medios baños:
                        </strong>{' '}
                        {propertyDetails.activeFeatures.MediosBaños}
                      </li>
                      <li>
                        <strong>
                          <ToolOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Cocina:
                        </strong>{' '}
                        {propertyDetails.activeFeatures.Cocina}{' '}
                      </li>
                      <li>
                        <strong>
                          <HeatMapOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Clima:
                        </strong>{' '}
                        Aire acondicionado
                      </li>
                      <li>
                        <strong>
                          <ApartmentOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Amueblado:
                        </strong>{' '}
                        Sí
                      </li>
                      <li>
                        <strong>
                          <RiseOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          ¿Está equipado?:
                        </strong>{' '}
                        Sí
                      </li>
                      <li>
                        <strong>
                          <BulbOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Acabados:
                        </strong>{' '}
                        De lujo
                      </li>
                      <li>
                        <strong>
                          <EyeOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Número de niveles:
                        </strong>{' '}
                        {propertyDetails.activeFeatures.NumeroDePisos}{' '}
                      </li>
                      <li>
                        <strong>
                          <GlobalOutlined
                            style={{
                              marginRight: '5px',
                              fontSize: '16px',
                              color: '#1890ff',
                            }}
                          />
                          Vista del inmueble:
                        </strong>{' '}
                        Panorámica
                      </li>
                    </ul>
                  </Col>
                </Row>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />{' '}
                {/* Línea horizontal inferior */}
              </div>
            </Col>

            {/* Descripción */}
            <Col>
              <div style={{ padding: '20px', backgroundColor: '#fcfeff' }}>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />
                <Title level={2}>Descripción</Title>
                <Paragraph style={{ fontSize: '17px', color: '#333' }}>
                  {propertyDetails.descripcion}
                </Paragraph>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />
              </div>
            </Col>

            {/* Mapa demostrativo */}
            <Col span={24}>
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#fcfeff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />
                <Map height={'400px'} width={'100%'} />
              </div>
            </Col>

            {/* Nuevo apartado "Precio y Contrato" */}
            <Col span={24}>
              <div style={{ padding: '20px', backgroundColor: '#fcfeff' }}>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />
                <div className='header'>
                  <Title level={2}>Informacion del inmueble</Title>
                </div>
                <div className='button-group'>
                  <Button
                    className={`custom-button ${
                      activeKey === 'Recámaras' ? 'active' : ''
                    }`}
                    onClick={() => onCollapseChange('Recámaras')}>
                    Récamaras
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
                    Seguridad/Tecnologiá
                  </Button>
                </div>
                <div className='content-container'>
                  {activeKey === 'Recámaras' && (
                    <p>Contenido relacionado a las recamaras.</p>
                  )}
                  {activeKey === 'Interiores/Exteriores' && (
                    <p>Contenido relacionado a los interiores y exteriores.</p>
                  )}
                  {activeKey === 'Estacionamiento' && (
                    <p>Contenido relacionado al estacionamiento.</p>
                  )}
                  {activeKey === 'Seguridad/Tecnologiá' && (
                    <p>Contenido relacionado a la seguridad y tecnologia.</p>
                  )}
                </div>
                <hr
                  style={{
                    borderTop: '2px solid #1890ff',
                    margin: '0',
                    marginBottom: '16px',
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Content>
  )
}

export default PropertyDetail
