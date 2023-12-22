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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  FormOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  CalendarOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { useParams } from 'react-router-dom';


const { Content } = Layout;
const { Title, Text } = Typography;

const PropertyDetail = () => {
  const { id } = useParams();
  const [imageHeight, setImageHeight] = useState("60vh"); // Altura de la imagen ajustada a 60% de la altura de la página

  const propertyData = [
    {
      id: 1,
      type: "Casa",
      price: 250000,
      state: "Disponible",
      description: "Esta es una hermosa casa en una ubicación increíble...",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      yearBuilt: 2000,
      images: [
        "https://julioros.com/wp-content/uploads/2013/06/IMG_3610.jpg",
        "https://julioros.com/wp-content/uploads/2013/06/IMG_3610.jpg",
      ],
    },
    {
      id: 2,
      type: "Apartamento",
      price: 150000,
      state: "En proceso",
      description: "Amplio apartamento con vista al mar...",
      bedrooms: 2,
      bathrooms: 1,
      area: 120,
      yearBuilt: 2010,
      images: [
        "https://julioros.com/wp-content/uploads/2013/06/IMG_3610.jpg",
        "https://julioros.com/wp-content/uploads/2013/06/IMG_3610.jpg",
      ],
    },
    // Agrega más propiedades
  ];

  const propertyDetails = propertyData.find(
    (property) => property.id.toString() === id
  );

  const handleContactFormSubmit = (values) => {
    message.success("¡Tu mensaje ha sido enviado con éxito!");
  };

  useEffect(() => {
    const img = new Image();
    img.src = propertyDetails.images[0];
    img.onload = () => {
      setImageHeight("60vh"); // Ajusta la altura de la imagen a 60% después de cargar la imagen
    };
  }, [propertyDetails.images]);

  return (
    <Content>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingLeft: "30px",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2}>{propertyDetails.type}</Title>
          <Text strong>Precio:</Text> ${propertyDetails.price}
        </div>
        <div>
          {/* Agrega aquí cualquier contenido que desees alinear a la derecha */}
        </div>
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
              <img
                src={propertyDetails.images[0]}
                alt="Property Image"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: "1", maxWidth: "30%", maxHeight: "60vh" }}>
              <Card
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Title
                  level={4}
                  className="contact-title"
                  style={{ textAlign: "center" }}
                >
                  SANDAR INMUEBLES
                </Title>
                <Title
                  level={4}
                  className="contact-title"
                  style={{ textAlign: "center" }}
                >
                  CONTACTANOS Y PREGUNTA
                </Title>
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
                    <Input prefix={<UserOutlined />} placeholder="Nombre" />
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
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
                    <Button type="primary" htmlType="submit">
                      Enviar Mensaje
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </Col>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title level={4}>
              <DollarCircleOutlined style={{ marginRight: "8px" }} />
              Precio: ${propertyDetails.price}
            </Title>
          </div>
          <div>
            <Title level={4}>
              <HomeOutlined style={{ marginRight: "8px" }} />
              Dormitorios: {propertyDetails.bedrooms}
            </Title>
            <Title level={4}>
              <NumberOutlined style={{ marginRight: "8px" }} />
              Baños: {propertyDetails.bathrooms}
            </Title>
            <Title level={4}>
              <CalendarOutlined style={{ marginRight: "8px" }} />
              Año de construcción: {propertyDetails.yearBuilt}
            </Title>
          </div>
        </div>
      </Row>
    </Content>
  );
};

export default PropertyDetail;
