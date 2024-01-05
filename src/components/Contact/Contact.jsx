import { Input, Button, Form, Space, Row, Col, Select, Card } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  EnvironmentOutlined, // Icono de ubicación
  PhoneFilled, // Icono de teléfono
  MailFilled, // Icono de correo electrónico
} from "@ant-design/icons"; // Importa los iconos que necesitas
import "antd/dist/reset.css";

import contactF from '../../assets/img/contactF.jpg'


const Contact = () => {
  const onFinish = (values) => {
    console.log("Valores enviados:", values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "65vh",
        backgroundImage: `url(${contactF})`
      }}
    >
      <Card title="Formulario de Contacto" style={{ width: 1000 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Form name="contact-form" onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Nombre"
                name="name"
                rules={[
                  { required: true, message: "Por favor, ingrese su nombre." },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Teléfono"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese su número de teléfono.",
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>

              <Form.Item
                label="Mensaje"
                name="message"
                rules={[
                  { required: true, message: "Por favor, ingrese un mensaje." },
                ]}
              >
                <Input.TextArea rows={2} prefix={<MessageOutlined />} />
              </Form.Item>
            </Form>
          </Col>

          <Col span={8}>
            <Form name="contact-form" onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Correo Electrónico"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Por favor, ingrese un correo electrónico válido.",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item
                label="Asunto"
                name="subject"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione un asunto.",
                  },
                ]}
              >
                <Select placeholder="Seleccione un asunto">
                  <Select.Option value="consulta">Consulta</Select.Option>
                  <Select.Option value="cita">Solicitud de Cita</Select.Option>
                  <Select.Option value="queja">Queja</Select.Option>
                  <Select.Option value="otros">Otros</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Col>

          <Col span={8}>
            <div
              style={{
                background: "#001529",
                padding: "10px",
                color: "#e5e5e5",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                height: "40vh",
                alignItems: "flex-start", // Alinea la información de contacto a la izquierda
                justifyContent: "flex-start", // Alinea el contenido hacia arriba
              }}
            >
              <h3 style={{ marginLeft: "10px", marginTop: "20px" }}>
                <UserOutlined /> Información de Contacto
              </h3>
              <div style={{ textAlign: "left", marginLeft: "10px", marginTop: "50px"}}>
                <p>
                  <strong>
                    <EnvironmentOutlined />
                  </strong>{" "}
                  Dirección de tu empresa
                </p>
                <p>
                  <strong>
                    <PhoneFilled />
                  </strong>{" "}
                  +123-456-7890
                </p>
                <p>
                  <strong>
                    <MailFilled />
                  </strong>{" "}
                  info@tudominio.com
                </p>
              </div>
            </div>
          </Col>

          
        </Row>
      </Card>
    </div>
  );
};

export default Contact;
