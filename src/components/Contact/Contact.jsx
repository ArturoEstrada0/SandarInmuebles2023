import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Row, Col, Select, Card, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  EnvironmentOutlined,
  PhoneFilled,
  MailFilled,
} from '@ant-design/icons';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import 'animate.css'; // Importa la biblioteca Animate.css
import './Contact.css';

const Contact = () => {
  const [form] = Form.useForm();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Agrega la clase de animación después de que el componente se monta
    setAnimationClass('animate__animated animate__fadeInUp');
  }, []);

  const onFinish = async (values) => {
    try {
      const contactCollection = collection(firestore, 'contacts');
      await addDoc(contactCollection, values);

      console.log('Datos enviados correctamente a Firestore: ', values);
      message.success('Mensaje enviado correctamente');

      form.resetFields();
    } catch (error) {
      console.log('Error al enviar datos a Firestore: ', error);
      message.error('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    }
    // Puedes reiniciar la animación cada vez que se envía el formulario
    setAnimationClass('');
    setAnimationClass('animate__animated animate__fadeInUp');
  };

  return (
    <div className={`contact-container ${animationClass}`}>
      <Card
        title={<span className={`card-title ${animationClass}`}>Contacta con Nosotros</span>}
        className={`card-container ${animationClass}`}
        
      >
              <p>¿Tienes alguna pregunta o comentario? ¡Estamos aquí para ayudarte! Ponte en contacto con Sandar Inmuebles y te responderemos lo antes posible.</p>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form form={form} name="contact-form" onFinish={onFinish} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontSize: '16.5px' }}>Nombre</span>}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, ingrese su nombre.',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Nombre completo" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span style={{ fontSize: '16.5px' }}>Teléfono</span>}
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, ingrese su número de teléfono.',
                      },
                    ]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="Número de teléfono" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label={<span style={{ fontSize: '16.5px' }}>Correo electrónico</span>}
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Por favor, ingrese un correo electrónico válido.',
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Correo electrónico" />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16.5px' }}>Asunto</span>}
                name="subject"
                rules={[
                  {
                    required: true,
                    message: 'Por favor, seleccione un asunto.',
                  },
                ]}
              >
                <Select placeholder="Seleccione un asunto">
                  <Select.Option value="Consulta">Consulta</Select.Option>
                  <Select.Option value="Cita">Solicitud de Cita</Select.Option>
                  <Select.Option value="Queja">Queja</Select.Option>
                  <Select.Option value="Otros">Otros</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={<span style={{ fontSize: '16.5px' }}>Mensaje</span>}
                name="message"
                rules={[
                  { required: true, message: 'Por favor, ingrese un mensaje.' },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  prefix={<MessageOutlined />}
                  placeholder="Escriba su mensaje..."
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', fontFamily:"Geometos", fontSize:"0.8rem" }}
              >
                Enviar Correo
              </Button>
            </Form>
          </Col>

          <Col span={12}>
            <div className="contact-info-container">
              <h3 className="contact-title">
                <UserOutlined /> Información de Contacto
              </h3>
              <div className="contact-info">
                
                <p>
                  <strong>
                    <EnvironmentOutlined />
                  </strong>{' '}
                  <a
                    href="https://www.google.com/maps?q=Dirección+de+tu+empresa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Dirección de tu empresa
                  </a>
                </p>
                <p>
                  <strong>
                    <PhoneFilled />
                  </strong>{' '}
                  <a
                    href="https://wa.me/4434395522"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    4434395522
                  </a>
                </p>
                <p>
                  <strong>
                    <MailFilled />
                  </strong>{' '}
                  <a href="mailto:arturoestrada301@gmail.com">
                    arturoestrada301@gmail.com
                  </a>
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
