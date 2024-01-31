import { useEffect, useState } from 'react'
import {
  Steps,
  Divider,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  InputNumber,
  Upload,
  Row,
  Col,
  notification,
  Select,
  Radio,
  Card,
  Spin,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  StarOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import axios from 'axios'

import { app, firestore } from '../firebase/firebase'
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import YouTube from 'react-youtube'
import Map from '../Map/Map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRulerCombined, faHome } from '@fortawesome/free-solid-svg-icons'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'

const storage = getStorage(app)

const { Step } = Steps

let formData = {
  youtubeUrl: '',
}
const moreliaCoords = [19.706, -101.195]

function Propiedades() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [mapHeight, setMapHeight] = useState('300px') // Tamaño inicial
  const [mapCenter, setMapCenter] = useState(moreliaCoords)
  const [markerCoords, setMarkerCoords] = useState(moreliaCoords)
  const [tableFilters, setTableFilters] = useState({})

  const [cardsActivadas, setCardsActivadas] = useState({})

  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')

  let locationCache = {}

  const handlePauseProperty = async (propertyId) => {
    try {
      const propiedadesCollection = collection(firestore, 'propiedades')
      await updateDoc(doc(propiedadesCollection, propertyId), {
        status: 'pausada',
      })
      setDataSource((prevDataSource) =>
        prevDataSource.map((property) => {
          if (property.key === propertyId) {
            return { ...property, status: 'pausada' }
          }
          return property
        }),
      )
    } catch (error) {
      console.error('Error al pausar la propiedad:', error)
    }
  }

  const handleResumeProperty = async (propertyId) => {
    try {
      const propiedadesCollection = collection(firestore, 'propiedades')
      await updateDoc(doc(propiedadesCollection, propertyId), {
        status: 'activa',
      })
      setDataSource((prevDataSource) =>
        prevDataSource.map((property) => {
          if (property.key === propertyId) {
            return { ...property, status: 'activa' }
          }
          return property
        }),
      )
    } catch (error) {
      console.error('Error al reanudar la propiedad:', error)
    }
  }

  const isPropertyPaused = (property) => {
    return property.status === 'pausada'
  }

  const [highlightedProperties, setHighlightedProperties] = useState([])

  const handleDestacarPropiedad = async (propertyId) => {
    try {
      const propertyIndex = dataSource.findIndex(
        (property) => property.key === propertyId,
      )
      const updatedProperties = [...dataSource]
      updatedProperties[propertyIndex].highlighted =
        !updatedProperties[propertyIndex].highlighted
      setDataSource(updatedProperties)

      await updateDoc(doc(collection(firestore, 'propiedades'), propertyId), {
        highlighted: updatedProperties[propertyIndex].highlighted,
      })
    } catch (error) {
      console.error('Error al destacar la propiedad:', error)
    }
  }

  const handleLocationChange = async (newLocation) => {
    try {
      if (locationCache[newLocation]) {
        setLocationSuggestions(locationCache[newLocation])
        return
      }

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          newLocation,
        )}`,
        { timeout: 50000 },
      )

      if (newLocation.trim() !== '') {
        setLocationSuggestions(response.data || [])

        locationCache[newLocation] = response.data || []

        if (!selectedLocation) {
          setMapCenter(moreliaCoords)
          setMarkerCoords(moreliaCoords)
          setMapHeight('500px')
        }
      } else {
        setLocationSuggestions([])
      }
    } catch (error) {
      console.error('Error al obtener sugerencias de ubicación:', error.message)
    }
  }

  const handleLocationSelect = (suggestion) => {
    setSelectedLocation(suggestion)
    setLocationSuggestions([])

    setMarkerCoords([suggestion.lat, suggestion.lon])

    setMapHeight('500px')
  }

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.lat, selectedLocation.lon])
    }
  }, [selectedLocation])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesCollection = collection(firestore, 'propiedades')
        const propiedadesSnapshot = await getDocs(propiedadesCollection)

        const nuevasPropiedades = []
        propiedadesSnapshot.forEach((doc) => {
          const propiedadData = doc.data()
          const propiedad = {
            key: doc.id,
            ...propiedadData,
          }
          nuevasPropiedades.push(propiedad)
        })

        const filteredPropiedades = nuevasPropiedades.filter(
          (propiedad) =>
            Object.entries(tableFilters).every(([key, filter]) =>
              filter(propiedad[key]),
            ) &&
            Object.values(propiedad).some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        )

        setDataSource(filteredPropiedades)
      } catch (error) {
        console.error('Error al obtener propiedades:', error)
      }
    }

    fetchData()
  }, [searchTerm, tableFilters])

  const [featuresChecked, setFeaturesChecked] = useState({
    Baño: false,
    'Medios Baños': false,
    Habitaciones: false,
    Cocina: false,
    Patio: false,
    Jardín: false,
    'Oficina/estudio': false,
    Lavadero: false,
    Sótano: false,
    Ático: false,
    Closets: false,
    Terraza: false,
    Cochera: false,
    'numero de pisos': false,
  })

  const handleFeatureCheck = (feature) => {
    setFeaturesChecked((prevState) => ({
      ...prevState,
      [feature]: !prevState[feature],
    }))

    setCardsActivadas((prevCards) => ({
      ...prevCards,
      [feature]: !prevCards[feature],
    }))
  }

  const handleAdd = () => {
    form.resetFields()
    setFileList([])
    setIsModalVisible(true)
  }

  const handleEditarPropiedad = (record) => {
    form.setFieldsValue({ ...record, imagen: [] })
    setIsModalVisible(true)
  }

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const onFormSubmit = async (values, step) => {
    setUploading(true) // Establecer el estado uploading a true cuando comienza la subida

    try {
      if (
        step === 0 &&
        (!values.nombre || !values.ubicacion || !values.precio)
      ) {
        throw new Error('Por favor, completa todos los campos obligatorios.')
      }

      formData = {
        ...formData,
        ...values,
        youtubeUrl,
        ubicacion: selectedLocation?.display_name,
      }

      if (step === 0) {
        formData.tipoPropiedad = values.tipoPropiedad || ''
        formData.condicion = values.condicion || ''
      }

      if (step === 3) {
        if (typeof app !== 'undefined') {
          if (
            values.fotos &&
            values.fotos.fileList &&
            values.fotos.fileList.length > 0
          ) {
            const imageId = Date.now().toString()

            const uploadTasks = values.fotos.fileList.map(
              async (photo, index) => {
                const storageRef = ref(
                  storage,
                  `propiedades/${imageId}_${index}`,
                )
                await uploadBytes(storageRef, photo.originFileObj)

                const imageURL = await getDownloadURL(storageRef)

                return imageURL
              },
            )

            const imageUrls = await Promise.all(uploadTasks)

            formData = { ...formData, fotos: imageUrls, youtubeUrl }
            formData = { ...formData, cardsActivadas }

            const propiedadesCollection = collection(firestore, 'propiedades')
            await addDoc(propiedadesCollection, formData)

            notification.success({
              message: 'Propiedad guardada',
              description: 'La propiedad ha sido guardada con éxito.',
            })

            setIsModalVisible(false)
          } else {
            throw new Error(
              'Por favor, selecciona al menos una foto para la propiedad.',
            )
          }
        } else {
          throw new Error('Firebase no está definido')
        }
      } else {
        nextStep()
      }
    } catch (error) {
      console.error('Error al guardar en Firebase:', error)
      notification.error({
        message: 'Error al guardar en Firebase',
        description:
          error.message || 'Ocurrió un error al intentar guardar la propiedad.',
      })
    } finally {
      setLoading(false)
      setUploading(false) // Establecer el estado uploading a false en cualquier caso
    }
  };
  
  

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const deleteProperty = async (propertyId) => {
    try {
      const propiedadesCollection = collection(firestore, 'propiedades')
      await deleteDoc(doc(propiedadesCollection, propertyId))

      setDataSource((prevDataSource) =>
        prevDataSource.filter((property) => property.key !== propertyId),
      )

      notification.success({
        message: 'Propiedad eliminada',
        description: 'La propiedad ha sido eliminada con éxito.',
      })
    } catch (error) {
      console.error('Error al eliminar propiedad:', error)
      notification.error({
        message: 'Error al eliminar propiedad',
        description:
          error.message ||
          'Ocurrió un error al intentar eliminar la propiedad.',
      })
    }
  }

  const handleEliminarPropiedad = (propertyId) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de que deseas eliminar esta propiedad?',
      okText: 'Sí',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProperty(propertyId)
      },
    })
  }

  const onPreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow.document.write(image.outerHTML)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesCollection = collection(firestore, 'propiedades')
        const propiedadesSnapshot = await getDocs(propiedadesCollection)

        const nuevasPropiedades = []
        propiedadesSnapshot.forEach((doc) => {
          const propiedadData = doc.data()
          const propiedad = {
            key: doc.id,
            ...propiedadData,
          }
          nuevasPropiedades.push(propiedad)
        })

        const filteredPropiedades = nuevasPropiedades.filter((propiedad) =>
          Object.values(propiedad).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )

        setDataSource(filteredPropiedades)
      } catch (error) {
        console.error('Error al obtener propiedades:', error)
      }
    }

    fetchData()
  }, [searchTerm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesCollection = collection(firestore, 'propiedades')
        const propiedadesSnapshot = await getDocs(propiedadesCollection)

        const nuevasPropiedades = []
        const nuevasPropiedadesHighlight = []

        propiedadesSnapshot.forEach((doc) => {
          const propiedadData = doc.data()
          const propiedad = {
            key: doc.id,
            ...propiedadData,
          }

          nuevasPropiedades.push(propiedad)

          if (propiedad.highlighted) {
            nuevasPropiedadesHighlight.push(propiedad.key)
          }
        })

        setDataSource(nuevasPropiedades)
        setHighlightedProperties(nuevasPropiedadesHighlight)
      } catch (error) {
        console.error('Error al obtener propiedades:', error)
      }
    }

    fetchData()
  }, [])

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'fotos',
      key: 'imagen',
      render: (fotos) => (
        <img
          src={fotos && fotos.length > 0 ? fotos[0] : ''}
          alt='Propiedad'
          style={{ width: '100px', height: '100Itzpx', objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Tipo de Propiedad',
      dataIndex: 'tipoPropiedad',
      key: 'tipoPropiedad',
      filters: [
        { text: "Casa", value: "Casa" },
        { text: "Departamento", value: "Departamento" },
        { text: "Terreno", value: "Terreno" },
        { text: "Edificio", value: "Edificio" },
        { text: "Oficina", value: "Oficina" },
        { text: "Bodega", value: "Bodega" },
        { text: "Local", value: "Local" },
      ],
      onFilter: (value, record) => record.tipoPropiedad === value,
    },
    {
      title: 'Condición',
      dataIndex: 'condicion',
      key: 'condicion',
      filters: [
        { text: 'Venta', value: 'Venta' },
        { text: 'Renta', value: 'Renta' },
      ],
      onFilter: (value, record) => record.condicion === value,
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      key: 'ubicacion',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => <>${precio.toLocaleString()}</>,
      sorter: (a, b) => a.precio - b.precio,
      sortDirections: ['ascend', 'descend'],
    },

    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (text, record) => (
        <Space size='middle'>
          <Button
            type='primary'
            onClick={() => handleEditarPropiedad(record.key)}
            icon={<EditOutlined />}
          />
          <Button
            danger
            onClick={() => handleEliminarPropiedad(record.key)}
            icon={<DeleteOutlined />}
          />
          <Button onClick={() => handleDestacarPropiedad(record.key)}>
            <FontAwesomeIcon
              icon={record.highlighted ? solidStar : regularStar}
              style={{ color: record.highlighted ? 'gold' : 'gray' }}
            />
          </Button>
          <Button
            type={!isPropertyPaused(record) ? 'primary' : 'default'}
            icon={
              !isPropertyPaused(record) ? (
                <PlayCircleOutlined />
              ) : (
                <PauseCircleOutlined />
              )
            }
            onClick={() => {
              if (!isPropertyPaused(record)) {
                handlePauseProperty(record.key)
              } else {
                handleResumeProperty(record.key)
              }
            }}
            style={{
              backgroundColor: !isPropertyPaused(record)
                ? '#52c41a'
                : '#f0f0f0',
            }}
          />
        </Space>
      ),
    },
  ]

  function getYouTubeVideoId(url) {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)

    return match ? match[1] : null
  }

  const sections = {
    Recamaras: ['Habitaciones'],
    'Interiores / Exteriores': [
      'Baño',
      'Medio Baño',
      'Cocina',
      'Jardín',
      'Terraza',
      'Ático',
    ],
    Estacionamiento: ['Cochera', 'Estacionamiento'],
    'Seguridad / Tecnología': [
      'Alarma',
      'Cámaras de seguridad',
      'Sistema de sonido',
    ],
    Extras: ['Bodega', 'Vestidor', 'Chimenea', 'Aire acondicionado'],
    OtrasCaracteristicas: [
      'Amueblado',
      'Mascotas permitidas',
      'Vista panorámica',
    ],
    'Amenidades del Edificio': [
      'Gimnasio',
      'Piscina',
      'Salón de eventos',
      'Área de juegos',
    ],
    Vistas: ['Vista al mar', 'Vista a la montaña', 'Vista a la ciudad'],
  }

  return (
    <div>
      {uploading && ( // Mostrar el spinner si el estado uploading es true
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 9999,
          }}>
          <Spin
            size='large'
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      )}{' '}
      <h1>Propiedades</h1>
      <Space direction='vertical'>
        <Button type='primary' onClick={handleAdd}>
          Añadir propiedad
        </Button>
        <Input.Search
          placeholder='Buscar propiedad'
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => {
            if (e.target.value === '') {
              setSearchTerm('')
            }
          }}
        />
      </Space>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title='Propiedad'
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        style={{ minWidth: '800px' }}
        footer={[
          <Button key='back' onClick={() => setIsModalVisible(false)}>
            Cancelar
          </Button>,
          <Button
            key='submit'
            type='primary'
            loading={uploading}
            onClick={form.submit}>
            Guardar
          </Button>,
        ]}>
        <Steps current={currentStep} style={{ marginBottom: '20px' }}>
          <Step title='Información Básica' />
          <Step title='Descripción' />
          <Step title='Características' />
          <Step title='Fotos' />
        </Steps>

        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => onFormSubmit(values, currentStep)}>
          {currentStep === 0 && (
            <>
              <Form.Item
                label='Nombre'
                name='nombre'
                rules={[
                  { required: true, message: 'Por favor ingresa el nombre' },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item
                label='Tipo de Propiedad'
                name='tipoPropiedad'
                rules={[
                  {
                    required: true,
                    message: 'Por favor selecciona el tipo de propiedad',
                  },
                ]}>
                <Select>
                  <Select.Option value='Casa'>Casa</Select.Option>
                  <Select.Option value='Departamento'>
                    Departamento
                  </Select.Option>
                  {/* Agrega más opciones según sea necesario */}
                </Select>
              </Form.Item>
              <Form.Item
                label='Condición'
                name='condicion'
                rules={[
                  {
                    required: true,
                    message: 'Por favor selecciona la condición',
                  },
                ]}>
                <Radio.Group>
                  <Radio value='Venta'>Venta</Radio>
                  <Radio value='Renta'>Renta</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label='Ubicación'
                name='ubicacion'
                rules={[
                  { required: true, message: 'Por favor ingresa la ubicación' },
                ]}>
                <Input
                  onChange={(e) => handleLocationChange(e.target.value)}
                  value={selectedLocation ? selectedLocation.display_name : ''}
                />
              </Form.Item>

              {locationSuggestions.length > 0 && (
                <ul>
                  {locationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.display_name}
                      onClick={() => handleLocationSelect(suggestion)}>
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
              <Form.Item
                label='Precio'
                name='precio'
                rules={[
                  { required: true, message: 'Por favor ingresa el precio' },
                ]}>
                <InputNumber
                  min={0}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item
                label='Ubicación en Mapa'
                style={{ height: mapHeight }}>
                <div
                  style={{
                    position: 'relative',
                    height: mapHeight,
                    marginBottom: '20px',
                  }}>
                  <Map
                    height='500px'
                    width='100%'
                    markerCoords={markerCoords}
                  />
                </div>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item label='Descripción' name='descripcion'>
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label='Características adicionales'
                name='caracteristicas'>
                <Input />
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Divider>Características</Divider>
              {Object.entries(sections).map(
                ([section, featuresInSection], sectionIndex) => (
                  <div key={sectionIndex} style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px', color: '#1890ff' }}>
                      {section}
                    </h3>
                    <Row gutter={16}>
                      {featuresInSection.map((feature, featureIndex) => (
                        <Col
                          span={8}
                          key={featureIndex}
                          style={{ marginBottom: '10px' }}>
                          <Card
                            hoverable
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              padding: '10px',
                              border: featuresChecked[feature]
                                ? '2px solid #1890ff'
                                : '1px solid #d9d9d9',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleFeatureCheck(feature)}>
                            {/* Agrega iconos según sea necesario */}

                            <p
                              style={{
                                marginTop: '5px',
                                textAlign: 'center',
                                fontSize: '14px',
                              }}>
                              {feature}
                            </p>
                          </Card>
                          {feature === 'Habitaciones' && (
                            <Form.Item
                              name='habitaciones'
                              initialValue={0}
                              rules={[
                                {
                                  validator: (_, value) => {
                                    if (value || value === 0) {
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(
                                      'Ingresa el número de habitaciones',
                                    )
                                  },
                                },
                              ]}>
                              <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                placeholder='Número de habitaciones'
                                disabled={!featuresChecked[feature]}
                              />
                            </Form.Item>
                          )}

                          {feature === 'Baño' && (
                            <Form.Item
                              name='baños'
                              initialValue={0}
                              rules={[
                                {
                                  validator: (_, value) => {
                                    if (value || value === 0) {
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(
                                      'Ingresa el número de baños',
                                    )
                                  },
                                },
                              ]}>
                              <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                placeholder='Número de baños'
                                disabled={!featuresChecked[feature]}
                              />
                            </Form.Item>
                          )}

                          {feature === 'Medio Baño' && (
                            <Form.Item
                              name='medio Baño'
                              initialValue={0}
                              rules={[
                                {
                                  validator: (_, value) => {
                                    if (value || value === 0) {
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(
                                      'Ingresa el número de Medio Baño',
                                    )
                                  },
                                },
                              ]}>
                              <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                placeholder='Número de Medio Baño'
                                disabled={!featuresChecked[feature]}
                              />
                            </Form.Item>
                          )}

                          {feature === 'Estacionamiento' && (
                            <Form.Item
                              name='estacionamiento'
                              initialValue={0}
                              rules={[
                                {
                                  validator: (_, value) => {
                                    if (value || value === 0) {
                                      return Promise.resolve()
                                    }
                                    return Promise.reject(
                                      'Ingresa el número de Estacionamientos',
                                    )
                                  },
                                },
                              ]}>
                              <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                placeholder='Número de Estacionamientos'
                                disabled={!featuresChecked[feature]}
                              />
                            </Form.Item>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              )}

              <Divider>Tamaño y Construcción</Divider>
              <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
                <Col span={12}>
                  <Form.Item
                    label='Tamaño de la Propiedad'
                    name='tamanioPropiedad'
                    rules={[
                      {
                        required: true,
                        message: 'Ingresa el tamaño de la propiedad',
                      },
                    ]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <FontAwesomeIcon
                    icon={faHome}
                    style={{ fontSize: '16px', marginRight: '8px' }}
                  />
                </Col>
                <Col span={12}>
                  <Form.Item
                    label='Metros Construidos'
                    name='metrosConstruidos'
                    rules={[
                      {
                        required: true,
                        message: 'Ingresa los metros construidos',
                      },
                    ]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                  <FontAwesomeIcon
                    icon={faRulerCombined}
                    style={{ fontSize: '16px', marginRight: '8px' }}
                  />
                </Col>
              </Row>
            </>
          )}

          {currentStep === 3 && (
            <>
              <Form.Item label='Fotos' name='fotos'>
                <Upload
                  listType='picture-card'
                  fileList={fileList}
                  onChange={handleUploadChange}
                  onPreview={onPreview}
                  beforeUpload={() => false}>
                  {fileList.length < 50 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Subir</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item label='URL de YouTube' name='youtubeUrl'>
                <Input
                  placeholder='Inserta la URL de YouTube'
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value)
                  }}
                />
              </Form.Item>

              {youtubeUrl && (
                <YouTube
                  videoId={getYouTubeVideoId(youtubeUrl)}
                  opts={{ width: '100%', height: 315 }}
                />
              )}
            </>
          )}

          <Divider />

          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prevStep}>
              Anterior
            </Button>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default Propiedades
