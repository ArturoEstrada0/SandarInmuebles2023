import { useState } from "react";
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
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  TeamOutlined,
  AreaChartOutlined,
  SearchOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import "./PropertyList.css";

import BathIcon from "../../assets/img/Icons/bath.png";

const { Content } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

const PropertyList = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterPrice, setFilterPrice] = useState([0, 1000000]);
  const [filterState, setFilterState] = useState("all");

  const mexicanStates = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México City",
    "Mexico State",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ];

  const propertyData = [
    {
      id: 1,
      type: "Casa",
      price: 750000,
      state: "Jalisco",
      city: "Guadalajara",
      rooms: 3,
      bathrooms: 2,
      area: 180,
      image: "https://julioros.com/wp-content/uploads/2013/06/IMG_3610.jpg",
    },
    {
      id: 2,
      type: "Apartamento",
      price: 950000,
      state: "Nuevo León",
      city: "Monterrey",
      rooms: 2,
      bathrooms: 1,
      area: 120,
      image:
        "https://tuinmobiliarioenveracruz.files.wordpress.com/2014/10/2012-11-20-363.jpg?w=736",
    },
    {
      id: 3,
      type: "Casa",
      price: 750000,
      state: "Jalisco",
      city: "Guadalajara",
      rooms: 3,
      bathrooms: 2,
      area: 180,
      image: "https://julioros.com/wp-content/uploads/2013/06/IMG_3610.jpg",
    },
  ];

  const [filteredProperties, setFilteredProperties] = useState(propertyData);

  const applyFilters = () => {
    const filtered = propertyData.filter((property) => {
      const isTypeMatch = filterType === "all" || property.type === filterType;
      const isPriceMatch =
        property.price >= filterPrice[0] && property.price <= filterPrice[1];
      const isStateMatch =
        filterState === "all" || property.state === filterState;

      return isTypeMatch && isPriceMatch && isStateMatch;
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
          <Title level={2} style={{ background: "white" }}>
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
                <Option value="Apartamento">Apartamento</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Text strong>
                <DollarOutlined /> Rango de Precio
              </Text>
              <Slider
                range
                min={0}
                max={1000000}
                step={10000}
                value={filterPrice}
                onChange={(value) => setFilterPrice(value)}
              />
            </Col>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Text strong>
                <EnvironmentOutlined /> Estado
              </Text>
              <Select
                value={filterState}
                onChange={(value) => setFilterState(value)}
                style={{ width: "100%" }}
              >
                <Option value="all">Todos</Option>
                {mexicanStates.map((state) => (
                  <Option key={state} value={state}>
                    {state}
                  </Option>
                ))}
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
                style={{ backgroundColor: "black", color: "white" }}
              >
                <SearchOutlined />
                Buscar
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
      <Row gutter={[16, 16]}>
        {filteredProperties.map((property) => (
          <Col xs={24} sm={12} md={8} lg={8} key={property.id}>
            <Card className="property-card">
              <Image src={property.image} alt={property.type} preview={false} />
              <div className="property-location" style={{ marginTop: "16px" }}>
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
                  style={{ marginBottom: "16px", marginTop: "20px" }}
                >
                  <Col xs={8}>
                    <Text strong>
                      <TeamOutlined
                        style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                      />{" "}
                      Habitaciones: {property.rooms}
                    </Text>
                  </Col>
                  <Col xs={8}>
                    <Text strong>
                      <img
                        src={BathIcon}
                        alt="Baños"
                        style={{ width: "16px", marginRight: "8px" }}
                      />{" "}
                      Baños: {property.bathrooms}
                    </Text>
                  </Col>
                  <Col xs={8}>
                    <Text strong>
                      <AreaChartOutlined
                        style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                      />{" "}
                      Tamaño: {property.area} m²
                    </Text>
                  </Col>
                </Row>
              </div>
              <div
                className="property-actions"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  type="primary"
                  href={`/property/${property.id}`}
                  className="large-button centered-button"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Reserva
                </Button>

                <Text strong style={{ fontSize: "1.5rem" }}>
                  $ {property.price}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default PropertyList;
