import { Layout, Menu } from 'antd';
import LandingPage from './LandingPage/LandingPage';
import AboutUs from './AboutUs/AboutUs';
import Contact from './Contact/Contact';
import PropertyList from './PropertyList/PropertyList';
import PropertyDetail from './PropertyDetail/PropertyDetail';
import { Slider } from 'antd';
import Footer  from './Footer/Footer';
import ChatBubble from './Chat/ChatBubble';
import logo from '../assets/img/logo.png';

const { Header, Content } = Layout;


const theme = {
  '@primary-color': '#1890ff', // Color primario
  '@font-size-base': '16px', // Tamaño de fuente base
};

function Home() {
  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="logo-container" style={{ marginRight: '20px' }}>
          <img
            src={logo}
            alt="Mi logotipo"
            style={{ width: '60px', height: '50px', marginTop: '-5px' }}
          />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Nosotros</Menu.Item>
          <Menu.Item key="2">Contacto</Menu.Item>
          <Menu.Item key="4">Inmuebles</Menu.Item>
          <Menu.Item key="5">Testimonios</Menu.Item>
          <Menu.Item key="3">Iniciar Sesión</Menu.Item>
        </Menu>
      </Header>
      <Content>
        {/* Contenido principal de la página */}
        <div className="site-layout-content">
          <LandingPage />
          <PropertyList />
          <AboutUs />
          <Contact />
        </div>

        <ChatBubble />
      </Content>
      <Footer />
    </Layout>
  );
}

export default Home;
