import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import Inicio from './Inicio';
import Clientes from './Clientes';
import Propiedades from './Propiedades';
import Contratos from './Contratos';


const { Sider, Content } = Layout;

function AdminPanel() {
  const [seccion, setSeccion] = useState('inicio');

  const renderizarSeccion = () => {
    switch (seccion) {
      case 'inicio':
        return <Inicio />;
      case 'clientes':
        return <Clientes />;
      case 'propiedades':
        return <Propiedades />;
      case 'contratos':
        return <Contratos />;
      default:
        return <Inicio />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={({ key }) => setSeccion(key)}>
          <Menu.Item key="inicio" icon={<HomeOutlined />}>
            Inicio
          </Menu.Item>
          <Menu.Item key="clientes" icon={<UserOutlined />}>
            Clientes
          </Menu.Item>
          <Menu.Item key="propiedades" icon={<DollarOutlined />}>
            Propiedades
          </Menu.Item>
          <Menu.Item key="contratos" icon={<KeyOutlined />}>
            Contratos
          </Menu.Item>
          <Menu.Item key="buzon" icon={<KeyOutlined />}>
            Buzon
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          {renderizarSeccion()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPanel;
