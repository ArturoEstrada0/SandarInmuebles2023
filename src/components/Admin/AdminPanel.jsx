import { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  DollarOutlined,
  KeyOutlined,
  MailOutlined,
  MessageOutlined,
  FileOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import Inicio from './Inicio';
import Asociados from './Asociados';
import Clientes from './Clientes';
import Propiedades from './Propiedades';
import Contratos from './Contratos';
import Buzon from './Buzon';
import ChatGPT from './ChatGPT';
import Configuracion from './Configuracion';

const { Content, Sider } = Layout;

function AdminPanel() {
  const [seccion, setSeccion] = useState('inicio');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderizarSeccion = () => {
    switch (seccion) {
      case 'inicio':
        return <Inicio />;
      case 'asociados':
        return <Asociados />;
      case 'clientes':
        return <Clientes />;
      case 'propiedades':
        return <Propiedades />;
      case 'contratos':
        return <Contratos />;
      case 'buzon':
        return <Buzon />;
      case 'chatgpt':
        return <ChatGPT />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Inicio />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isDesktop ? (
        <Sider collapsible collapsedWidth={80} onCollapse={() => {}}>
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
            <Menu.Item key='contratos' icon={<FolderOutlined />}>
              Ficha Técnica
            </Menu.Item>
            <Menu.Item key='buzon' icon={<MailOutlined />}>
              Buzon
            </Menu.Item>
            <Menu.Item key='chatgpt' icon={<MessageOutlined />}>
              ChatGPT
            </Menu.Item>
            <Menu.Item key='configuracion' icon={<KeyOutlined />}>
              Configuración
            </Menu.Item>
          </Menu>
        </Sider>
      ) : (
        <div style={{ backgroundColor: '#001529', paddingTop: "10px", paddingBottom: "10px", textAlign: 'center', position: 'fixed', bottom: 0, width: '100%', zIndex: 100 }}>
          <Button type="text" onClick={() => setSeccion('inicio')} icon={<HomeOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
          <Button type="text" onClick={() => setSeccion('asociados')} icon={<UserOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
          <Button type="text" onClick={() => setSeccion('clientes')} icon={<UserOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
          <Button type="text" onClick={() => setSeccion('propiedades')} icon={<DollarOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
          <Button type="text" onClick={() => setSeccion('buzon')} icon={<MailOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
          <Button type="text" onClick={() => setSeccion('chatgpt')} icon={<MessageOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
          <Button type="text" onClick={() => setSeccion('configuracion')} icon={<KeyOutlined style={{ fontSize: '24px', color: '#fff' }} />} />
        </div>
      )}
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          {renderizarSeccion()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPanel;
