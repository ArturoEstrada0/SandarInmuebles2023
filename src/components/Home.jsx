import { Layout } from 'antd'
import LandingPage from './LandingPage/LandingPage'
import AboutUs from './AboutUs/AboutUs'
import Contact from './Contact/Contact'
import PropertyList from './PropertyList/PropertyList'
import Footer from './Footer/Footer'
import ChatBubble from './Chat/ChatBubble'
import Asesores from './Asesores/Asesores'
// import Testimonials from './Testimonials/Testimonials'

const { Content } = Layout

function Home() {
  return (
    <Layout>
      <Content style={{ marginTop: '65px' }}>
        <div className='site-layout-content'>
          <LandingPage />
          <PropertyList />
          {/* <Testimonials /> */}
          <AboutUs />
          <Asesores />
          <Contact />
        </div>

        <ChatBubble />
      </Content>
      <Footer />
    </Layout>
  )
}

export default Home
