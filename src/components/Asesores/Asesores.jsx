import { Layout, Typography, Divider } from 'antd'
import asesores from '../../assets/img/asesores.jpg'
import './Asesores.css' // Asegúrate de tener un archivo de estilos para personalizar según tus necesidades

const { Content } = Layout
const { Title } = Typography

export default function Asesores() {
  return (
    <Content style={{ backgroundColor: '#ffff', marginTop: '3rem' }}>
      <div className='asesores-container'>
        <div className='image-container'>
          {/* Aquí deberías poner la ruta de tu imagen */}
          <img src={asesores} alt='Imagen de asesor' />
        </div>
        <div className='asesor-container'>
          {/*<h4>ASESORES</h4>*/}
          <Title level={3} className='asesor-title'>
            Encuentra a tu Asesor
          </Title>
          <p>
            Nuestros expertos en bienes raíces te proporcionarán asesoramiento
            profesional durante todo el proceso de compra o venta de
            propiedades. Estamos comprometidos en ayudarte a tomar decisiones
            informadas y estratégicas.
          </p>
          <Divider
            style={{ borderWidth: '2px', margin: '20px 0', marginLeft: '40px' }}
          />
          <div className='button-asesor'>
            <button>Contactar</button>
          </div>
        </div>
      </div>
    </Content>
  )
}
