import { Layout } from'antd';
import logo from '../../assets/img/sandarlogo1.png'; // Asegúrate de importar tu logotipo correctamente

const { Footer: AntFooter } = Layout;

function Footer() {
  const handleSelectableClick = (text) => {
    alert(`Clic en: ${text}`);
  };

  return (
    <AntFooter style={{ backgroundColor: '#171717' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
      <img src={logo} alt="Mi logotipo" style={{ width: '200px', height: '130px', marginBottom: '15px', marginTop: '-10px' }} />
      <p style={{ color: '#f0f2f5', textAlign: 'center', marginTop: '0', marginBottom: '20px' }}>Descubre tu hogar ideal con nosotros. 
        Nuestro compromiso es ayudarte a encontrar la propiedad que siempre has soñado. 
        Contáctanos hoy y deja que hagamos realidad tus sueños inmobiliarios.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span
            style={{
              color: '#FFD700',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: '5px',
            }}
            onClick={() => handleSelectableClick('Inicio')}
          >
            Inicio
          </span>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <span
            style={{
              color: '#FFD700',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: '5px',
            }}
            onClick={() => handleSelectableClick('Nosotros')}
          >
            Nosotros
          </span>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <span
            style={{
              color: '#FFD700',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: '5px',
            }}
            onClick={() => handleSelectableClick('Inmuebles')}
          >
            Inmuebles
          </span>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <span
            style={{
              color: '#FFD700',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: '5px',
            }}
            onClick={() => handleSelectableClick('Testimonios')}
          >
            Testimonios
          </span>
          <div style={{ margin: '0 10px', borderLeft: '1px solid #ccc', height: '30px' }}></div>
          <span
            style={{
              color: '#FFD700',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: '5px',
            }}
            onClick={() => handleSelectableClick('Contactanos')}
          >
            Contactanos
          </span>
        </div>
        <hr style={{ margin: '20px 0', borderColor: '#ccc' }} />
        <p style={{ color: 'gray' }}>Copyright 2023 © Todos los Derechos Reservados del Diseño por Imagine Codes</p>
      </div>
    </AntFooter>
  );
}

export default Footer;
