import { Layout } from 'antd';
import LandingPage from './LandingPage/LandingPage';
import AboutUs from './AboutUs/AboutUs';
import Contact from './Contact/Contact';
import PropertyList from './PropertyList/PropertyList';
import PropertyDetail from './PropertyDetail/PropertyDetail';
import { Slider } from 'antd';
import Footer  from './Footer/Footer';
import ChatBubble from './Chat/ChatBubble';
import Header from './Header';


const { Content } = Layout;



function Home() {
  return (

    <Layout>
      <Header />

      <Content style={{ marginTop: '65px' }}>
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
