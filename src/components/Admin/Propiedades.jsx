import { useEffect, useState } from "react";
import {
  Steps,
  Divider,
  Checkbox,
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
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios"; // Importa Axios

import { app, firestore } from "../firebase/firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import YouTube from "react-youtube";
import Map from "../Map/Map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  faRulerCombined,
  faHome,
  faHouseFlag,
} from "@fortawesome/free-solid-svg-icons";
// Antes de tu función Propiedades()
const storage = getStorage(app);

const { Step } = Steps;

// Antes de la función Propiedades()
let formData = {
  youtubeUrl: "", // Agrega el campo para la URL de YouTube
};
const moreliaCoords = [19.706, -101.195];

function Propiedades() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubePreview, setYoutubePreview] = useState("");
  const [mapHeight, setMapHeight] = useState("300px"); // Tamaño inicial
  const [mapCenter, setMapCenter] = useState(moreliaCoords);
  const [markerCoords, setMarkerCoords] = useState(moreliaCoords);
  const [tableFilters, setTableFilters] = useState({});
  const [tamanioPropiedad, setTamanioPropiedad] = useState("");
  const [metrosConstruidos, setMetrosConstruidos] = useState("");
  const [cardsActivadas, setCardsActivadas] = useState({});

  const [habitacionesDetails, setHabitacionesDetails] = useState([]);

  // Agrega un estado para las sugerencias de ubicación y la ubicación seleccionada
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Antes de la función Propiedades()
  let locationCache = {};

  // Dentro de handleLocationChange
  const handleLocationChange = async (newLocation) => {
    try {
      // Verificar si la ubicación está en la caché
      if (locationCache[newLocation]) {
        setLocationSuggestions(locationCache[newLocation]);
        return;
      }

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          newLocation
        )}`,
        { timeout: 50000 } // Tiempo de espera en milisegundos (ajusta según sea necesario)
      );

      // Actualizar las sugerencias solo si hay cambios en la entrada
      if (newLocation.trim() !== "") {
        setLocationSuggestions(response.data || []);

        // Almacenar en la caché
        locationCache[newLocation] = response.data || [];

        // Si no hay ubicación seleccionada, actualiza el centro del mapa y las coordenadas del marcador
        if (!selectedLocation) {
          setMapCenter(moreliaCoords);
          setMarkerCoords(moreliaCoords);
          setMapHeight("500px"); // Ajusta el tamaño según tus necesidades
        }
      } else {
        setLocationSuggestions([]);
      }
    } catch (error) {
      console.error(
        "Error al obtener sugerencias de ubicación:",
        error.message
      );
    }
  };

  // Dentro de handleLocationSelect
  const handleLocationSelect = (suggestion) => {
    setSelectedLocation(suggestion);
    setLocationSuggestions([]); // Oculta las sugerencias después de la selección

    // Actualizar las coordenadas del marcador
    setMarkerCoords([suggestion.lat, suggestion.lon]);

    // No es necesario setMapCenter aquí, ya que se manejará automáticamente en el componente Map

    setMapHeight("500px"); // Ajusta el tamaño según tus necesidades
  };

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.lat, selectedLocation.lon]);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesCollection = collection(firestore, "propiedades");
        const propiedadesSnapshot = await getDocs(propiedadesCollection);

        const nuevasPropiedades = [];
        propiedadesSnapshot.forEach((doc) => {
          const propiedadData = doc.data();
          const propiedad = {
            key: doc.id,
            ...propiedadData,
          };
          nuevasPropiedades.push(propiedad);
        });

        // Filtrar propiedades según el término de búsqueda y los filtros de la tabla
        const filteredPropiedades = nuevasPropiedades.filter(
          (propiedad) =>
            Object.entries(tableFilters).every(([key, filter]) =>
              filter(propiedad[key])
            ) &&
            Object.values(propiedad).some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        setDataSource(filteredPropiedades);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchData();
  }, [searchTerm, tableFilters]);

  const [featuresChecked, setFeaturesChecked] = useState({});

  const handleFeatureCheck = (feature) => {
    setFeaturesChecked((prevState) => ({
      ...prevState,
      [feature]: !prevState[feature],
    }));
  
    // Actualiza el estado de cardsActivadas
    setCardsActivadas((prevCards) => ({
      ...prevCards,
      [feature]: !prevCards[feature],
    }));
  
    // Si la característica es "Habitaciones" y está activada, inicializa los detalles de las habitaciones
    if (feature === "Habitaciones" && !featuresChecked[feature]) {
      // Inicializa los detalles de las habitaciones solo si no están ya inicializados
      setHabitacionesDetails((prevDetails) => {
        if (prevDetails.length === 0) {
          // Agrega lógica para obtener el número de habitaciones desde los valores del formulario
          const numHabitaciones = form.getFieldValue("habitaciones");
          return [...Array(numHabitaciones)].map(() => ({}));
        }
        return prevDetails;
      });
    }
  };
  

  // Manejador para agregar propiedades
  const handleAdd = () => {
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  // Manejador para editar propiedades
  const handleEdit = (record) => {
    form.setFieldsValue({ ...record, imagen: [] });
    setIsModalVisible(true);
  };

  const onFormSubmit = async (values, step) => {
    // Validar que todos los campos obligatorios estén llenos
    if (step === 0 && (!values.nombre || !values.ubicacion || !values.precio)) {
      notification.error({
        message: "Error al guardar en Firebase",
        description: "Por favor, completa todos los campos obligatorios.",
      });
      return;
    }
  
    // Añadir datos al objeto global formData
    formData = {
      ...formData,
      ...values,
      youtubeUrl,
      ubicacion: selectedLocation?.display_name,
    };
  
    // Manejar específicamente la asignación de valores para tipoPropiedad y condicion
    if (step === 0) {
      formData.tipoPropiedad = values.tipoPropiedad || "";
      formData.condicion = values.condicion || "";
    }
  
// Añadir detalles de habitaciones al objeto formData
if (featuresChecked["Habitaciones"] && values.habitaciones > 0) {
  // Aquí es donde `feature` está definida como "Habitaciones"
  formData = {
    ...formData,
    habitaciones: values.habitaciones,
    habitacionesDetails: habitacionesDetails || [], // Asegúrate de que habitacionesDetails no sea undefined
  };
}

  
    // Si es el último paso, enviar a Firebase
    if (step === 3) {
      try {
        // Verificar que app está definido
        if (typeof app !== "undefined") {
          // Verificar que hay fotos antes de intentar acceder a values.fotos
          if (
            values.fotos &&
            values.fotos.fileList &&
            values.fotos.fileList.length > 0
          ) {
            // Crear un identificador único para la imagen
            const imageId = Date.now().toString();
  
            // Subir cada imagen a Firebase Storage
            const uploadTasks = values.fotos.fileList.map(
              async (photo, index) => {
                const storageRef = ref(
                  storage,
                  `propiedades/${imageId}_${index}`
                );
                await uploadBytes(storageRef, photo.originFileObj);
  
                // Obtener la URL de descarga
                const imageURL = await getDownloadURL(storageRef);
  
                return imageURL;
              }
            );
  
            // Esperar a que todas las imágenes se suban
            const imageUrls = await Promise.all(uploadTasks);
  
            // Añadir las referencias de las imágenes a los datos
            formData = { ...formData, fotos: imageUrls, youtubeUrl };
  
            // Añadir características activas al formulario
            formData = { ...formData, cardsActivadas };
  
            // Guardar en Firestore
            const propiedadesCollection = collection(firestore, "propiedades");
            await addDoc(propiedadesCollection, formData);
  
            notification.success({
              message: "Propiedad guardada",
              description: "La propiedad ha sido guardada con éxito.",
            });
  
            setIsModalVisible(false);
          } else {
            console.error(
              "No se proporcionaron fotos en el formulario. Por favor, selecciona al menos una foto."
            );
            throw new Error(
              "No se proporcionaron fotos en el formulario. Por favor, selecciona al menos una foto."
            );
          }
        } else {
          throw new Error("Firebase no está definido");
        }
      } catch (error) {
        console.error("Error al guardar en Firebase:", error);
        notification.error({
          message: "Error al guardar en Firebase",
          description:
            error.message ||
            "Ocurrió un error al intentar guardar la propiedad.",
        });
      }
    } else {
      // Si no es el último paso, avanzar al siguiente
      nextStep();
    }
  };
  
  

  // Manejador para el cambio en la carga de archivos
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Funcion para ELIMINAR propiedades
  const deleteProperty = async (propertyId) => {
    try {
      const propiedadesCollection = collection(firestore, "propiedades");
      await deleteDoc(doc(propiedadesCollection, propertyId));

      // Actualizar el estado local eliminando la propiedad
      setDataSource((prevDataSource) =>
        prevDataSource.filter((property) => property.key !== propertyId)
      );

      notification.success({
        message: "Propiedad eliminada",
        description: "La propiedad ha sido eliminada con éxito.",
      });
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      notification.error({
        message: "Error al eliminar propiedad",
        description:
          error.message ||
          "Ocurrió un error al intentar eliminar la propiedad.",
      });
    }
  };

  const handleDelete = (propertyId) => {
    Modal.confirm({
      title: "Confirmar eliminación",
      content: "¿Estás seguro de que deseas eliminar esta propiedad?",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteProperty(propertyId);
      },
    });
  };

  // Previsualización de imágenes
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  // Función para manejar la búsqueda
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propiedadesCollection = collection(firestore, "propiedades");
        const propiedadesSnapshot = await getDocs(propiedadesCollection);

        const nuevasPropiedades = [];
        propiedadesSnapshot.forEach((doc) => {
          const propiedadData = doc.data();
          const propiedad = {
            key: doc.id,
            ...propiedadData,
          };
          nuevasPropiedades.push(propiedad);
        });

        // Filtrar propiedades según el término de búsqueda
        const filteredPropiedades = nuevasPropiedades.filter((propiedad) =>
          Object.values(propiedad).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

        setDataSource(filteredPropiedades);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const columns = [
    {
      title: "Imagen",
      dataIndex: "fotos",
      key: "imagen",
      render: (fotos) => (
        <img
          src={fotos && fotos.length > 0 ? fotos[0] : ""}
          alt="Propiedad"
          style={{ width: "100px", height: "100Itzpx", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Tipo de Propiedad",
      dataIndex: "tipoPropiedad",
      key: "tipoPropiedad",
      filters: [
        { text: "Casa", value: "Casa" },
        { text: "Departamento", value: "Departamento" },
        // Agrega más opciones según sea necesario
      ],
      onFilter: (value, record) => record.tipoPropiedad === value,
    },
    {
      title: "Condición",
      dataIndex: "condicion",
      key: "condicion",
      filters: [
        { text: "Venta", value: "venta" },
        { text: "Renta", value: "renta" },
        // Agrega más opciones según sea necesario
      ],
      onFilter: (value, record) => record.condicion === value,
    },
    {
      title: "Ubicación",
      dataIndex: "ubicacion",
      key: "ubicacion",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      sorter: (a, b) => a.precio - b.precio, // Agrega esta línea para permitir ordenar por precio
      sortDirections: ["ascend", "descend"],
    },

    // Puedes añadir más columnas como descripción y características si lo necesitas
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button danger onClick={() => handleDelete(record.key)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  function getYouTubeVideoId(url) {
    // Expresión regular para extraer el ID del video de una URL de YouTube
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    // Si se encontró un ID, devuelve el primer grupo capturado (ID del video)
    return match ? match[1] : null;
  }

  const sections = {
    Recamaras: ["Habitaciones"],
    "Interiores / Exteriores": ["Baño", "Cocina", "Jardín", "Terraza", "Ático"],
    Estacionamiento: ["Cochera"],
    "Seguridad / Tecnología": [
      "Alarma",
      "Cámaras de seguridad",
      "Sistema de sonido",
    ],
    Extras: ["Bodega", "Vestidor", "Chimenea", "Aire acondicionado"],
    OtrasCaracteristicas: [
      "Amueblado",
      "Mascotas permitidas",
      "Vista panorámica",
    ],
    "Amenidades del Edificio": [
      "Gimnasio",
      "Piscina",
      "Salón de eventos",
      "Área de juegos",
    ],
    Vistas: ["Vista al mar", "Vista a la montaña", "Vista a la ciudad"],
    // Puedes agregar más secciones y características según sea necesario
  };

  return (
    <div>
      <h1>Propiedades</h1>
      <Space direction="vertical">
        <Button type="primary" onClick={handleAdd}>
          Añadir propiedad
        </Button>
        <Input.Search
          placeholder="Buscar propiedad"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => {
            if (e.target.value === "") {
              setSearchTerm("");
            }
          }}
        />
      </Space>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Propiedad"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        style={{ minWidth: "800px" }} // Ajuste para asegurar un ancho mínimo
      >
        <Steps current={currentStep} style={{ marginBottom: "20px" }}>
          <Step title="Información Básica" />
          <Step title="Descripción" />
          <Step title="Características" />
          <Step title="Fotos" />
        </Steps>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onFormSubmit(values, currentStep)}
        >
          {currentStep === 0 && (
            <>
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[
                  { required: true, message: "Por favor ingresa el nombre" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tipo de Propiedad"
                name="tipoPropiedad"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona el tipo de propiedad",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Casa">Casa</Select.Option>
                  <Select.Option value="Departamento">
                    Departamento
                  </Select.Option>
                  {/* Agrega más opciones según sea necesario */}
                </Select>
              </Form.Item>
              <Form.Item
                label="Condición"
                name="condicion"
                rules={[
                  {
                    required: true,
                    message: "Por favor selecciona la condición",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Venta">Venta</Radio>
                  <Radio value="Renta">Renta</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Ubicación"
                name="ubicacion"
                rules={[
                  { required: true, message: "Por favor ingresa la ubicación" },
                ]}
              >
                <Input
                  onChange={(e) => handleLocationChange(e.target.value)}
                  value={selectedLocation ? selectedLocation.display_name : ""}
                />
              </Form.Item>

              {locationSuggestions.length > 0 && (
                <ul>
                  {locationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion.display_name}
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
              <Form.Item
                label="Precio"
                name="precio"
                rules={[
                  { required: true, message: "Por favor ingresa el precio" },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item
                label="Ubicación en Mapa"
                style={{ height: mapHeight }}
              >
                <div
                  style={{
                    position: "relative",
                    height: mapHeight,
                    marginBottom: "20px",
                  }}
                >
                  <Map
                    height="500px"
                    width="100%"
                    markerCoords={markerCoords}
                  />
                </div>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item label="Descripción" name="descripcion">
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label="Características adicionales"
                name="caracteristicas"
              >
                <Input />
              </Form.Item>
            </>
          )}

{currentStep === 2 && (
  <>
    <Divider>Características</Divider>
    {Object.entries(sections).map(([section, featuresInSection], sectionIndex) => (
      <div key={sectionIndex} style={{ marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px", color: "#1890ff" }}>{section}</h3>
        <Row gutter={16}>
          {featuresInSection.map((feature, featureIndex) => (
            <Col span={8} key={featureIndex} style={{ marginBottom: "10px" }}>
              <Card
                hoverable
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  border: featuresChecked[feature]
                    ? "2px solid #1890ff"
                    : "1px solid #d9d9d9",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => handleFeatureCheck(feature)}
              >
                {/* Agrega iconos según sea necesario */}
                <p style={{ marginTop: "5px", textAlign: "center", fontSize: "14px" }}>
                  {feature}
                </p>
              </Card>
              {/* Agrega un campo numérico para características específicas */}
              {feature === "Habitaciones" && featuresChecked[feature] && (
                <>
                 <Form.Item
  name="habitaciones"
  rules={[
    {
      validator: async (_, value) => {
        if (value === undefined || habitacionesDetails.length !== value) {
          throw new Error("Ingresa el número correcto de habitaciones");
        }
      },
    },
  ]}
>
  <InputNumber
    style={{ width: "100%" }}
    min={0}
    placeholder="Número de habitaciones"
    onChange={(value) => {
      setHabitacionesDetails([...Array(value)].map(() => ({})));
    }}
  />
</Form.Item>


                  {/* Detalles de Habitaciones */}
                  <Divider>Detalles de Habitaciones</Divider>
                  <Row gutter={[16, 16]}>
                    {[...Array(habitacionesDetails.length)].map((_, index) => (
                      <Col span={24} key={index} style={{ marginBottom: "20px" }}>
                      <h3 style={{ marginBottom: "10px", color: "#1890ff" }}>
                        Recámara {index + 1}
                      </h3>
                      <div style={{ display: "flex", justifyContent: "space-around" }}>
                      <Form.Item
  label={`Baño`}
  name={`habitacion_${index}_bano`}
  style={{ marginBottom: 0 }}
>
  <Checkbox />
</Form.Item>
<Form.Item
  label={`Vestidor`}
  name={`habitacion_${index}_vestidor`}
  style={{ marginBottom: 0 }}
>
  <Checkbox />
</Form.Item>

                        {/* Agrega más campos según sea necesario */}
                      </div>
                    </Col>
                    
                    ))}
                  </Row>
                </>
              )}
              {/* Agrega más lógica para otras características específicas */}
            </Col>
          ))}
        </Row>
      </div>
    ))}
    {/* Mejoras visuales para Tamaño y Construcción */}
    <Divider>Tamaño y Construcción</Divider>
    <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
      <Col span={12}>
        <Form.Item
          label="Tamaño de la Propiedad"
          name="tamanioPropiedad"
          rules={[
            {
              required: true,
              message: "Ingresa el tamaño de la propiedad",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <FontAwesomeIcon
          icon={faHome}
          style={{ fontSize: "16px", marginRight: "8px" }}
        />
      </Col>
      <Col span={12}>
        <Form.Item
          label="Metros Construidos"
          name="metrosConstruidos"
          rules={[
            {
              required: true,
              message: "Ingresa los metros construidos",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <FontAwesomeIcon
          icon={faRulerCombined}
          style={{ fontSize: "16px", marginRight: "8px" }}
        />
      </Col>
    </Row>
  </>
)}


          {currentStep === 3 && (
            <>
              <Form.Item label="Fotos" name="fotos">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  onPreview={onPreview}
                  beforeUpload={() => false}
                >
                  {fileList.length < 50 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Subir</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Form.Item label="URL de YouTube" name="youtubeUrl">
                <Input
                  placeholder="Inserta la URL de YouTube"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    // Actualiza el estado con la nueva URL de YouTube
                  }}
                />
              </Form.Item>

              {youtubeUrl && (
                <YouTube
                  videoId={getYouTubeVideoId(youtubeUrl)}
                  opts={{ width: "100%", height: 315 }}
                />
              )}
            </>
          )}

          <Divider />

          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prevStep}>
              Anterior
            </Button>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default Propiedades;
