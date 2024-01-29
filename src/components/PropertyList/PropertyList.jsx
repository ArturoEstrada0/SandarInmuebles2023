// PropertyList.jsx
import { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Select,
  Card,
  Slider,
  Button,
  Typography,
  Image,
  Spin,
  Input,
  Carousel,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  TeamOutlined,
  AreaChartOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  ToolOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import "./PropertyList.css";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRulerCombined, faM, fa2 } from "@fortawesome/free-solid-svg-icons";
import {
  faBath,
  faBed,
  faMapMarker,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";

import CustomCarousel from "./Carousel";

import m2Image from "../../assets/img/m2.png";

const { Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const PropertyList = ({ onPropertyClick }) => {
  const [propertyClickCount, setPropertyClickCount] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [filterPrice, setFilterPrice] = useState([0, 1000000]);
  const [filterState, setFilterState] = useState("all");
  const [filterCondition, setFilterCondition] = useState("all"); // Cambia el nombre del estado

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [visibleRows, setVisibleRows] = useState(3); // Estado para controlar el número de filas visibles

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { isAuthenticated, user } = useAuth(); // Agrega esta línea para obtener el estado de autenticación y el usuario actual

  useEffect(() => {
    // Verifica si el usuario está autenticado
    setUserAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

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

  const [mexicanStates, setMexicanStates] = useState([]);
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
      <Row gutter={[16, 16]}>
        {loading ? (
          <Spin tip="Cargando..." />
        ) : (
          filteredProperties.slice(0, visibleRows).map(
            (
              property // Limitar el mapeo al número de filas visibles
            ) => (
              <Col xs={24} sm={12} md={8} lg={8} key={property.id}>
                <Card
                  className="property-card"
                  style={{ width: 480, height: 465 }}
                >
                  <div
                    className="property-image-container"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    {property.condicion === "Venta" && (
                      <div className="sale-mark">Venta</div>
                    )}
                    {property.condicion === "Renta" && (
                      <div className="rent-mark">Renta</div>
                    )}
                    <CustomCarousel images={property.image} />
                  </div>

                  <div
                    className="property-location"
                    style={{ marginTop: "16px", cursor: "pointer" }}
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    <Text strong style={{ fontSize: "1.2rem" }}>
                      <EnvironmentOutlined
                        style={{ fontSize: "1.5rem", fontWeight: "bold" }}
                      />{" "}
                      {property.state}, {property.city}
                    </Text>
                  </div>
                  <div className="property-details">
                    <Row
                      gutter={[16, 16]}
                      style={{
                        marginBottom: "16px",
                        marginTop: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      <Col xs={8}>
                        <Text strong>
                          <FontAwesomeIcon
                            icon={faBed}
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "bold",
                            }}
                          />{" "}
                          Habitaciones: {property.rooms}
                        </Text>
                      </Col>
                      <Col xs={8}>
                        <Text strong>
                          <FontAwesomeIcon
                            icon={faBath}
                            alt="Baños"
                            style={{
                              width: "16px",
                              marginRight: "8px",
                            }}
                          />{" "}
                          Baños: {property.bathrooms}
                        </Text>
                      </Col>
                      <Col xs={8}>
                        <Text strong>
                          <img
                            src={m2Image}
                            alt="m2"
                            style={{
                              width: "1.2rem",
                              height: "1.2rem",
                              marginRight: "5px", // O ajusta según sea necesario
                            }}
                          />
                          Terreno: {property.area} m²
                        </Text>
                      </Col>
                      <Col xs={8.1}>
                        <Text strong>
                          <HomeOutlined
                            style={{
                              fontSize: "1.2rem",
                              fontWeight: "bold",
                            }}
                          />{" "}
                          Tipo: {property.type}
                        </Text>
                      </Col>
                      <Col xs={8.1}>
                        <Text strong>
                          <FontAwesomeIcon
                            icon={faRulerCombined}
                            style={{
                              fontSize: "1.2rem",
                              marginRight: "5px", // Ajusta el espaciado según sea necesario
                            }}
                          />
                          Metros de construcción: {property.areaBuild} m²
                        </Text>
                      </Col>
                    </Row>
                  </div>
                  <div
                    className="property-actions"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {userAuthenticated ? (
                      <Button
                        type="primary"
                        icon={
                          property.isFavorite ? (
                            <HeartFilled />
                          ) : (
                            <HeartOutlined />
                          )
                        } // Utiliza property.isFavorite
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                      >
                        {property.isFavorite
                          ? "Quitar de Favoritos"
                          : "Añadir a Favoritos"}{" "}
                        {/* Utiliza property.isFavorite */}
                      </Button>
                    ) : (
                      <Link to="/login">
                        <Button type="primary">Añadir a Favoritos</Button>
                      </Link>
                    )}

                    <Text
                      strong
                      style={{ fontSize: "1.5rem", cursor: "pointer" }}
                      onClick={() => handlePropertyClick(property.id)}
                    >
                      $ {property.price.toLocaleString()}
                    </Text>
                  </div>
                </Card>
              </Col>
            )
          )
        )}
      </Row>
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
