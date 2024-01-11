import { Input, Button, Form, /*Space,*/ Row, Col, Select, Card } from "antd";
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
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from "../firebase/firebase";  
import "./Contact.css";



const Contact = () => {
  const onFinish = async (values) => {

    try{
      const contactCollection = collection(firestore, 'contacts');
      await addDoc(contactCollection, values);

      console.log("Datos enviados correctamente a Firestore: ",values)
    }catch (error) {
      console.log("Error al enviar datos a Firestore: ", error)
    }
    // Aquí puedes agregar lógica para enviar el correo, por ejemplo, utilizando un servicio de envío de correos.

  };

  return (
    <div className="contact-container">
      <Card Card title={<span className="card-title">Formulario de Contacto</span>} className="card-container">
        <Row gutter={16}>
          <Col span={8}>
            <Form name="contact-form" onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Nombre"
                name="name"
                rules={[{ required: true, message: 'Por favor, ingrese su nombre.' }]}
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

              <Form.Item>
              </Form.Item>
              <Form.Item
                label="Correo Electrónico"
                name="email"
                
                rules={[
                  { required: true, type: 'email', message: 'Por favor, ingrese un correo electrónico válido.' },
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
              <Button type="primary" htmlType="submit">
                  Enviar Correo
                </Button>
            </Form>
          </Col>


          <Col span={8}>
          <div className="contact-info-container">
    <h3 className="contact-title">
      <UserOutlined /> Información de Contacto
    </h3>
    <div className="contact-info">
                <p>
                  <strong>
                    <EnvironmentOutlined />
                  </strong>{' '}
                  Dirección de tu empresa
                </p>
                <p>
                  <strong>
                    <PhoneFilled />
                  </strong>{' '}
                  +123-456-7890
                </p>
                <p>
                  <strong>
                    <MailFilled />
                  </strong>{' '}
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
