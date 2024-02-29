import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import logo from '../../assets/img/logo2.png'
import texto from '../../assets/img/sandarcom.png'
import './Footer.css'

const { Footer: AntFooter } = Layout

function Footer() {
  return (
    <AntFooter style={{ backgroundColor: '#001529' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <img
          src={logo}
          alt='Mi logotipo'
          style={{
            width: '120px',
            height: '85px',
            marginBottom: '15px',
            marginTop: '-10px',
            opacity: '0.5',
          }}
        />
        <img
          src={texto}
          alt='Mi logotipo'
          style={{
            width: '120px',
            height: '85px',
            marginBottom: '15px',
            marginTop: '-10px',
            marginLeft: '-15px',
            opacity: '0.5',
          }}
        />
        <p
          style={{
            color: 'gray',
            textAlign: 'justify',
            marginTop: '0',
            opacity: '0.8',
            maxWidth: '650px',
            margin: 'auto',
          }}>
          Descubre tu hogar ideal con nosotros. Nuestro compromiso es ayudarte a
          encontrar la propiedad que siempre has soñado. Contáctanos hoy y deja
          que hagamos realidad tus sueños inmobiliarios.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '20px',
          }}>
          <Link to='/' className='link-footer' target='_self'>
            Inicio
          </Link>
          <div
            style={{
              margin: '0 10px',
              borderLeft: '1px solid gray',
              height: '30px',
              opacity: '0.3',
            }}></div>
          <Link to='/aboutUs' className='link-footer'>
            Nosotros
          </Link>
          <div
            style={{
              margin: '0 10px',
              borderLeft: '1px solid gray',
              height: '30px',
              opacity: '0.3',
            }}></div>
          <Link to='/vender' className='link-footer'>
            Vender
          </Link>
          <div
            style={{
              margin: '0 10px',
              borderLeft: '1px solid gray',
              height: '30px',
              opacity: '0.3',
            }}></div>
          <Link to='/comprar' className='link-footer'>
            Comprar
          </Link>
          <div
            style={{
              margin: '0 10px',
              borderLeft: '1px solid gray',
              height: '30px',
              opacity: '0.3',
            }}></div>
          <Link to='/contact' className='link-footer'>
            Contacto
          </Link>
          <div
            style={{
              margin: '0 10px',
              borderLeft: '1px solid gray',
              height: '30px',
              opacity: '0.3',
            }}></div>
          <Link to='/propertyList' className='link-footer'>
            Inmuebles
          </Link>
        </div>
        <hr style={{ margin: '20px 0', borderColor: 'gray' }} />
        <p style={{ color: 'gray', opacity: '0.6' }}>
          Copyright 2023 © Todos los Derechos Reservados del Diseño por Imagine
          Codes
        </p>
      </div>
    </AntFooter>
  )
}

export default Footer
