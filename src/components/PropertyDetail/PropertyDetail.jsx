import { useEffect, useState } from "react";
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
  Carousel,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  FormOutlined,
  DollarCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";

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

import axios from "axios";

import { useParams } from "react-router-dom";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import "./PropertyDetail.css";
import Map from "../Map/Map";

import { firestore } from "../firebase/firebase";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const PropertyDetail = () => {
  const { id } = useParams();
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [activeKey, setActiveKey] = useState("");
  const [youtubeVideoCode, setYoutubeVideoCode] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [ubicacionCoords, setUbicacionCoords] = useState(null);

  const onCollapseChange = (key) => {
    setActiveKey(activeKey === key ? "" : key);
  };

  useEffect(() => {
    getPropertyDataFromFirebase();
  }, [id]);

  const getPropertyDataFromFirebase = async () => {
    try {
      const propertyDocRef = doc(firestore, "propiedades", id);
      const propertyDocSnapshot = await getDoc(propertyDocRef);

      if (propertyDocSnapshot.exists()) {
        const propertyData = propertyDocSnapshot.data();
        setPropertyDetails(propertyData);
        // Extrae el código del video de la URL de YouTube
        const videoCode = extractYoutubeVideoCode(propertyData.youtubeUrl);
        setYoutubeVideoCode(videoCode);
      } else {
        console.error(
          "No se encontró la propiedad con el ID proporcionado en Firebase."
        );
      }
    } catch (error) {
      console.error("Error al obtener datos de Firestore:", error);
    }
  };

  useEffect(() => {
    if (propertyDetails && propertyDetails.ubicacion) {
      // Llama a la función de conversión con la dirección obtenida desde Firebase
      convertirDireccionACoordenadas(propertyDetails.ubicacion);
    }
  }, [propertyDetails]);

  const convertirDireccionACoordenadas = async (direccion) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${direccion}`
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setUbicacionCoords([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
    }
  };

  // Función para extraer el código del video de YouTube
  const extractYoutubeVideoCode = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/
    );
    return match && match[1];
  };

  const handleContactFormSubmit = async (values) => {
    try {
      const contactCollection = collection(firestore, "msgpro");
      // Obtén la información específica de la propiedad
      const selectedProperty = propertyData.find(
        (property) => property.id.toString() === id
      );

      console.log("selectedProperty:", selectedProperty);

      if (!selectedProperty) {
        console.error("No se encontró la propiedad con el ID proporcionado.");
        return;
      }

      // Agrega información adicional al objeto values
      const contactDataWithPropertyInfo = {
        ...values,
        propertyId: id,
        propertyName: selectedProperty.type, // O usa selectedProperty.type, dependiendo de lo que necesites
      };

      console.log("Datos del mensaje:", contactDataWithPropertyInfo);

      await addDoc(contactCollection, contactDataWithPropertyInfo);
      message.success("¡Tu mensaje ha sido enviado con éxito!");
    } catch (error) {
      console.error("Error al enviar datos a Firestore:", error);
      message.error(
        "Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente."
      );
    }
  };

  if (!propertyDetails) {
    return <Spin tip="Cargando..." />;
  }

  const details = [
    { key: "Habitaciones", label: "Habitaciones" },
    { key: "Baño", label: "Baños" },
    { key: "Medio_bano", label: "Medios Baños" },
    { key: "Construccion", label: "Construcción" },
    { key: "Estacionamientos", label: "Estacionamientos" },
  ];

  const iconStyle = {
    color: "#1890ff", // Color azul, puedes ajustarlo según tu preferencia
  };

  const getIcon = (key) => {
    // Mapea las claves a los iconos correspondientes de Font Awesome
    const iconMapping = {
      "Aire acondicionado": (
        <FontAwesomeIcon icon={faSnowflake} style={iconStyle} />
      ),
      Alarma: <FontAwesomeIcon icon={faBell} style={iconStyle} />,
      Amueblado: <FontAwesomeIcon icon={faCouch} style={iconStyle} />,
      Baño: <FontAwesomeIcon icon={faBath} style={iconStyle} />,
      Bodega: <FontAwesomeIcon icon={faBox} style={iconStyle} />,
      "Cámaras de seguridad": (
        <FontAwesomeIcon icon={faVideo} style={iconStyle} />
      ),
      Cochera: <FontAwesomeIcon icon={faCar} style={iconStyle} />,
      Cocina: <FontAwesomeIcon icon={faUtensils} style={iconStyle} />,
      Gimnasio: <FontAwesomeIcon icon={faDumbbell} style={iconStyle} />,
      Habitaciones: <FontAwesomeIcon icon={faBed} style={iconStyle} />,
      Jardín: <FontAwesomeIcon icon={faTree} style={iconStyle} />,
      "Mascotas permitidas": <FontAwesomeIcon icon={faPaw} style={iconStyle} />,
      Piscina: <FontAwesomeIcon icon={faSwimmingPool} style={iconStyle} />,
      "Salón de eventos": (
        <FontAwesomeIcon icon={faGlassCheers} style={iconStyle} />
      ),
      "Sistema de sonido": (
        <FontAwesomeIcon icon={faVolumeUp} style={iconStyle} />
      ),
      Terraza: <FontAwesomeIcon icon={faHouseFlag} style={iconStyle} />,
      Vestidor: <FontAwesomeIcon icon={faTshirt} style={iconStyle} />,
      "Vista a la ciudad": <FontAwesomeIcon icon={faCity} style={iconStyle} />,
      "Vista a la montaña": (
        <FontAwesomeIcon icon={faMountain} style={iconStyle} />
      ),
      "Vista al mar": <FontAwesomeIcon icon={faWater} style={iconStyle} />,
      "Vista panorámica": (
        <FontAwesomeIcon icon={faBinoculars} style={iconStyle} />
      ),
      "Área de juegos": <FontAwesomeIcon icon={faChess} style={iconStyle} />,
      Ático: <FontAwesomeIcon icon={faHome} style={iconStyle} />,
      Chimenea: <FontAwesomeIcon icon={faFire} style={iconStyle} />,
      // Puedes agregar más iconos según sea necesario
    };

    return iconMapping[key] || null;
  };

  const formatLabel = (key) => {
    // Puedes personalizar el formato de la etiqueta según tus necesidades
    // Por ejemplo, puedes cambiar el formato de 'Área de juegos' a 'Área de Juegos'
    return key.replace(/(?:^|\s)\S/g, (match) => match.toUpperCase());
  };

  return (
    <Content style={{ marginTop: "65px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "30px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "none",
            border: "none",
          }}
        >
          <Title
            level={2}
            style={{
              fontFamily: "Arial, sans-serif",
              color: "#333",
              fontWeight: "bold",
              marginBottom: "10px",
              borderLeft: "3px solid #1890ff", // Agregar línea vertical a la izquierda del título
              paddingLeft: "16px", // Ajustar el espacio entre la línea y el texto
            }}
          >
            {/*{propertyDetails.type}*/}
            {propertyDetails.nombre}
          </Title>
          <div style={{ display: "flex", alignItems: "center" }}>
            <DollarCircleOutlined
              style={{
                fontSize: "2.5em",
                marginRight: "15px",
                color: "#1890ff",
              }}
            />
            <Title
              level={4}
              style={{
                fontFamily: "Arial, sans-serif",
                color: "#666",
                marginBottom: 0,
              }}
            >
              Precio: ${propertyDetails.precio}
            </Title>
          </div>
        </div>
        {/* Agrega aquí cualquier contenido que desees alinear a la derecha */}
      </div>
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div
              style={{
                flex: "1",
                width: "70vh",
                height: "60vh",
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >
              {propertyDetails &&
                propertyDetails.fotos &&
                propertyDetails.fotos.length > 0 && (
                  <Carousel autoplay>
                    {propertyDetails.fotos.map((foto, index) => (
                      <div key={index}>
                        <img
                          src={foto}
                          alt={`Property Image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "28rem",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                )}
            </div>
            <div
              style={{
                flex: "1",
                maxWidth: "30%",
                maxHeight: "60vh",
                padding: "0 20px",
              }}
            >
              <Card
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                }}
              >
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Title
                    level={4}
                    className="contact-title"
                    style={{ marginBottom: "5px" }}
                  >
                    SANDAR INMUEBLES
                  </Title>
                  <Title
                    level={4}
                    className="contact-title"
                    style={{ marginBottom: "20px" }}
                  >
                    CONTACTANOS Y PREGUNTA
                  </Title>
                </div>
                <Form
                  name="contact-form"
                  onFinish={handleContactFormSubmit}
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  style={{ flex: 1, overflowY: "auto" }}
                >
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresa tu nombre",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Nombre"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresa tu correo electrónico",
                      },
                      {
                        type: "email",
                        message: "Ingresa un correo electrónico válido",
                      },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="Correo Electrónico"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresa tu mensaje",
                      },
                    ]}
                  >
                    <Input.TextArea
                      prefix={<FormOutlined />}
                      placeholder="Mensaje"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", borderRadius: "8px" }}
                    >
                      Enviar Mensaje
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div style={{ padding: "20px" }}>
            <Title level={2}>Detalles de la Propiedad</Title>
            <Row gutter={[16, 16]}>
              {details.map((detail, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={8} xl={3}>
                  <Card
                    hoverable
                    title={detail.label}
                    size="small"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#f5f5f5",
                      minHeight: "80px",
                      padding: "8px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Title level={4} style={{ color: "#1890ff" }}>
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
              <div style={{ padding: "20px", backgroundColor: "#fcfeff" }}>
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />{" "}
                {/* Línea horizontal superior */}
                <Title level={2}>Información del inmueble</Title>
                <Row gutter={[16, 16]}>
                  {Object.entries(propertyDetails.cardsActivadas)
                    .filter(([key, value]) => value) // Filtra solo las características con valor true
                    .map(([key, value]) => (
                      <Col span={12} key={key}>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            fontSize: "17px",
                            lineHeight: "2",
                          }}
                        >
                          <li>
                            <strong>
                              {getIcon(key)}{" "}
                              {/* Función para obtener el ícono */}
                              {formatLabel(key)}:
                            </strong>{" "}
                            Sí
                          </li>
                        </ul>
                      </Col>
                    ))}
                </Row>
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />{" "}
                {/* Línea horizontal inferior */}
              </div>
            </Col>

            {/* Descripción */}
            <Col>
              <div style={{ padding: "20px", backgroundColor: "#fcfeff" }}>
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />

                <Title level={2}>Descripción</Title>
                <Paragraph style={{ fontSize: "17px", color: "#333" }}>
                  {propertyDetails.descripcion}
                </Paragraph>
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />
              </div>
            </Col>

            {/* Mapa demostrativo */}
            <Col span={24}>
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#fcfeff",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />
                <Map
                  height={"400px"}
                  width={"100%"}
                  markerCoords={ubicacionCoords}
                />
              </div>
            </Col>

            {youtubeVideoCode && (
              <div
                style={{
                  marginTop: "20px",
                  width: "50%",
                  margin: "0 auto",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeVideoCode}?controls=1&showinfo=0&fs=1`}
                  title="YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "8px" }}
                ></iframe>
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#333",
                      fontFamily: "Geometos",
                    }}
                  >
                    {propertyDetails.nombre +
                      "  $" +
                      propertyDetails.precio +
                      " MXN"}
                  </p>
                </div>
              </div>
            )}
            <Col span={24}>
              {/* Nuevo apartado "Precio y Contrato" */}
              <div style={{ padding: "20px", backgroundColor: "#fcfeff" }}>
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />
                <div className="header">
                  <Title level={2}>Informacion del inmueble</Title>
                </div>
                <div className="button-group">
                  <Button
                    className={`custom-button ${
                      activeKey === "Habitaciones" ? "active" : ""
                    }`}
                    onClick={() => onCollapseChange("Habitaciones")}
                  >
                    Habitaciones
                  </Button>
                  <Button
                    className={`custom-button ${
                      activeKey === "Interiores/Exteriores" ? "active" : ""
                    }`}
                    onClick={() => onCollapseChange("Interiores/Exteriores")}
                  >
                    Interiores/Exteriores
                  </Button>
                  <Button
                    className={`custom-button ${
                      activeKey === "Estacionamiento" ? "active" : ""
                    }`}
                    onClick={() => onCollapseChange("Estacionamiento")}
                  >
                    Estacionamiento
                  </Button>
                  <Button
                    className={`custom-button ${
                      activeKey === "Seguridad/Tecnologiá" ? "active" : ""
                    }`}
                    onClick={() => onCollapseChange("Seguridad/Tecnologiá")}
                  >
                    Seguridad/Tecnologiá
                  </Button>
                </div>
                <div className="content-container">
                  {/* Mostrar información dinámicamente desde Firebase */}
                  {activeKey === "Habitaciones" && (
                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Card para mostrar el número de habitaciones */}
                      <Card
                        title="Número de Habitaciones"
                        style={{
                          width: 300,
                          margin: "10px",
                          borderRadius: "12px",
                        }}
                      >
                        <p>{propertyDetails.habitaciones}</p>
                      </Card>

                      {/* Otras cards relacionadas a Habitaciones... */}
                      <Card
                        title="Habitaciones Disponibles"
                        style={{
                          width: 300,
                          margin: "10px",
                          borderRadius: "12px",
                        }}
                      >
                        <p>{propertyDetails.Habitaciones ? "Sí" : "No"}</p>
                      </Card>
                      {/* Agrega más propiedades según sea necesario... */}
                    </div>
                  )}
                  {activeKey === "Interiores/Exteriores" && (
                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Card para mostrar detalles de Interiores/Exteriores */}
                      <Card
                        title="Interiores/Exteriores"
                        style={{
                          width: 300,
                          margin: "10px",
                          borderRadius: "12px",
                        }}
                      >
                        <p>
                          Características: {propertyDetails.caracteristicas}
                        </p>
                        <p>Jardín: {propertyDetails.Jardín ? "Sí" : "No"}</p>
                        <p>
                          Área de juegos:{" "}
                          {propertyDetails["Área de juegos"] ? "Sí" : "No"}
                        </p>
                        <p>Ático: {propertyDetails.Ático ? "Sí" : "No"}</p>
                        <p>
                          Vista a la ciudad:{" "}
                          {propertyDetails["Vista a la ciudad"] ? "Sí" : "No"}
                        </p>
                        <p>
                          Vista a la montaña:{" "}
                          {propertyDetails["Vista a la montaña"] ? "Sí" : "No"}
                        </p>
                        {/* ... (otros detalles) */}
                      </Card>
                      {/* Agrega más cards relacionadas a Interiores/Exteriores... */}
                    </div>
                  )}
                  {activeKey === "Estacionamiento" && (
                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Card para mostrar detalles de Estacionamiento */}
                      <Card
                        title="Estacionamiento"
                        style={{
                          width: 300,
                          margin: "10px",
                          borderRadius: "12px",
                        }}
                      >
                        <p>Cochera: {propertyDetails.Cochera ? "Sí" : "No"}</p>
                        <p>Piscina: {propertyDetails.Piscina ? "Sí" : "No"}</p>
                        {/* Agrega más propiedades según sea necesario... */}
                      </Card>
                      {/* Agrega más cards relacionadas a Estacionamiento... */}
                    </div>
                  )}
                  {activeKey === "Seguridad/Tecnologiá" && (
                    <div
                      style={{
                        marginTop: "20px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Card para mostrar detalles de Seguridad/Tecnología */}
                      <Card
                        title="Seguridad/Tecnología"
                        style={{
                          width: 300,
                          margin: "10px",
                          borderRadius: "12px",
                        }}
                      >
                        <p>Alarma: {propertyDetails.Alarma ? "Sí" : "No"}</p>
                        <p>
                          Aire acondicionado:{" "}
                          {propertyDetails["Aire acondicionado"] ? "Sí" : "No"}
                        </p>
                        <p>
                          Cámaras de seguridad:{" "}
                          {propertyDetails["Cámaras de seguridad"]
                            ? "Sí"
                            : "No"}
                        </p>
                        <p>
                          Gimnasio: {propertyDetails.Gimnasio ? "Sí" : "No"}
                        </p>
                        {/* Agrega más propiedades según sea necesario... */}
                      </Card>
                      {/* Agrega más cards relacionadas a Seguridad/Tecnología... */}
                    </div>
                  )}
                </div>
                <hr
                  style={{
                    borderTop: "2px solid #1890ff",
                    margin: "0",
                    marginBottom: "16px",
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Content>
  );
};

export default PropertyDetail;
