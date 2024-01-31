import React, { useState } from 'react';
import { Row, Col, Typography, Divider, Card, Button } from 'antd';
import 'antd/dist/reset.css';
import ImageUploadForm from './ImageUploadForm';
import FirebaseTextSaver from './FirebaseTextSaver';
import AboutUsEditor from './AboutUsEditor';
import ContactEditor from './ContactEditor';
import Contact from '../Contact/Contact';
import AboutUs from '../AboutUs/AboutUs';
import LandingPage from '../LandingPage/LandingPage';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { Title } = Typography;

function Configuracion() {
  const [reloadLandingPage, setReloadLandingPage] = useState(false);
  const [reloadAboutUs, setReloadAboutUs] = useState(false);
  const [reloadContact, setReloadContact] = useState(false);

  const handleReloadLandingPage = () => {
    setReloadLandingPage(!reloadLandingPage);
  };

  const handleReloadAboutUs = () => {
    setReloadAboutUs(!reloadAboutUs);
  };

  const handleReloadContact = () => {
    setReloadContact(!reloadContact);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Title level={2} style={{ marginBottom: '30px' }}>Configuración</Title>
      <Divider />

      {/* Sección para subir imagen y guardar textos en Firebase */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Subir Imagen y Guardar Textos en Firebase" style={{ marginBottom: '20px', borderRadius: '5px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <ImageUploadForm />
              </Col>
              <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                <FirebaseTextSaver />
              </Col>
            </Row>
          </Card>
        </Col>
        {/* Sección para la página de inicio (LandingPage) */}
        <Col span={24}>
          <Card
            title="Página de Inicio"
            style={{ marginBottom: '20px', borderRadius: '5px', position: 'relative' }}
          >
            <Button
              shape="circle"
              icon={<FontAwesomeIcon icon={faSync} />}
              onClick={handleReloadLandingPage}
              style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none' }}
              />
            <LandingPage key={reloadLandingPage} />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Sección para editar textos de Sobre Nosotros */}
      <Row gutter={[16, 16]}>
  <Col xs={{ span: 24 }} lg={{ span: 24 }}>
    <Card
      title="Editar Textos de Sobre Nosotros"
      style={{ marginBottom: '20px', borderRadius: '5px', position: 'relative' }}
    >
      <Button
        shape="circle"
        icon={<FontAwesomeIcon icon={faSync} />}
        onClick={handleReloadAboutUs}
        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none' }}
        />
      <AboutUsEditor />
      <AboutUs key={reloadAboutUs} />
    </Card>
  </Col>
</Row>


      <Divider />

      {/* Sección para editar textos de Contacto */}
      <Row gutter={[16, 16]}>
        <Col xs={{ span: 24 }} lg={{ span: 8 }}>
          <Card title="Editar Textos de Contacto" style={{ marginBottom: '20px', borderRadius: '5px' }}>
            <ContactEditor />
          </Card>
        </Col>
        <Col xs={{ span: 0 }} lg={{ span: 16 }}>
          <Card
            title="Información de Contacto"
            style={{ marginBottom: '20px', borderRadius: '5px', position: 'relative' }}
          >
<Button
  shape="circle"
  icon={<FontAwesomeIcon icon={faSync} style={{ color: 'gray' }} />}
  onClick={handleReloadAboutUs}
  style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none' }}
/>

            <Contact key={reloadContact} />
          </Card>
        </Col>
      </Row>

      <Divider />
    </div>
  );
}

export default Configuracion;
