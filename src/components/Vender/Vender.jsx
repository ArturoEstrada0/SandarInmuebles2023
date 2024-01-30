// Vender.jsx
import React, { useState } from 'react';
import { FaRegHandshake } from 'react-icons/fa';
import { Form, Input, Button, Steps, Collapse, Divider} from 'antd';
import './Vender.css';
import ventaImage from '../../assets/img/venta.jpg';
import Footer from '../Footer/Footer';

const { Step } = Steps;
const { Panel } = Collapse;

const Vender = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStep1, setCurrentStep1] = useState(0);

  const handleStepClick = (step) => {
    setCurrentStep1(step);
  };


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
    <div className="background-container">
      <img className="background-image" src={ventaImage} alt="Background" />
      <div className="overlay-content">
        <FaRegHandshake className="handshake-icon" />
        <h1>Vende tu Propiedad con Nosotros</h1>
        <p>¡Estamos emocionados de ayudarte a vender tu propiedad! Contáctanos para obtener más información.</p>
      </div>
    </div>

    {/* Nuevo elemento para el rectángulo azul debajo */}
    <div className="blue-rectangle">
      <div className="blue-line"></div>
      <p className="blue-text">
      En Sandar Inmuebles te ofrecemos una amplia selección de propiedades disponibles para compra y venta. Nuestros agentes están listos para ayudarte a encontrar la casa, departamento o local comercial que se adapte a tus necesidades y presupuesto. Sandar Inmuebles también ofrece servicios de gestión de propiedades para propietarios e inversores. Nos encargamos de la administración, mantenimiento y alquiler de tus propiedades para que obtengas el máximo rendimiento.</p>
      <div className="blue-line"></div>
    </div>

    <div className="step-container">
        <Steps current={currentStep1} style={{ marginBottom: '20px' }} direction="vertical">
        <Step
              title={<span style={{ fontSize: '1.5em' }}>Contacto Inicia</span>}
              description={<span style={{ fontSize: '1.1em' }}>Establecer conexión con el cliente y conocer sus necesidades.</span>}
              onClick={() => handleStepClick(0)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Recolección de Datos</span>}
              description={<span style={{ fontSize: '1.1em' }}>Obtener información detallada sobre preferencias y situación financiera.</span>}
              onClick={() => handleStepClick(1)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Presentación del Inmueble</span>}
              description={<span style={{ fontSize: '1.1em' }}>Destacar características clave y responder a preguntas.</span>}
              onClick={() => handleStepClick(2)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Feedback del Cliente</span>}
              description={<span style={{ fontSize: '1.1em' }}>Recopilar comentarios para ajustar la estrategia de venta.</span>}
              onClick={() => handleStepClick(3)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Ajustes y Negociación</span>}
              description={<span style={{ fontSize: '1.1em' }}>Modificar estrategia y negociar términos con el cliente.</span>}
              onClick={() => handleStepClick(4)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Documentación y Formalización</span>}
              description={<span style={{ fontSize: '1.1em' }}>Preparar la documentación necesaria y guiar en el proceso de formalización.</span>}
              onClick={() => handleStepClick(5)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Financiamiento (si aplica)</span>}
              description={<span style={{ fontSize: '1.1em' }}>Facilitar obtención de financiamiento y coordinar con instituciones financieras.</span>}
              onClick={() => handleStepClick(6)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Inspección y Evaluación</span>}
              description={<span style={{ fontSize: '1.1em' }}>Coordinar inspecciones y evaluaciones necesarias para la propiedad.</span>}
              onClick={() => handleStepClick(7)}
              style={{ marginBottom: '20px' }}
            />
            <Step
              title={<span style={{ fontSize: '1.5em' }}>Cierre y Seguimiento Postventa</span>}
              description={<span style={{ fontSize: '1.1em' }}>Finalizar la venta y realizar seguimiento postventa para garantizar satisfacción.</span>}
              onClick={() => handleStepClick(8)}
              style={{ marginBottom: '20px' }}
            />
          </Steps>
          {/* Nueva sección para los Collapse */}
        <div className="collapse-container">
          <Divider orientation="left"><h3>Preguntas Frecuentes</h3></Divider>
          <Collapse>
            <Panel header={<span style={{ fontSize: '1.1em' }}>¿Que debo incluir en mi oferta de propiedad?</span>} key="1">
              <p>Una oferta debe contemplar un plan estratégico con el segmento y público meta para aprovechar los canales de comunicación. Es importante contar con fotos en alta resolución de todos los espacios, el frente de la propiedad, la zona y las amenidades más importantes. Puedes también grabar un vídeo recorrido de la propiedad para hacerla destacar del resto.</p>
            </Panel>
          </Collapse>

          <Divider orientation="left"></Divider>
          <Collapse>
            <Panel header={<span style={{ fontSize: '1.1em' }}>¿Que puedo esperar del cierre?</span>} key="1">
              <p>El cierre es un proceso en donde se finalizan todos los detalles de la transacción y se verifica que todo esté en orden con tu crédito inmobiliario. Este se realiza en presencia de abogados, tu asesor inmobiliario, notario y un representante del crédito.</p>
            </Panel>
          </Collapse>

          <Divider orientation="left"></Divider>
          <Collapse>
            <Panel header={<span style={{ fontSize: '1.1em' }}>¿Cuales son los errores mas comunes en los contratos que debo evitar?</span>} key="1">
              <p>Te recomendamos siempre revisar las cláusulas de pago y fijar correctamente quién es la persona que estará descrita en el contrato. También señala de forma clara las fechas de pago, los montos totales y, sobre todo, verificar que todo el contrato esté correctamente firmado.</p>
            </Panel>
          </Collapse>

          <Divider orientation="left"></Divider>
          <Collapse>
            <Panel header={<span style={{ fontSize: '1.1em' }}>¿Que tramites hay que hacer para cerrar?</span>} key="1">
              <p>Para cerrar se hará la revisión y aprobación de aval, póliza jurídica o seguro de caución. Además se llevará a cabo la firma de documentos.</p>
            </Panel>
          </Collapse>

          <Divider orientation="left"></Divider>
          <Collapse>
            <Panel header={<span style={{ fontSize: '1.1em' }}>¿Cuales son las contigencias mas comunes durante la oferta de compra?</span>} key="1">
              <p>Una de las contingencias más comunes es saber cuándo negociar y establecer el porcentaje de anticipo.</p>
            </Panel>
          </Collapse>
        </div>
        </div>

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
      <Footer />
    </div>
  );
};
export default Vender;
