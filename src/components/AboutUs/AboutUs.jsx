import React, { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Statistic, Divider } from 'antd';
import { ApartmentOutlined, HomeOutlined } from '@ant-design/icons';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import './AboutUs.css';

import aboutusF from '../../assets/img/mudandose2.jpg';
const { Content } = Layout;
const { Title, Paragraph } = Typography;

const AboutUs = () => {
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const aboutUsDocRef = doc(firestore, 'aboutUsData', 'aboutUsInfo');
        const docSnap = await getDoc(aboutUsDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setParagraph(data.paragraph || '');
        } else {
          console.log('El documento "aboutUsInfo" no existe en Firestore.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos de "Sobre Nosotros" desde Firebase:', error);
        setLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Content style={{ marginTop: '65px' }}>
      <div className="about-us-container" style={{ backgroundImage: `url(${aboutusF})` }}>
        <Row gutter={32}>
          <Col span={12}>
            <div>
              <Title level={2} className="about-us-title">
                {title}
              </Title>
              <Paragraph className="about-us-paragraph">{paragraph}</Paragraph>
            </div>
            <Divider />
            <Title level={3} className="about-us-subtitle">
              Nuestra Experiencia
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <StatisticCard
                  icon={<ApartmentOutlined style={{ fontSize: '34px' }} />}
                  title="Años de Experiencia"
                  value={20} // Aquí deberías obtener el valor dinámicamente desde Firebase
                  color="#1890ff"
                  id="experience-number"
                />
              </Col>
              <Col span={12}>
                <StatisticCard
                  icon={<HomeOutlined style={{ fontSize: '34px' }} />}
                  title="Inmuebles Vendidos"
                  value={1000} // Aquí deberías obtener el valor dinámicamente desde Firebase
                  color="#1890ff"
                  id="sales-number"
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}></Col>
        </Row>
      </div>
    </Content>
  );
};

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

export default AboutUs;
