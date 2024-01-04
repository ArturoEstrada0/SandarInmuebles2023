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
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios"; // Importa Axios

import { app, firestore } from "../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import YouTube from "react-youtube";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconUrl from "../../assets/img/logo.png"; // Reemplaza con la ruta correcta de tu marcador

// Antes de tu función Propiedades()
const storage = getStorage(app);

const { Step } = Steps;

// Antes de la función Propiedades()
let formData = {
  youtubeUrl: "", // Agrega el campo para la URL de YouTube
};

function Propiedades() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubePreview, setYoutubePreview] = useState("");
  const [mapHeight, setMapHeight] = useState("300px"); // Tamaño inicial
  const [mapCenter, setMapCenter] = useState([0, 0]); // Centro inicial

  // Agrega un estado para las sugerencias de ubicación y la ubicación seleccionada
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Manejador para el cambio en la entrada de ubicación
  const handleLocationChange = async (newLocation) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          newLocation
        )}`
      );
      // Establecer la ubicación seleccionada a null al cambiar la entrada
      setSelectedLocation(null);

      // Actualizar las sugerencias solo si hay cambios en la entrada
      if (newLocation.trim() !== "") {
        setLocationSuggestions(response.data || []);
      } else {
        setLocationSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  // Manejador para seleccionar una ubicación de las sugerencias
  const handleLocationSelect = (suggestion) => {
    setSelectedLocation(suggestion);
    setLocationSuggestions([]); // Oculta las sugerencias después de la selección

    // Actualizar el centro del mapa y el tamaño
    setMapCenter([suggestion.lat, suggestion.lon]);
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

        setDataSource(nuevasPropiedades);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchData();
  }, []); // Este efecto se ejecutará solo una vez al montar el componente

  const [features] = useState([
    "Baño",
    "Medios Baños",
    "Habitaciones",
    "Cocina",
    "Patio",
    "Jardín",
    "Oficina/estudio",
    "Lavadero",
    "Sótano",
    "Ático",
    "Closets",
    "Terraza",
    "Cochera",
    "Numero de pisos",
  ]);

  const [featuresChecked, setFeaturesChecked] = useState({
    Baño: false,
    "Medios Baños": false,
    Habitaciones: false,
    Cocina: false,
    Patio: false,
    Jardín: false,
    "Oficina/estudio": false,
    Lavadero: false,
    Sótano: false,
    Ático: false,
    Closets: false,
    Terraza: false,
    Cochera: false,
    "numero de pisos": false,
  });
  const [featuresCount, setFeaturesCount] = useState({
    Baño: 0,
    "Medios Baños": 0,
    Habitaciones: 0,
    Cocina: 0,
    Patio: 0,
    Jardín: 0,
    "Oficina/estudio": 0,
    Lavadero: 0,
    Sótano: 0,
    Ático: 0,
    Closets: 0,
    Terraza: 0,
    Cochera: 0,
    "Numero de pisos": 0,
  });

  const handleFeatureCheck = (feature) => {
    setFeaturesChecked((prevState) => ({
      ...prevState,
      [feature]: !prevState[feature],
    }));
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

  // Manejador para el envío del formulario
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

    // Si es el último paso, enviar a Firebase
    if (step === 3) {
      try {
        // Verificar si app está definido
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
                  getStorage(app),
                  `propiedades${imageId}_${index}`
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
            const activeFeatures = features.reduce((acc, feature) => {
              if (featuresChecked[feature]) {
                acc[feature] = featuresCount[feature];
              }
              return acc;
            }, {});

            formData = { ...formData, activeFeatures };

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
    console.log("Buscar:", value);
    // Implementa aquí tu lógica de búsqueda
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFeatureIncrement = (feature) => {
    setFeaturesCount((prevState) => {
      let incrementValue = 1;
      return { ...prevState, [feature]: prevState[feature] + incrementValue };
    });
  };

  const handleFeatureDecrement = (feature) => {
    setFeaturesCount((prevState) => {
      let decrementValue = 1;
      if (prevState[feature] - decrementValue >= 0) {
        return { ...prevState, [feature]: prevState[feature] - decrementValue };
      } else {
        return prevState; // Mantener el mismo estado si el valor resultante es negativo.
      }
    });
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
      title: "Ubicación",
      dataIndex: "ubicacion",
      key: "ubicacion",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
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

  const defaultPosition = [0, 0]; // Posición por defecto del marcador antes de seleccionar una ubicación

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
              {features.map((feature, index) => (
                <Row
                  align="middle"
                  gutter={16}
                  key={index}
                  style={{ marginBottom: "10px" }}
                >
                  <Col span={8}>
                    <Checkbox
                      checked={featuresChecked[feature]}
                      onChange={() => handleFeatureCheck(feature)}
                    >
                      {feature}
                    </Checkbox>
                  </Col>
                  <Col span={4}>
                    {featuresChecked[feature] ? featuresCount[feature] : "-"}
                  </Col>
                  <Col span={6}>
                    <Button
                      disabled={!featuresChecked[feature]}
                      onClick={() => handleFeatureIncrement(feature)}
                    >
                      +
                    </Button>
                  </Col>
                  <Col span={6}>
                    <Button
                      disabled={
                        !featuresChecked[feature] || featuresCount[feature] <= 0
                      }
                      onClick={() => handleFeatureDecrement(feature)}
                    >
                      -
                    </Button>
                  </Col>
                </Row>
              ))}
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
                  {fileList.length < 5 && (
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

          {/* Coloca el mapa debajo del campo "Precio" */}
          <Form.Item label="Ubicación en Mapa" style={{ height: mapHeight }}>
            <div
              style={{
                position: "relative",
                height: mapHeight,
                marginBottom: "20px",
              }}
            >
              <MapContainer
                center={
                  selectedLocation
                    ? [selectedLocation.lat, selectedLocation.lon]
                    : defaultPosition
                }
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                containerElement={<div style={{ height: "100%" }} />}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lon]}
                    eventHandlers={{
                      click: () => console.log("Marker clicked!"),
                    }}
                    icon={L.icon({
                      iconUrl: markerIconUrl, // Utiliza la ruta importada
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                    })}
                  >
                    <Popup>{selectedLocation.display_name}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </Form.Item>

          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prevStep}>
              Anterior
            </Button>
          )}
          {currentStep < 3 && (
            <Button type="primary" onClick={nextStep}>
              Siguiente
            </Button>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default Propiedades;
