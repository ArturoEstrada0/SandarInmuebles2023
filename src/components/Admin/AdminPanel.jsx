import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  KeyOutlined,
  MailOutlined,
  MessageOutlined, // Importa el icono necesario
} from '@ant-design/icons';
import Inicio from './Inicio';
import Asociados from './Asociados';
import Clientes from './Clientes';
import Propiedades from './Propiedades';
import Contratos from './Contratos';
import Buzon from './Buzon';
import ChatGPT from './ChatGPT'; // Importa el componente ChatGPT
import Configuracion from './Configuracion';

const { Sider, Content } = Layout

function AdminPanel() {
  const [seccion, setSeccion] = useState('inicio')

  const renderizarSeccion = () => {
    switch (seccion) {
      case 'inicio':
        return <Inicio />;
      case 'asociados':
        return <Asociados />;
      case 'clientes':
        return <Clientes />
      case 'propiedades':
        return <Propiedades />
      case 'contratos':
        return <Contratos />
      case 'buzon':
        return <Buzon />
      case 'chatgpt':
        return <ChatGPT />
      case 'configuracion':
        return <Configuracion />
      default:
        return <Inicio />
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', marginTop: '65px' }}>
      <Sider>
        <div className='logo' />
        <Menu
          theme='dark'
          defaultSelectedKeys={['inicio']}
          mode='inline'
          onClick={({ key }) => setSeccion(key)}>
          <Menu.Item key='inicio' icon={<HomeOutlined />}>
            Inicio
          </Menu.Item>
        <Menu.Item key="asociados" icon={<UserOutlined />}>
            Asociados
        </Menu.Item>
          <Menu.Item key="clientes" icon={<UserOutlined />}>
            Clientes
          </Menu.Item>
          <Menu.Item key='propiedades' icon={<DollarOutlined />}>
            Propiedades
          </Menu.Item>
          <Menu.Item key='contratos' icon={<KeyOutlined />}>
            Contratos
          </Menu.Item>
          <Menu.Item key='buzon' icon={<MailOutlined />}>
            Buzon
          </Menu.Item>
          <Menu.Item key='chatgpt' icon={<MessageOutlined />}>
            ChatGPT
          </Menu.Item>
          <Menu.Item key='configuracion' icon={<MessageOutlined />}>
            Configuracion
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>{renderizarSeccion()}</Content>
      </Layout>
    </Layout>
  )
}

export default AdminPanel
