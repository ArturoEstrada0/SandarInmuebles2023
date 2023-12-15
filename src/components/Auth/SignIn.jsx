import { Layout, Form, Input, Button } from 'antd';

const { Content } = Layout;

function SignIn() {
  return (
    <Content>
      <div className="site-layout-content">
        <h2>Iniciar Sesión</h2>
        <Form>
          {/* Formulario de inicio de sesión con campos de correo electrónico y contraseña */}
          <Form.Item label="Correo electrónico">
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Contraseña">
            <Input type="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary">Iniciar Sesión</Button>
          </Form.Item>
        </Form>
      </div>
    </Content>
  );
}

export default SignIn;
