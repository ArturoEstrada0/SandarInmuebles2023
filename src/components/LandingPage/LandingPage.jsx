import { useEffect, useState } from 'react';
import { Layout, Row, Col, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { firestore } from '../firebase/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import CountUp from 'react-countup';
import './LandingPage.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function LandingPage() {
  const [animated, setAnimated] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageURLs, setImageURLs] = useState([]);
  const [landingPageData, setLandingPageData] = useState(null);
  const [availablePropertiesCount, setAvailablePropertiesCount] = useState(0);

  useEffect(() => {
    setAnimated(true);

    const storage = getStorage();
    const landingPageRef = ref(storage, 'LandingPage');

    const fetchImages = async () => {
      try {
        const imagesList = await listAll(landingPageRef);
        const urls = await Promise.all(
          imagesList.items.map(async (imageRef) => {
            return getDownloadURL(imageRef);
          })
        );
        setImageURLs(urls);

        const interval = setInterval(() => {
          setCurrentImage((prevImage) => (prevImage + 1) % urls.length);
        }, 4000);

        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
      }
    };

    const fetchLandingPageData = async () => {
      try {
        const docRef = doc(firestore, 'landingPageData', 'pageData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLandingPageData(data);
        }
      } catch (error) {
        console.error('Error al obtener los datos de la página de inicio:', error);
      }
    };

    const fetchAvailablePropertiesCount = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'propiedades'));
        setAvailablePropertiesCount(querySnapshot.size);
      } catch (error) {
        console.error('Error al obtener el recuento de propiedades:', error);
      }
    };

    fetchImages();
    fetchLandingPageData();
    fetchAvailablePropertiesCount();
  }, []);

  return (
    <Content style={{ backgroundColor: '#e2f4fe' }}>
      <div className='landing-page-container'>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} md={{ span: 9 }}>
            <div className='landing-page-text' style={{ height: '100%', padding: '0 15px' }}>
              <Title
                className='landing-page-title'
                style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Geometos',
                  marginTop: '20px',
                  textAlign: 'left',
                }}>
                {landingPageData && landingPageData.title}
              </Title>
              <Paragraph
                style={{
                  fontSize: '1.2rem',
                  fontFamily: 'Lato, sans-serif',
                  textAlign: 'justify',
                }}>
                {landingPageData && landingPageData.subtitle}
              </Paragraph>
              <Link to='/inmuebles'>
                <Button
                  size='large'
                  className='banner-button'
                  style={{
                    background: '#001529',
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: '4px',
                    padding: '30px 30px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    fontFamily: 'Geometos',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  Ver Inmuebles
                </Button>
              </Link>
              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 8 }}
                  className={`landing-page-stat ${animated ? 'animated' : ''}`}>
                  <div className='landing-page-stat-number'>
                    <CountUp end={availablePropertiesCount} duration={5} />
                  </div>
                  <div className='landing-page-stat-title'>Inmuebles Disponibles</div>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 8 }}
                  className={`landing-page-stat ${animated ? 'animated' : ''}`}>
                  <div className='landing-page-stat-number'>
                    <CountUp end={1000} duration={5} />+
                  </div>
                  <div className='landing-page-stat-title'>
                    Inmuebles Vendidos
                  </div>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 8 }}
                  className={`landing-page-stat ${animated ? 'animated' : ''}`}>
                  <div className='landing-page-stat-number'>
                    <CountUp end={95} duration={5} />%
                  </div>
                  <div className='landing-page-stat-title'>
                    Clientes Satisfechos
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={{ span: 0 }} md={{ span: 15 }}>
            <div
              className='landing-page-image'
              style={{
                height: '100%',
                backgroundImage: `url(${
                  imageURLs.length > 0 ? imageURLs[currentImage] : ''
                })`,
              }}></div>
          </Col>
        </Row>
      </div>
    </Content>
  )
}

export default LandingPage
