import React, { useEffect } from 'react';
import { Layout, Typography, Row, Col, Statistic, Divider } from 'antd';
import { ApartmentOutlined, HomeOutlined } from '@ant-design/icons';
import './AboutUs.css';

import image1 from '../../assets/img/houses/house5.png';
import image2 from '../../assets/img/houses/house6.png';
import image3 from '../../assets/img/houses/house7.png';
import image4 from '../../assets/img/houses/house8.png';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AboutUs = () => {
  useEffect(() => {
    // La lógica de animación permanece igual
  }, []);

  return (
    <Content>
      <div className="about-us-container">
        <Row gutter={32}>
          <Col span={12}>
            <AboutUsIntro />
            <AboutUsStats />
          </Col>
          <Col span={12}>
            <AboutUsImageCollage />
          </Col>
        </Row>
      </div>
    </Content>
  );
};

const AboutUsIntro = () => (
  <div>
    <Title level={2} className="about-us-title">
      Sobre Nosotros
    </Title>
    <Paragraph className="about-us-paragraph">
      ¡Bienvenido a Sandar Inmuebles! Somos tu aliado en el emocionante mundo de bienes raíces. Nuestra misión es convertir tus sueños en realidad, ofreciéndote un servicio de primera clase con la experiencia y la pasión que mereces. Estamos comprometidos con tu satisfacción en cada paso del camino.
    </Paragraph>
  </div>
);

const AboutUsStats = () => (
  <div>
    <Divider />
    <Title level={3} className="about-us-subtitle">
      Nuestra Experiencia
    </Title>
    <Row gutter={16}>
      <Col span={12}>
        <StatisticCard
          icon={<ApartmentOutlined style={{ fontSize: '34px', }} />}
          title="Años de Experiencia"
          value={20}
          color="#1890ff"
          id="experience-number"
        />
      </Col>
      <Col span={12}>
        <StatisticCard
          icon={<HomeOutlined style={{ fontSize: '34px' }} />}
          title="Inmuebles Vendidos"
          value={1000}
          color="#1890ff"
          id="sales-number"
        />
      </Col>
    </Row>
  </div>
);

const StatisticCard = ({ icon, title, value, color, id }) => (
  <div className="experience-statistic">
    <div className="experience-icon" style={{ backgroundColor: color, color: '#fff' }}>
      {icon}
    </div>
    <div className="experience-info">
      <Statistic title={title} valueStyle={{ color, fontSize: '24px', fontWeight: 'bold' }} value={value} id={id} />
    </div>
  </div>
);

const AboutUsImageCollage = () => (
  <div className="about-us-image-collage">
    <div className="image-collage-row">
      <img src={image1} alt="Imagen 1" className="about-us-image square-image" />
      <img src={image2} alt="Imagen 2" className="about-us-image square-image" />
    </div>
    <div className="image-collage-row">
      <img src={image3} alt="Imagen 3" className="about-us-image square-image" />
      <img src={image4} alt="Imagen 4" className="about-us-image square-image" />
    </div>
  </div>
);

export default AboutUs;
