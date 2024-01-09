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
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  FormOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  CalendarOutlined,
  NumberOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from "../firebase/firebase"; 

const { Content } = Layout;
const { Title, Text } = Typography;

const PropertyDetail = ({ propertyData }) => {
  const { id } = useParams();
  const [imageHeight, setImageHeight] = useState("60vh");
  const [propertyDetails, setPropertyDetails] = useState(null);

  useEffect(() => {
    const selectedProperty = propertyData.find(
      (property) => property.id.toString() === id
    );

    if (selectedProperty) {
      setPropertyDetails(selectedProperty);

      const imgSrc =
        selectedProperty &&
        selectedProperty.images &&
        selectedProperty.images.length > 0
          ? selectedProperty.images[0].image
          : "";

      const img = new Image();
      img.src = imgSrc;

      console.log("selectedProperty:", selectedProperty);
      console.log("selectedProperty.images:", selectedProperty.images);
      console.log("Image source:", img.src);

      img.onload = () => {
        setImageHeight("60vh");
      };
    }
  }, [id, propertyData]);

  const handleContactFormSubmit = async (values) => {
    try {
      const contactCollection = collection(firestore, 'msgpro');
      // Obtén la información específica de la propiedad
      const selectedProperty = propertyData.find(property => property.id.toString() === id);

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
      message.error("Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente.");
    }
  };

  if (!propertyDetails) {
    return <Spin tip="Cargando..." />;
  }

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
  {propertyDetails && propertyDetails.image && (
    <img
      src={propertyDetails.image}  // Corregir aquí
      alt="Property Image"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  )}
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
              Dormitorios: {propertyDetails.activeFeatures?.Habitaciones || 0}
            </Title>
            <Title level={4}>
              <NumberOutlined style={{ marginRight: "8px" }} />
              Baños: {propertyDetails.activeFeatures?.Baño || 0}
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