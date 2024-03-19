// Vender.jsx
import React, { useState } from 'react'
import { FaRegHandshake } from 'react-icons/fa'
import {
  Form,
  Input,
  Button,
  Steps,
  Collapse,
  Divider,
  Select,
  message,
} from 'antd'
import './Vender.css'
import ventaImage from '../../assets/img/venta.jpg'
import { collection, addDoc } from 'firebase/firestore'
import { firestore } from '../firebase/firebase'
import { Helmet } from 'react-helmet'

const { Step } = Steps
const { Panel } = Collapse
const { Option } = Select

const Vender = () => {
  const [form] = Form.useForm()
  // const [currentStep, setCurrentStep] = useState(0);
  const [currentStep1, setCurrentStep1] = useState(0)

  const handleStepClick = (step) => {
    setCurrentStep1(step)
  }

  //const handleNextStep = () => {
  // Validar campos del formulario actual
  //form.validateFields().then(() => {
  // Cambiar al siguiente paso si los campos están llenos
  //   setCurrentStep(currentStep + 1);
  // }).catch((errorInfo) => {
  // Mostrar alerta inline si hay campos vacíos
  //  console.log('Validation failed:', errorInfo);
  //  form.scrollToField(errorInfo.errorFields[0].name);

  // });
  //};

  // const handlePrevStep = () => {
  //setCurrentStep(currentStep - 1);
  //};

  const onFinish = async (values) => {
    try {
      const contactCollection = collection(firestore, 'msVenta')
      await addDoc(contactCollection, values)

      console.log('Datos enviados correctamente a Firestore: ', values)
      message.success('Mensaje enviado correctamente')

      form.resetFields()
    } catch (error) {
      console.log('Error al enviar datos a Firestore: ', error)
      message.error(
        'Error al enviar el mensaje. Por favor, inténtalo de nuevo.',
      )
    }
  }
  const propertyOptions = [
    { label: 'Casa', value: 'Casa' },
    { label: 'Departamento', value: 'Departamento' },
    { label: 'Terreno', value: 'Terreno' },
    { label: 'Oficina', value: 'Oficina' },
    { label: 'Local', value: 'Local' },
    { label: 'Bodega', value: 'Bodega' },
    { label: 'Edificio', value: 'Edificio' },
  ]

  return (
    <div className='vender-container'>
      <Helmet>
        <title>Vender Propiedad - Sandar Inmuebles</title>
        <meta
          name='description'
          content='¿Deseas vender tu propiedad? En Sandar Inmuebles te apoyamos en todo el proceso de inicio a fin. Contáctanos llenando el formulario en esta página.'
        />
        <meta
          name='keywords'
          content='vender, propiedad, inmuebles, Sandar Inmuebles'
        />
        <meta name='author' content='Sandar Inmuebles' />
      </Helmet>
      <div className='background-container'>
        <img className='background-image' src={ventaImage} alt='Background' />
        <div className='overlay-content'>
          <FaRegHandshake className='handshake-icon' />
          <h1>¿Deseas vender tu propiedad?</h1>
          <p>
            ¡Estamos emocionados de ayudarte a vender tu propiedad! Contáctanos
            para obtener más información.
          </p>
        </div>
      </div>

      {/* Nuevo elemento para el rectángulo azul debajo */}
      <div className='blue-rectangle'>
        <div className='blue-line'></div>
        <p className='blue-text'>
          En Sandar Inmuebles te ofrecemos una amplia selección de propiedades
          disponibles para compra y venta. Nuestros agentes están listos para
          ayudarte a encontrar la casa, departamento o local comercial que se
          adapte a tus necesidades y presupuesto. Sandar Inmuebles también
          ofrece servicios de gestión de propiedades para propietarios e
          inversores. Nos encargamos de la administración, mantenimiento y
          alquiler de tus propiedades para que obtengas el máximo rendimiento.
        </p>
        <div className='blue-line'></div>
      </div>

      <div className='titulo-container'>
        <h1>Te Apoyamos en todo el proceso de Inicio a fin</h1>
        <p>
          El compromiso de Sandar Inmuebles es acompañarte y asesorarte en todas
          las etapas del proceso de venta, para que la venta sea rapida y
          efectiva.
        </p>
      </div>
      <div className='step-container'>
        <Steps
          current={currentStep1}
          style={{ marginBottom: '20px' }}
          direction='vertical'>
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Contacto Inicia
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Establecer conexión con el cliente y conocer sus necesidades.
              </span>
            }
            onClick={() => handleStepClick(0)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Recolección de Datos
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Obtener información detallada sobre preferencias y situación
                financiera.
              </span>
            }
            onClick={() => handleStepClick(1)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Presentación del Inmueble
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Destacar características clave y responder a preguntas.
              </span>
            }
            onClick={() => handleStepClick(2)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Retroalimentacion del Cliente
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Recopilar comentarios para ajustar la estrategia de venta.
              </span>
            }
            onClick={() => handleStepClick(3)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Ajustes y Negociación
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Modificar estrategia y negociar términos con el cliente.
              </span>
            }
            onClick={() => handleStepClick(4)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Documentación y Formalización
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Preparar la documentación necesaria y guiar en el proceso de
                formalización.
              </span>
            }
            onClick={() => handleStepClick(5)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Financiamiento (si aplica)
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Facilitar obtención de financiamiento y coordinar con
                instituciones financieras.
              </span>
            }
            onClick={() => handleStepClick(6)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Inspección y Evaluación
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Coordinar inspecciones y evaluaciones necesarias para la
                propiedad.
              </span>
            }
            onClick={() => handleStepClick(7)}
            style={{ marginBottom: '20px' }}
          />
          <Step
            title={
              <span style={{ fontSize: '1.3em', fontFamily: 'Geometos' }}>
                Cierre y Seguimiento Postventa
              </span>
            }
            description={
              <span style={{ fontSize: '1.1em' }}>
                Finalizar la venta y realizar seguimiento postventa para
                garantizar satisfacción.
              </span>
            }
            onClick={() => handleStepClick(8)}
            style={{ marginBottom: '20px' }}
          />
        </Steps>

        {/* Nueva sección para los Collapse */}
        <div className='collapse-container'>
          <Divider orientation='left'>
            <h4 style={{ fontFamily: 'Geometos' }}>Preguntas Frecuentes</h4>
          </Divider>
          <Collapse>
            <Panel
              header={
                <span style={{ fontSize: '1em' }}>
                  1.- ¿Que debo incluir en mi oferta de propiedad?
                </span>
              }
              key='1'>
              <p style={{ textAlign: 'justify' }}>
                Una oferta debe contemplar un plan estratégico con el segmento y
                público meta para aprovechar los canales de comunicación. Es
                importante contar con fotos en alta resolución de todos los
                espacios, el frente de la propiedad, la zona y las amenidades
                más importantes. Puedes también grabar un vídeo recorrido de la
                propiedad para hacerla destacar del resto.
              </p>
            </Panel>
          </Collapse>

          <Divider orientation='left'></Divider>
          <Collapse>
            <Panel
              header={
                <span style={{ fontSize: '1.1em' }}>
                  2.- ¿Que puedo esperar del cierre?
                </span>
              }
              key='1'>
              <p style={{ textAlign: 'justify' }}>
                El cierre es un proceso en donde se finalizan todos los detalles
                de la transacción y se verifica que todo esté en orden con tu
                crédito inmobiliario. Este se realiza en presencia de abogados,
                tu asesor inmobiliario, notario y un representante del crédito.
              </p>
            </Panel>
          </Collapse>

          <Divider orientation='left'></Divider>
          <Collapse>
            <Panel
              header={
                <span style={{ fontSize: '1em' }}>
                  3.- ¿Cuales son los errores mas comunes en los contratos que
                  debo evitar?
                </span>
              }
              key='1'>
              <p style={{ textAlign: 'justify' }}>
                Te recomendamos siempre revisar las cláusulas de pago y fijar
                correctamente quién es la persona que estará descrita en el
                contrato. También señala de forma clara las fechas de pago, los
                montos totales y, sobre todo, verificar que todo el contrato
                esté correctamente firmado.
              </p>
            </Panel>
          </Collapse>

          <Divider orientation='left'></Divider>
          <Collapse>
            <Panel
              header={
                <span style={{ fontSize: '1.1em' }}>
                  4.- ¿Que tramites hay que hacer para cerrar?
                </span>
              }
              key='1'>
              <p style={{ textAlign: 'justify' }}>
                Para cerrar se hará la revisión y aprobación de aval, póliza
                jurídica o seguro de caución. Además se llevará a cabo la firma
                de documentos.
              </p>
            </Panel>
          </Collapse>

          <Divider orientation='left'></Divider>
          <Collapse>
            <Panel
              header={
                <span style={{ fontSize: '1em' }}>
                  5.- ¿Cuales son las contigencias mas comunes durante la oferta
                  de compra?
                </span>
              }
              key='1'>
              <p style={{ textAlign: 'justify' }}>
                Una de las contingencias más comunes es saber cuándo negociar y
                establecer el porcentaje de anticipo.
              </p>
            </Panel>
          </Collapse>
        </div>
      </div>

      <div className='avisos-privacidad-container'>
        <h2 style={{ color: 'white', fontFamily: 'Geometos' }}>
          Aviso de Privacidad
        </h2>
        <p style={{ textAlign: 'justify' }}>
          En Sandar Inmuebles, nos interesa y respetamos tu privacidad por eso
          nos dedicamos a proteger tus datos personales.
          <br />
          <br />
          <br />
          Por definir...
        </p>
        <p style={{ textAlign: 'justify' }}>
          Para obtener más información sobre cómo manejamos tus datos
          personales, consulta nuestra{' '}
          <a href='/Aboutus'>Política de Privacidad</a>.
        </p>
      </div>

      <div className='titulo-container'>
        <h1>Iniciemos el proceso de venta juntos</h1>
        <p>Contactanos llenando el siguiente formulario.</p>
      </div>
      <div className='contact-form-container'>
        <Form form={form} onFinish={onFinish} layout='vertical'>
          <Form.Item
            label='Nombre'
            name='nombre'
            rules={[
              { required: true, message: 'Por favor, ingresa tu nombre' },
            ]}
            labelCol={{ span: 6, style: { fontFamily: 'Geometos' } }}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Correo Electrónico'
            name='email'
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Por favor, ingresa un correo electrónico válido',
              },
            ]}
            labelCol={{ span: 8, style: { fontFamily: 'Geometos' } }}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Teléfono'
            name='telefono'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa tu número de teléfono',
              },
            ]}
            labelCol={{ span: 6, style: { fontFamily: 'Geometos' } }}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Tipo de Propiedad'
            name='tipoPropiedad'
            rules={[
              {
                required: true,
                message: 'Por favor, selecciona el tipo de propiedad',
              },
            ]}
            labelCol={{ span: 6, style: { fontFamily: 'Geometos' } }}>
            <Select placeholder='Selecciona el tipo de propiedad'>
              {propertyOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Dirección de la Propiedad'
            name='direccion'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa la dirección de la propiedad',
              },
            ]}
            labelCol={{ span: 10, style: { fontFamily: 'Geometos' } }}>
            <Input />
          </Form.Item>

          <Form.Item
            label='Mensaje para la solicitud de Venta'
            name='motivo'
            rules={[
              {
                required: true,
                message: 'Por favor, ingresa el motivo de la venta',
              },
            ]}
            labelCol={{ span: 15, style: { fontFamily: 'Geometos' } }}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              style={{
                fontFamily: 'Geometos',
                fontSize: '0.9em',
                backgroundColor: '#001529',
              }}>
              Enviar Mensaje
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Vender
