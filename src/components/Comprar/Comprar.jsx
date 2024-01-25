// Comprar.js

import React from 'react';
import { Row, Col, Typography } from 'antd';
import { HomeOutlined, DatabaseOutlined, TeamOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import './Comprar.css';  // Importa tu archivo CSS

const { Title, Paragraph } = Typography;

const Comprar = () => {
  const iconStyle = { color: '#1890ff', marginRight: '8px' };

  return (
    <div className="comprar-container">
      <Title level={2} className="comprar-title">
        ¿Por qué comprar con Sandar Inmuebles?
      </Title>
      <Row gutter={[16, 16]}>
        {/* Columna Izquierda */}
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

        {/* Columna Derecha */}
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

       {/* Nueva sección con imagen de fondo y texto */}
       <div className="seccion-adicional">
        <div className="imagen-fondo">
          <p className="texto-centrado">SANDAR INMUEBLES</p>
        </div>
      </div>
    </div>
  );
}

export default Comprar;