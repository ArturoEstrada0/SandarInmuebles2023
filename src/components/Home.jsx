import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import LandingPage from './LandingPage/LandingPage';
import AboutUs from './AboutUs/AboutUs';
import Contact from './Contact/Contact';
import PropertyList from './PropertyList/PropertyList';
import PropertyDetail from './PropertyDetail/PropertyDetail';
import { Slider } from 'antd';
import Footer  from './Footer/Footer';
import ChatBubble from './Chat/ChatBubble';
import Login from './Auth/Login';

const { Header, Content } = Layout;

const theme = {
  '@primary-color': '#1890ff', // Color primario
  '@font-size-base': '16px', // Tamaño de fuente base
};

function Home() {
  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/nosotros">Nosotros</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/contacto">Contacto</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/inmuebles">Inmuebles</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/testimonios">Testimonios</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/login">Iniciar Sesión</Link>
          </Menu.Item>
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
