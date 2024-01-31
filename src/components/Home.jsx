import { Layout } from 'antd'
import LandingPage from './LandingPage/LandingPage'
import AboutUs from './AboutUs/AboutUs'
import Contact from './Contact/Contact'
import PropertyList from './PropertyList/PropertyList'
import Footer from './Footer/Footer'
import ChatBubble from './Chat/ChatBubble'
import Asesores from './Asesores/Asesores'


import ThemeProvider from 'react-bootstrap/ThemeProvider'


const { Content } = Layout

function Home() {
  return (
    <Layout>
      <Content style={{ marginTop: '65px' }}>
      <ThemeProvider
  breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
  minBreakpoint="xxs">
        <div className='site-layout-content'>
          <LandingPage />
          <PropertyList />
          <AboutUs />
          <Asesores />
          <Contact />
        </div>

        <ChatBubble />
        </ThemeProvider>

      </Content>
      <Footer />

    </Layout>
    
  )
}

export default Home
