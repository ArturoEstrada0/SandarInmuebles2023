// PropertyList.jsx
import { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Select,
  Card,
  Button,
  Typography,
  Spin,
  Input,
  Modal,
  Carousel,
  Form,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  EnvironmentFilled,
  YoutubeOutlined,
  WhatsAppOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import "./PropertyList.css";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  getDoc,
  query,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRulerCombined, faToilet } from "@fortawesome/free-solid-svg-icons";
import { faBath, faBed, faSearch } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";

import CustomCarousel from "./Carousel";

import m2Image from "../../assets/img/m2.png";
import logo from "../../assets/img/sandarNegativo.png";
import fondoSandar from "../../assets/img/sandarPresentacion.png";

const { Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const PropertyList = ({ onPropertyClick }) => {
  const [propertyClickCount, setPropertyClickCount] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [filterPrice, setFilterPrice] = useState([0, 1000000]);
  const [filterState, setFilterState] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all"); // Cambia el nombre del estado
  const [contactInfo, setContactInfo] = useState(null);

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [visibleRows, setVisibleRows] = useState(50); // Estado para controlar el número de filas visibles

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { isAuthenticated, user } = useAuth(); // Agrega esta línea para obtener el estado de autenticación y el usuario actual

  useEffect(() => {
    // Verifica si el usuario está autenticado
    setUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactCollectionRef = collection(firestore, "contactData");
        const q = query(contactCollectionRef);
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setContactInfo(doc.data());
        });

        const contactDocRef = doc(firestore, "contactData", "contactInfo");
        const docSnap = await getDoc(contactDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
        }
      } catch (error) {
        console.error("Error al obtener la información de contacto:", error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setMaxPrice(value);
    }
  };

  const handleShowMoreClick = () => {
    setVisibleRows(visibleRows + 3); // Incrementar el número de filas visibles al hacer clic en "Ver más"
  };

  const [propertyData, setPropertyData] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesSnapshot = await getDocs(
          collection(firestore, "propiedades")
        );
        const properties = propertiesSnapshot.docs
          .filter((doc) => doc.data().status === "activa") // Filtrar por el status "activa"
          .map((doc) => {
            const data = doc.data();
            const features = data.activeFeatures || {};

            return {
              id: doc.id,
              name: data.nombre,
              type: data.tipoPropiedad,
              condicion: data.condicion,
              price: data.precio,
              state: data.ubicacion,
              rooms: data.habitaciones || 0,
              bathrooms: data.baños || 0,
              area: data.tamanioPropiedad || 0,
              areaBuild: data.metrosConstruidos || 0,
              youtube: data.youtubeUrl || "",
              image: data.fotos,
            };
          });

        // Inicializa el estado propertyData con isFavorite para cada propiedad
        const initialPropertyData = properties.map((property) => ({
          ...property,
          isFavorite: false, // Inicializar el estado isFavorite para cada propiedad
        }));

        setPropertyData(initialPropertyData);
        setFilteredProperties(initialPropertyData);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchProperties();
  }, []);

  const [highlightedProperties, setHighlightedProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesSnapshot = await getDocs(
          collection(firestore, "propiedades")
        );
        const properties = propertiesSnapshot.docs
          .filter((doc) => doc.data().status === "activa") // Filtrar por el status "activa"
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        const highlighted = properties.filter(
          (property) => property.highlighted
        );

        setHighlightedProperties(highlighted);
      } catch (error) {
        console.error("Error al obtener propiedades:", error);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyClick = async (propertyId) => {
    // Incrementa el contador local

    setPropertyClickCount(propertyClickCount + 1);

    // Referencia al documento de la propiedad en Firestore
    const propertyDocRef = doc(
      collection(firestore, "propiedades"),
      propertyId
    );

    // Actualiza el contador en Firestore
    try {
      await updateDoc(propertyDocRef, {
        clickCount: increment(1), // Incrementa el valor actual en 1
      });

      // Llama a la función original pasada como prop (si es necesario)
      if (onPropertyClick) {
        onPropertyClick(propertyId);
      }
      const propertyURL = `/property/${propertyId}`;

      window.location.href = `/property/${propertyId}`;
    } catch (error) {
      console.error("Error al actualizar el contador en Firestore:", error);
    }
  };

  const [favoriteProperties, setFavoriteProperties] = useState([]);

  const toggleFavorite = async (propertyId) => {
    try {
      if (!isAuthenticated) {
        // Si el usuario no está autenticado, redirige a la página de inicio de sesión
        // o muestra un mensaje para iniciar sesión
        return;
      }

      const propertyIndex = propertyData.findIndex(
        (property) => property.id === propertyId
      );
      const updatedPropertyData = [...propertyData];
      updatedPropertyData[propertyIndex] = {
        ...updatedPropertyData[propertyIndex],
        isFavorite: !updatedPropertyData[propertyIndex].isFavorite,
      };

      setPropertyData(updatedPropertyData); // Actualiza el estado propertyData

      if (favoriteProperties.includes(propertyId)) {
        setFavoriteProperties(
          favoriteProperties.filter((id) => id !== propertyId)
        );
      } else {
        setFavoriteProperties([...favoriteProperties, propertyId]);
      }

      const propertyDocRef = doc(
        collection(firestore, "propiedades"),
        propertyId
      );

      await updateDoc(propertyDocRef, {
        favoriteCount: increment(
          favoriteProperties.includes(propertyId) ? -1 : 1
        ),
      });
    } catch (error) {
      console.error("Error al actualizar favoritos en Firestore:", error);
    }
  };

  const applyFilters = () => {
    const filtered = propertyData.filter((property) => {
      const isConditionMatch =
        filterCondition === "all" || property.condicion === filterCondition; // Modifica la lógica aquí

      const isTypeMatch = filterType === "all" || property.type === filterType;
      const isPriceMatch =
        (minPrice === "" || property.price >= parseInt(minPrice, 10)) &&
        (maxPrice === "" || property.price <= parseInt(maxPrice, 10));

      return isConditionMatch && isTypeMatch && isPriceMatch; // Actualiza aquí también
    });

    setFilteredProperties(filtered);
  };

  const [youtubeModalVisible, setYoutubeModalVisible] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");

  const handleYoutubeButtonClick = (youtubeUrl) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeUrl.match(regex);

    if (match) {
      const extractedVideoId = match[1];
      setVideoId(extractedVideoId);
      setYoutubeModalVisible(true);
    } else {
      console.error(
        "No se pudo encontrar el ID del video de YouTube en la URL proporcionada."
      );
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setYoutubeModalVisible(true);
  };

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);

  // Función para manejar cambios en los datos del usuario
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Función para abrir el modal
  const openModal = () => {
    setWhatsappModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setWhatsappModalVisible(false);
  };

  // Función para manejar el envío de datos
  const handleSubmit = (property) => {
    console.log(property);
    // Aquí puedes generar el mensaje de WhatsApp con los datos del usuario
    const message = `¡Hola! 👋\n\nEstoy interesad@ en la propiedad *${property.name}* ubicada en *${property.state}*. \n\nMi nombre es *${userData.name}* , mi teléfono es 📲 *${userData.phone}*  y mi correo electrónico es 📧 *${userData.email}*. \n\n¿Podrías proporcionarme más detalles sobre esta propiedad? 🏡\n\n🔗 URL de la propiedad: https://sandar-inmuebles.web.app/property/${property.id}`;

    // Abre la ventana de chat de WhatsApp con el mensaje predefinido
    window.open(
      `https://api.whatsapp.com/send?phone=${
        contactInfo.phoneNumber
      }&text=${encodeURIComponent(message)}`
    );

    // Cierra el modal después de enviar el mensaje
    closeModal();
  };

  return (
    <Content className="property-list">
      <div
        className="centered-card"
        style={{ paddingTop: "32px", paddingBottom: "32px" }}
      >
        <Card className="custom-card">
          <Title
            level={2}
            style={{
              background: "white",
              fontFamily: "Geometos",
              fontSize: "1.3rem",
            }}
          >
            <SearchOutlined /> Búsqueda de Propiedades
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Text strong>
                <HomeOutlined /> Tipo de Propiedad
              </Text>
              <Select
                value={filterType}
                onChange={(value) => setFilterType(value)}
                style={{ width: "100%" }}
              >
                <Option value="all">Todos</Option>
                <Option value="Casa">Casa</Option>
                <Option value="Departamento">Departamento</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Text strong>
                <DollarOutlined /> Rango de Precio
              </Text>
              <div style={{ display: "flex" }}>
                <Input
                  placeholder="Mínimo"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  style={{ width: "calc(50% - 8px)", marginRight: "8px" }}
                />
                <Input
                  placeholder="Máximo"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  style={{ width: "calc(50% - 8px)" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Text strong>
                <DollarOutlined /> Tipo de Venta o Renta
              </Text>
              <Select
                value={filterCondition}
                onChange={(value) => setFilterCondition(value)}
                style={{ width: "100%" }}
              >
                <Option value="all">Todos</Option>
                <Option value="Venta">Venta</Option>
                <Option value="Renta">Renta</Option>
              </Select>
            </Col>
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={6}
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <Button
                type="primary"
                onClick={applyFilters}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontFamily: "Geometos",
                }}
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  alt="Lupa de búsqueda"
                  style={{
                    width: "16px",
                    marginRight: "8px",
                  }}
                />
                Buscar
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
      {/* Sección para propiedades destacadas */}
      <div style={{ padding: "20px 0" }}>
        <Title level={3}>Propiedades Destacadas</Title>
        <Row gutter={[16, 16]}>
          {highlightedProperties.map((property) => (
            <Col key={property.id} xs={24}>
              <Card className="property-card">
                <Row gutter={[16, 16]}>
                  {/* Columna para la foto */}
                  <Col xs={24} sm={12} md={12} lg={8}>
                    <div
                      className="property-image-container"
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      {/* Renderiza la marca de venta o renta si es aplicable */}
                      {property.condicion === "Venta" && (
                        <div className="sale-mark">Venta</div>
                      )}
                      {property.condicion === "Renta" && (
                        <div className="rent-mark">Renta</div>
                      )}
                      <CustomCarousel images={property.fotos} />
                    </div>
                  </Col>
                  {/* Columna para la información */}
                  <Col xs={24} sm={12} md={12} lg={14}>
                    <div
                      className="property-name"
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      {/* Renderiza el nombre de propiedad */}
                      <Text
                        style={{
                          fontSize: "1.2rem",
                          color: "#1677ff",
                          fontWeight: "bold",
                        }}
                      >
                        {property.nombre}
                      </Text>
                    </div>

                    <div
                      className="property-location"
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      {/* Renderiza la ubicación */}
                      <Text
                        style={{
                          fontSize: "1.1rem",
                          color: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        <EnvironmentFilled
                          style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        />{" "}
                        {property.ubicacion}
                      </Text>
                    </div>

                    <div
                      className="property-price"
                      style={{ cursor: "pointer" }}
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      {/* Renderiza el precio */}
                      <Text
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        {" "}
                        $ {property.precio.toLocaleString()} MXN
                      </Text>
                    </div>
                    <div className="property-details">
                      {/* Renderiza los detalles de la propiedad */}
                      <Row
                        gutter={[16, 16]}
                        style={{ marginBottom: "16px", marginTop: "20px" }}
                      >
                        <Col xs={8}>
                          <Text strong style={{ fontSize: "1.2rem" }}>
                            {" "}
                            {/* Aumenta el tamaño del texto */}
                            <FontAwesomeIcon
                              icon={faBed}
                              style={{ fontSize: "2rem", fontWeight: "bold" }} // Aumenta el tamaño del ícono
                            />{" "}
                            Recámaras: {property.habitaciones}
                          </Text>
                        </Col>
                        <Col xs={8}>
                          <Text strong style={{ fontSize: "1.2rem" }}>
                            {" "}
                            {/* Aumenta el tamaño del texto */}
                            <FontAwesomeIcon
                              icon={faBath}
                              alt="Baños"
                              style={{ fontSize: "2rem", marginRight: "8px" }} // Aumenta el tamaño del ícono
                            />{" "}
                            Baños: {property.baños}
                          </Text>
                        </Col>
                        <Col xs={8}>
                          <Text strong style={{ fontSize: "1.2rem" }}>
                            {" "}
                            {/* Aumenta el tamaño del texto */}
                            <FontAwesomeIcon
                              icon={faToilet}
                              alt="Baños"
                              style={{ fontSize: "2rem", marginRight: "8px" }} // Aumenta el tamaño del ícono
                            />{" "}
                            Medios Baños: {property.medioBaño ?? 0}
                          </Text>
                        </Col>
                        <Col xs={8}>
                          <Text strong style={{ fontSize: "1.2rem" }}>
                            {" "}
                            {/* Aumenta el tamaño del texto */}
                            <HomeOutlined
                              style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                              }}
                            />{" "}
                            {property.tipoPropiedad}
                          </Text>
                        </Col>
                        <Col xs={8}>
                          <Text strong style={{ fontSize: "1.2rem" }}>
                            {" "}
                            {/* Aumenta el tamaño del texto */}
                            <img
                              src={m2Image}
                              alt="m2"
                              style={{
                                width: "2rem",
                                height: "2rem",
                                marginRight: "5px", // Ajusta según sea necesario
                              }}
                            />
                            {property.tamanioPropiedad} m²
                          </Text>
                        </Col>
                        <Col xs={8}>
                          <Text strong style={{ fontSize: "1.2rem" }}>
                            {" "}
                            {/* Aumenta el tamaño del texto */}
                            <FontAwesomeIcon
                              icon={faRulerCombined}
                              style={{
                                fontSize: "2rem",
                                marginRight: "5px",
                              }}
                            />
                            {property.metrosConstruidos} m²
                          </Text>
                        </Col>
                      </Row>
                    </div>
                    <div
                      className="property-actions"
                      style={{ display: "flex" }}
                    >
                      {/* Renderiza el botón de favoritos */}
                      {userAuthenticated ? (
                        <Button
                          type="primary"
                          icon={
                            property.isFavorite ? (
                              <HeartFilled />
                            ) : (
                              <HeartOutlined />
                            )
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }}
                        >
                          {property.isFavorite
                            ? "Quitar de Favoritos"
                            : "Añadir a Favoritos"}
                        </Button>
                      ) : (
                        <Link to="/login">
                          <Button type="primary">Añadir a Favoritos</Button>
                        </Link>
                      )}

                      {/* Contenedor para los botones de YouTube y WhatsApp */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "16px",
                        }}
                      >
                        {/* Botón de WhatsApp */}
                        <Button
                          type="primary"
                          style={{
                            backgroundColor: "#25D366",
                            borderColor: "#25D366",
                          }}
                          icon={<WhatsAppOutlined />}
                          onClick={openModal}
                        >
                          WhatsApp
                        </Button>

                        {/* Modal para solicitar datos del usuario */}
                        <Modal
                          title="Datos de Contacto"
                          visible={whatsappModalVisible}
                          onCancel={closeModal}
                          footer={[
                            <Button key="cancel" onClick={closeModal}>
                              Cancelar
                            </Button>,
                            <Button
                              key="submit"
                              type="primary"
                              onClick={() => handleSubmit(property)}
                            >
                              Enviar
                            </Button>,
                          ]}
                        >
                          {/* Logotipo */}
                          <div
                            style={{
                              textAlign: "center",
                              marginBottom: "20px",
                            }}
                          >
                            <img
                              src={logo}
                              alt="Sandar Inmuebles"
                              style={{ width: "50%", maxWidth: "200px" }}
                            />
                          </div>
                          <Form>
                            <Form.Item label="Nombre">
                              <Input
                                name="name"
                                value={userData.name}
                                onChange={handleUserDataChange}
                              />
                            </Form.Item>
                            <Form.Item label="Teléfono">
                              <Input
                                name="phone"
                                value={userData.phone}
                                onChange={handleUserDataChange}
                              />
                            </Form.Item>
                            <Form.Item label="Correo electrónico">
                              <Input
                                name="email"
                                value={userData.email}
                                onChange={handleUserDataChange}
                              />
                            </Form.Item>
                          </Form>
                        </Modal>
                        
                        {property.youtubeUrl !== "" && (
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#FF0000",
                              borderColor: "#FF0000",
                              marginLeft: "16px",
                            }}
                            icon={<YoutubeFilled />}
                            onClick={() =>
                              handleYoutubeButtonClick(property.youtubeUrl)
                            }
                          >
                            YouTube
                          </Button>
                        )}
                        {/* Modal para mostrar el video de YouTube y las fotos de la propiedad */}
                        <Modal
                          title="Detalles de la Propiedad"
                          visible={youtubeModalVisible}
                          onCancel={() => setYoutubeModalVisible(false)}
                          footer={null}
                          centered
                          width={1200}
                          bodyStyle={{ padding: "20px" }}
                        >
                          <Row gutter={[16, 16]}>
                            <Col span={16}>
                              {/* Video de YouTube */}
                              <iframe
                                width="100%"
                                height="450"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                frameborder="0"
                                allowfullscreen
                                title="YouTube Video"
                              ></iframe>
                            </Col>
                            <Col span={8}>
                              <Text>Fotos de la propiedad:</Text>
                              <div style={{ marginTop: "10px", width: "100%" }}>
                                <Carousel autoplay>
                                  {property.fotos.map((photo, index) => (
                                    <div key={index}>
                                      <img
                                        src={photo}
                                        alt={`Property Photo ${index}`}
                                        style={{
                                          width: "100%",
                                          height: "auto",
                                          objectFit: "cover",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => handlePhotoClick(photo)}
                                      />
                                    </div>
                                  ))}
                                </Carousel>
                              </div>
                              <div style={{ marginTop: "20px" }}>
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    handlePropertyClick(property.id)
                                  }
                                >
                                  Ver más detalles
                                </Button>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={logo}
                                  alt="Sandar Inmuebles"
                                  style={{ width: "50%" }}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
              <div className="logo-container">
                <img src={logo} alt="Sandar Inmuebles" className="logo" />
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Sección para propiedades filtradas */}
      <div style={{ padding: "20px 0" }}>
        <Title level={3}>Otras Propiedades</Title>
        <Row gutter={[16, 16]}>
          {loading ? (
            <Spin tip="Cargando..." />
          ) : (
            filteredProperties.slice(0, visibleRows).map((property) => (
              <Col key={property.id} xs={24}>
                <Card className="property-card">
                  <Row gutter={[16, 16]}>
                    {/* Columna para la foto */}
                    <Col xs={24} sm={12} md={12} lg={8}>
                      <div
                        className="property-image-container"
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        {/* Renderiza la marca de venta o renta si es aplicable */}
                        {property.condicion === "Venta" && (
                          <div className="sale-mark">Venta</div>
                        )}
                        {property.condicion === "Renta" && (
                          <div className="rent-mark">Renta</div>
                        )}
                        <CustomCarousel images={property.image} />
                      </div>
                    </Col>
                    {/* Columna para la información */}
                    <Col xs={24} sm={12} md={12} lg={16}>
                      <div
                        className="property-name"
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        {/* Renderiza el nombre de propiedad */}
                        <Text
                          style={{
                            fontSize: "1.2rem",
                            color: "#1677ff",
                            fontWeight: "bold",
                          }}
                        >
                          {property.name}
                        </Text>
                      </div>

                      <div
                        className="property-location"
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        {/* Renderiza la ubicación */}
                        <Text
                          style={{
                            fontSize: "1.1rem",
                            color: "#333",
                            fontWeight: "bold",
                          }}
                        >
                          <EnvironmentFilled
                            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                          />{" "}
                          {property.state}
                        </Text>
                      </div>

                      <div
                        className="property-price"
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        {/* Renderiza el precio */}
                        <Text
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                          onClick={() => handlePropertyClick(property.id)}
                        >
                          {" "}
                          $ {property.price.toLocaleString()} MXN
                        </Text>
                      </div>
                      <div className="property-details">
                        {/* Renderiza los detalles de la propiedad */}
                        <Row
                          gutter={[16, 16]}
                          style={{ marginBottom: "16px", marginTop: "20px" }}
                        >
                          <Col xs={8}>
                            <Text strong style={{ fontSize: "1.2rem" }}>
                              <FontAwesomeIcon
                                icon={faBed}
                                style={{ fontSize: "2rem", fontWeight: "bold" }}
                              />{" "}
                              Recámaras: {property.rooms}
                            </Text>
                          </Col>
                          <Col xs={8}>
                            <Text strong style={{ fontSize: "1.2rem" }}>
                              <FontAwesomeIcon
                                icon={faBath}
                                alt="Baños"
                                style={{ fontSize: "2rem", marginRight: "8px" }}
                              />{" "}
                              Baños: {property.bathrooms}
                            </Text>
                          </Col>
                          <Col xs={8}>
                            <Text strong style={{ fontSize: "1.2rem" }}>
                              <FontAwesomeIcon
                                icon={faToilet}
                                alt="Baños"
                                style={{ fontSize: "2rem", marginRight: "8px" }}
                              />{" "}
                              Medios Baños: {property.medioBaño ?? 0}
                            </Text>
                          </Col>
                          <Col xs={8}>
                            <Text strong style={{ fontSize: "1.2rem" }}>
                              <HomeOutlined
                                style={{
                                  fontSize: "2rem",
                                  fontWeight: "bold",
                                }}
                              />{" "}
                              {property.type}
                            </Text>
                          </Col>
                          <Col xs={8}>
                            <Text strong style={{ fontSize: "1.2rem" }}>
                              <img
                                src={m2Image}
                                alt="m2"
                                style={{
                                  width: "2rem",
                                  height: "2rem",
                                  marginRight: "5px",
                                }}
                              />
                              {property.area} m²
                            </Text>
                          </Col>
                          <Col xs={8}>
                            <Text strong style={{ fontSize: "1.2rem" }}>
                              <FontAwesomeIcon
                                icon={faRulerCombined}
                                style={{
                                  fontSize: "2rem",
                                  marginRight: "5px",
                                }}
                              />
                              {property.areaBuild} m²
                            </Text>
                          </Col>
                        </Row>
                      </div>
                      <div
                        className="property-actions"
                        style={{ display: "flex" }}
                      >
                        {/* Renderiza el botón de favoritos */}
                        {userAuthenticated ? (
                          <Button
                            type="primary"
                            icon={
                              property.isFavorite ? (
                                <HeartFilled />
                              ) : (
                                <HeartOutlined />
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(property.id);
                            }}
                          >
                            {property.isFavorite
                              ? "Quitar de Favoritos"
                              : "Añadir a Favoritos"}
                          </Button>
                        ) : (
                          <Link to="/login">
                            <Button type="primary">Añadir a Favoritos</Button>
                          </Link>
                        )}

                        {/* Contenedor para los botones de YouTube y WhatsApp */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "16px",
                          }}
                        >
                          {/* Botón de WhatsApp */}
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#25D366",
                              borderColor: "#25D366",
                            }}
                            icon={<WhatsAppOutlined />}
                            onClick={openModal}
                          >
                            WhatsApp
                          </Button>

                          {property.youtube !== "" && (
                            <Button
                              type="primary"
                              style={{
                                backgroundColor: "#FF0000",
                                borderColor: "#FF0000",
                                marginLeft: "16px",
                              }}
                              icon={<YoutubeFilled />}
                              onClick={() =>
                                handleYoutubeButtonClick(property.youtube)
                              }
                            >
                              YouTube
                            </Button>
                          )}

                          {/* Modal para solicitar datos del usuario */}
                          <Modal
                            title="Datos de Contacto"
                            visible={whatsappModalVisible}
                            onCancel={closeModal}
                            footer={[
                              <Button key="cancel" onClick={closeModal}>
                                Cancelar
                              </Button>,
                              <Button
                                key="submit"
                                type="primary"
                                onClick={() => handleSubmit(property)}
                              >
                                Enviar
                              </Button>,
                            ]}
                          >
                            {/* Logotipo */}
                            <div
                              style={{
                                textAlign: "center",
                                marginBottom: "20px",
                              }}
                            >
                              <img
                                src={logo}
                                alt="Sandar Inmuebles"
                                style={{ width: "50%", maxWidth: "200px" }}
                              />
                            </div>
                            <Form>
                              <Form.Item label="Nombre">
                                <Input
                                  name="name"
                                  value={userData.name}
                                  onChange={handleUserDataChange}
                                />
                              </Form.Item>
                              <Form.Item label="Teléfono">
                                <Input
                                  name="phone"
                                  value={userData.phone}
                                  onChange={handleUserDataChange}
                                />
                              </Form.Item>
                              <Form.Item label="Correo electrónico">
                                <Input
                                  name="email"
                                  value={userData.email}
                                  onChange={handleUserDataChange}
                                />
                              </Form.Item>
                            </Form>
                          </Modal>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {/* Logotipo */}
                  <div className="logo-container">
                    <img src={logo} alt="Sandar Inmuebles" className="logo" />
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* Botón "Ver más" */}
      {visibleRows < filteredProperties.length && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" onClick={handleShowMoreClick}>
            Ver más
          </Button>
        </div>
      )}
    </Content>
  );
};

export default PropertyList;
