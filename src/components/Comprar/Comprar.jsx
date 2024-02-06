// Comprar.jsx

import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Steps, Divider, Collapse } from 'antd';
import { HomeOutlined, DatabaseOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import './Comprar.css';

const { Title, Paragraph } = Typography;

const { Step } = Steps;
const { Panel } = Collapse;

const Comprar = () => {
  const iconStyle = { color: '#1890ff', marginRight: '8px' };
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStep1, setCurrentStep1] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleStepClick = (step) => {
    setCurrentStep1(step);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className={`comprar-container ${loading ? 'loading' : ''}`}>
      <Title level={2} className="comprar-title">
        ¿Por qué comprar con Sandar Inmuebles?
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={12} xl={12}>
          <div className="comprar-info-box">
            <Title level={3} className="comprar-info-title">
              <HomeOutlined style={iconStyle} />
              Experiencia Confiable
            </Title>
            <Paragraph className="comprar-info-paragraph">
              Contamos con años de experiencia en el mercado inmobiliario, brindando un servicio confiable y transparente a nuestros clientes.
            </Paragraph>
          </div>
          <div className="comprar-info-box">
            <Title level={3} className="comprar-info-title">
              <DatabaseOutlined style={iconStyle} />
              Variedad de Propiedades
            </Title>
            <Paragraph className="comprar-info-paragraph">
              Ofrecemos una amplia gama de propiedades, desde apartamentos modernos hasta casas con encanto, para satisfacer tus necesidades y preferencias.
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={12} xl={12}>
          <div className="comprar-info-box">
            <Title level={3} className="comprar-info-title">
              <TeamOutlined style={iconStyle} />
              Asesoramiento Personalizado
            </Title>
            <Paragraph className="comprar-info-paragraph">
              Nuestro equipo de expertos está listo para proporcionarte asesoramiento personalizado en cada paso del proceso de compra, asegurándonos de que tomes decisiones informadas.
            </Paragraph>
          </div>
          <div className="comprar-info-box">
            <Title level={3} className="comprar-info-title">
              <SafetyCertificateOutlined style={iconStyle} />
              Transacciones Seguras
            </Title>
            <Paragraph className="comprar-info-paragraph">
              Garantizamos transacciones seguras y transparentes, trabajando para proteger tus intereses y ofreciendo un proceso de compra sin complicaciones.
            </Paragraph>
          </div>
        </Col>
      </Row>

      <div className="seccion-adicional">
        <div className="imagen-fondo">
          <p className="texto-centrado">SANDAR INMUEBLES</p>
        </div>
      </div>

      <Row className="step-and-collapse-container">
        <Col xs={24} sm={24} lg={12} xl={12} order={1}>
          <div className="step-container">
            <Steps current={currentStep1} style={{ marginBottom: '20px' }} direction="vertical">
              <Step
                title={<span style={{ fontSize: '1.5em' }}>Buscamos</span>}
                description={<span style={{ fontSize: '1.1em' }}>Ya sea que hayas encontrado una propiedad de tu interés en nuestro sitio o que quieras conocer más opciones; tu asesor te ayuda a encontrar las alternativas que mejor se adapten a ti.</span>}
                onClick={() => handleStepClick(0)}
                style={{ marginBottom: '20px' }}
              />
              <Step
                title={<span style={{ fontSize: '1.5em' }}>VISITAMOS</span>}
                description={<span style={{ fontSize: '1.1em' }}>Una vez que hemos seleccionado las alternativas más relevantes, tu asesor te ayuda a organizar las visitas para que puedan ir juntos a descubrir las propiedades en persona hasta encontrar el lugar indicado.</span>}
                onClick={() => handleStepClick(1)}
                style={{ marginBottom: '20px' }}
              />
              <Step
                title={<span style={{ fontSize: '1.5em' }}>HACEMOS UNA OFERTA</span>}
                description={<span style={{ fontSize: '1.1em' }}>Cuando has encontrado ese lugar que brilla entre el resto, te ayudamos a hacer una oferta oficial de compra que te acerque a tu hogar ideal.</span>}
                onClick={() => handleStepClick(2)}
                style={{ marginBottom: '20px' }}
              />
              <Step
                title={<span style={{ fontSize: '1.5em' }}>GENERAMOS EL CONTRATO</span>}
                description={<span style={{ fontSize: '1.1em' }}>En este momento te ayudamos a tener claridad y certeza legal para que tu compra sea segura y cuentes con toda la información indispensable.</span>}
                onClick={() => handleStepClick(3)}
                style={{ marginBottom: '20px' }}
              />
              <Step
                title={<span style={{ fontSize: '1.5em' }}>CERRAMOS</span>}
                description={<span style={{ fontSize: '1.1em' }}>Te acompañamos hasta el final de la compra, dejando todo listo para que puedas mudarte a tu nuevo hogar y disfrutarlo en completa tranquilidad.</span>}
                onClick={() => handleStepClick(4)}
                style={{ marginBottom: '20px' }}
              />
            </Steps>
          </div>
        </Col>
        <Col xs={24} sm={24} lg={12} xl={12} order={2}>
          <div className="collapse-container">
            <Divider orientation="left"><h3>Preguntas Frecuentes</h3></Divider>
            <Collapse>
              <Panel header={<span style={{ fontSize: '1.1em' }}>¿Cómo puedo aprovechar al máximo mi tiempo durante la visita a una propiedad?</span>} key="1">
                <p>Es importante saber qué buscas en un inmueble, no sólo vayas en fines de semana, también visita la zona entre semana y en horas pico para darte una idea de cómo sería tu día a día.</p>
              </Panel>
            </Collapse>

            <Divider orientation="left"></Divider>
            <Collapse>
              <Panel header={<span style={{ fontSize: '1.1em' }}>¿Qué debo esperar al visitar propiedades?</span>} key="1">
                <p>Durante tu visita realizarás un recorrido completo del inmueble, el edificio, estacionamiento y, en caso de contar con ello, bodega o amenidades fuera del inmueble.</p>
              </Panel>
            </Collapse>

            <Divider orientation="left"></Divider>
            <Collapse>
              <Panel header={<span style={{ fontSize: '1.1em' }}>¿Cuántas viviendas debo visitar para encontrar la adecuada?</span>} key="1">
                <p>Lo más importante es realizar las visitas suficientes que te permitan sentirte satisfecho. Lo ideal es que sean al menos 5, en diferentes zonas y con diferentes características.</p>
              </Panel>
            </Collapse>

            <Divider orientation="left"></Divider>
            <Collapse>
              <Panel header={<span style={{ fontSize: '1.1em' }}>¿En qué debo fijarme al visitar una propiedad?</span>} key="1">
                <p>Aparte de las características físicas y amenidades, te recomendamos ubicar bien la zona y los medios de transporte. Revisa cuáles son las avenidas principales cercanas y cuál es la distancia desde la propiedad hasta los lugares que visitas más frecuentemente.</p>
              </Panel>
            </Collapse>

            <Divider orientation="left"></Divider>
            <Collapse>
              <Panel header={<span style={{ fontSize: '1.1em' }}>¿Como sé cuándo negociar y cuándo dejar pasar una oferta?</span>} key="1">
                <p>Puedes hacer una oferta de compra que será presentada al propietario a través del asesor. De ser aceptada podrás continuar con la compra.</p>
              </Panel>
            </Collapse>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Comprar;
