// Vender.jsx
import React, { useState } from 'react';
import { FaRegHandshake } from 'react-icons/fa';
import { Form, Input, Button, Steps } from 'antd';
import './Vender.css';

const { Step } = Steps;

const Vender = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onFinish = (values) => {
    console.log('Valores del formulario:', values);
  };

  return (
    <div className="vender-container">
      <FaRegHandshake className="handshake-icon" />
      <h1>Vende tu Propiedad con Nosotros</h1>
      <p>¡Estamos emocionados de ayudarte a vender tu propiedad! Contáctanos para obtener más información.</p>
      <div className="contact-form-container">
        <Steps current={currentStep} style={{ marginBottom: '20px' }}>
          <Step title="Paso 1" />
          <Step title="Paso 2" />
          <Step title="Paso 3" />
        </Steps>

        <Form form={form} onFinish={onFinish} layout="vertical" className={`form-step form-step-${currentStep}`}>
          {currentStep === 0 && (
            <>
              <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor, ingresa tu nombre' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Correo Electrónico" name="email" rules={[{ required: true, type: 'email', message: 'Por favor, ingresa un correo electrónico válido' }]}>
                <Input />
              </Form.Item>
              <Button type="primary" onClick={handleNextStep}>
                Siguiente
              </Button>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item label="Teléfono" name="telefono" rules={[{ required: true, message: 'Por favor, ingresa tu número de teléfono' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Dirección de la Propiedad" name="direccion" rules={[{ required: true, message: 'Por favor, ingresa la dirección de la propiedad' }]}>
                <Input />
              </Form.Item>
              <Button style={{ marginRight: 8 }} onClick={handlePrevStep}>
                Anterior
              </Button>
              <Button type="primary" onClick={handleNextStep}>
                Siguiente
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Form.Item label="¿Por qué estás interesado en vender?" name="motivo" rules={[{ required: true, message: 'Por favor, ingresa el motivo de la venta' }]}>
                <Input.TextArea />
              </Form.Item>
              <Button style={{ marginRight: 8 }} onClick={handlePrevStep}>
                Anterior
              </Button>
              <Button type="primary" htmlType="submit">
                Enviar Mensaje
              </Button>
            </>
          )}
        </Form>
      
      </div>
    </div>
  );
};

export default Vender;
