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
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SearchOutlined,
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
  setDoc,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import YouTube from 'react-youtube'
import Map from '../Map/Map'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRulerCombined,
  faHome,
  faBath,
  faToilet,
  faBed,
  faTree,
  faUtensils,
  faHouseFlag,
  faMountain,
  faCar,
  faParking,
  faVideo,
  faBell,
  faVolumeUp,
  faBox,
  faTshirt,
  faFire,
  faSnowflake,
  faCouch,
  faPaw,
  faBinoculars,
  faDumbbell,
  faSwimmingPool,
  faGlassCheers,
  faChess,
  faWater,
  faCity,
} from '@fortawesome/free-solid-svg-icons'
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
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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

  const handleCopiarEnlace = (enlace) => {
    const textField = document.createElement('textarea')
    textField.innerText = enlace
    document.body.appendChild(textField)
    textField.select()
    textField.setSelectionRange(0, 99999)
    document.execCommand('copy')
    textField.remove()

    // Mostrar notificación de Ant Design
    notification.success({
      message: 'Enlace copiado',
      description: 'El enlace se ha copiado exitosamente al portapapeles.',
    })
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
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=mx&q=${encodeURIComponent(
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
          setMapHeight('300px')
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

    setMapHeight('300px')
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
            Object.values(propiedad).some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
            ) &&
            (minPrice === '' ||
              parseInt(propiedad.price) >= parseInt(minPrice)) &&
            (maxPrice === '' ||
              parseInt(propiedad.price) <= parseInt(maxPrice)),
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
    'Medio Baño': false,
    Habitaciones: false,
    Cocina: false,
    Jardín: false,
    Terraza: false,
    Ático: false,
    Cochera: false,
    Estacionamiento: false,
    Alarma: false,
    'Cámaras de seguridad': false,
    'Sistema de sonido': false,
    Bodega: false,
    Vestidor: false,
    Chimenea: false,
    'Aire acondicionado': false,
    Amueblado: false,
    'Mascotas permitidas': false,
    'Vista panorámica': false,
    Gimnasio: false,
    Piscina: false,
    'Salón de eventos': false,
    'Área de juegos': false,
    'Vista al mar': false,
    'Vista a la montaña': false,
    'Vista a la ciudad': false,
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

  const [isEditing, setIsEditing] = useState('')
  const [isKey, setIsKey] = useState('')

  const handleEditarPropiedad = (key) => {
    const propertyToEdit = dataSource.find((property) => property.key === key)
    if (propertyToEdit) {
      const propertyValues = {
        ...propertyToEdit,
        cardsActivadas: { ...propertyToEdit.cardsActivadas },
      };
  
      // Actualiza featuresChecked con las características activadas del registro
      const updatedFeaturesChecked = { ...featuresChecked }
      Object.keys(updatedFeaturesChecked).forEach((feature) => {
        updatedFeaturesChecked[feature] =
          propertyValues.cardsActivadas[feature] || false;
      });
      setFeaturesChecked(updatedFeaturesChecked);
  
      form.setFieldsValue(propertyValues);
      setIsModalVisible(true);
      setIsKey(key);
      setIsEditing(true);
      console.log("Esta editando:", isEditing);
      console.log("Esta es la key:", key);
      console.log("Nueva key:", key);
    }
  };

// Añade un efecto para actualizar el estado de cardsActivadas
useEffect(() => {
  if (isEditing) {
    const propertyToEdit = dataSource.find((property) => property.key === isKey);
    if (propertyToEdit) {
      setCardsActivadas({ ...propertyToEdit.cardsActivadas });
    }
  }
}, [isEditing, isKey, dataSource]);

  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onFormSubmit = async (values, step) => {
    setUploading(true)

    try {
      if (
        step === 0 &&
        (!values.nombre || !values.ubicacion || !values.precio)
      ) {
        throw new Error('Por favor, completa todos los campos obligatorios.')
      }

      formData = {
        ...formData,
        status: 'activa',
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

            if (isEditing) {
              console.log('si edita')
              console.log('Values KEY:', isKey)
              // Si se está editando, actualiza el documento existente en Firestore
              const propertyDocRef = doc(firestore, 'propiedades', isKey)
              await setDoc(propertyDocRef, formData) // Utiliza setDoc en lugar de addDoc
            } else {
              // Si no se está editando, agrega un nuevo documento a Firestore
              await addDoc(propiedadesCollection, formData)
            }

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
      setUploading(false)
    }
  }

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

  const handleFilter = () => {
    fetchData()
  }

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
          Object.values(propiedad).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
          ) &&
          (minPrice === '' ||
            parseInt(propiedad.precio) >= parseInt(minPrice)) &&
          (maxPrice === '' || parseInt(propiedad.precio) <= parseInt(maxPrice)),
      )

      setDataSource(filteredPropiedades)
    } catch (error) {
      console.error('Error al obtener propiedades:', error)
    }
  }

  const handleMinPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Eliminar caracteres no numéricos
    setMinPrice(value === '' ? null : parseInt(value, 10)) // Convertir a entero o establecer como null si está vacío
  }

  const handleMaxPriceChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Eliminar caracteres no numéricos
    setMaxPrice(value === '' ? null : parseInt(value, 10)) // Convertir a entero o establecer como null si está vacío
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
        { text: 'Casa', value: 'Casa' },
        { text: 'Departamento', value: 'Departamento' },
        { text: 'Terreno', value: 'Terreno' },
        { text: 'Edificio', value: 'Edificio' },
        { text: 'Oficina', value: 'Oficina' },
        { text: 'Bodega', value: 'Bodega' },
        { text: 'Local', value: 'Local' },
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
      render: (precio) => (
        <>
          {precio.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
          })}
        </>
      ),
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

          <Button
            onClick={() =>
              handleCopiarEnlace(
                `https://sandar-inmuebles.web.app/property/${record.key}`,
              )
            }>
            <CopyOutlined />
          </Button>
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
      <Space direction='horizontal'>
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

        <Input
          type='text'
          placeholder='Precio mínimo'
          value={
            minPrice === null ? '' : `$${minPrice.toLocaleString('es-MX')}`
          }
          onChange={handleMinPriceChange}
          addonBefore='MXN'
        />

        <Input
          type='text'
          placeholder='Precio máximo'
          value={
            maxPrice === null ? '' : `$${maxPrice.toLocaleString('es-MX')}`
          }
          onChange={handleMaxPriceChange}
          addonBefore='MXN'
        />

        <Button type='primary' onClick={handleFilter}>
          Filtrar
        </Button>
      </Space>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title='Añadir Propiedad'
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        style={{ minWidth: '800px' }}
        footer={[
          <Button
            key='back'
            onClick={() => {
              return (
                setIsModalVisible(false),
                form.resetFields(),
                setFileList([]),
                setCurrentStep(0)
              )
            }}>
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
                  <Select.Option value='Terreno'>Terreno</Select.Option>
                  <Select.Option value='Despacho'>Despacho</Select.Option>
                  <Select.Option value='Oficina'>Oficina</Select.Option>
                  <Select.Option value='Bodega'>Bodega</Select.Option>
                  <Select.Option value='Edificio'>Edificio</Select.Option>
                  <Select.Option value='Rancho'>Rancho</Select.Option>
                  <Select.Option value='Hectareas'>Hectareas</Select.Option>
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
                  style={{ width: '50%' }} // Establecer el ancho del campo de entrada
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
                    height='300px'
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
                            {feature === 'Baño' && (
                              <FontAwesomeIcon
                                icon={faBath}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Medio Baño' && (
                              <FontAwesomeIcon
                                icon={faToilet}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Habitaciones' && (
                              <FontAwesomeIcon
                                icon={faBed}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Jardín' && (
                              <FontAwesomeIcon
                                icon={faTree}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Cocina' && (
                              <FontAwesomeIcon
                                icon={faUtensils}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Terraza' && (
                              <FontAwesomeIcon
                                icon={faHouseFlag}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Ático' && (
                              <FontAwesomeIcon
                                icon={faMountain}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Cochera' && (
                              <FontAwesomeIcon
                                icon={faCar}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Estacionamiento' && (
                              <FontAwesomeIcon
                                icon={faParking}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Alarma' && (
                              <FontAwesomeIcon
                                icon={faBell}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Cámaras de seguridad' && (
                              <FontAwesomeIcon
                                icon={faVideo}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Sistema de sonido' && (
                              <FontAwesomeIcon
                                icon={faVolumeUp}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Bodega' && (
                              <FontAwesomeIcon
                                icon={faBox}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Vestidor' && (
                              <FontAwesomeIcon
                                icon={faTshirt}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Chimenea' && (
                              <FontAwesomeIcon
                                icon={faFire}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Aire acondicionado' && (
                              <FontAwesomeIcon
                                icon={faSnowflake}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Amueblado' && (
                              <FontAwesomeIcon
                                icon={faCouch}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Mascotas permitidas' && (
                              <FontAwesomeIcon
                                icon={faPaw}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Vista panorámica' && (
                              <FontAwesomeIcon
                                icon={faBinoculars}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Gimnasio' && (
                              <FontAwesomeIcon
                                icon={faDumbbell}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Piscina' && (
                              <FontAwesomeIcon
                                icon={faSwimmingPool}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Salón de eventos' && (
                              <FontAwesomeIcon
                                icon={faGlassCheers}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Área de juegos' && (
                              <FontAwesomeIcon
                                icon={faChess}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Vista al mar' && (
                              <FontAwesomeIcon
                                icon={faWater}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Vista a la montaña' && (
                              <FontAwesomeIcon
                                icon={faMountain}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}
                            {feature === 'Vista a la ciudad' && (
                              <FontAwesomeIcon
                                icon={faCity}
                                size='2x'
                                color={
                                  featuresChecked[feature] ? '#1890ff' : '#000'
                                }
                              />
                            )}

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
                              name='medioBaño'
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
                  beforeUpload={() => false}
                  multiple={true}>
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
