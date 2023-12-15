import { useState } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';



function Clientes() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();


// Datos simulados
const dataSource = [
  {
    key: '1',
    nombre: 'Juan',
    correo: 'juan@example.com',
    telefono: '1234567890',
  },
  // Más clientes aquí...
];

const columns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
  },
  {
    title: 'Correo',
    dataIndex: 'correo',
    key: 'correo',
  },
  {
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  },
  {
    title: 'Acciones',
    key: 'acciones',
    render: (text, record) => (
      <div>
        <Button type="primary" onClick={() => handleEdit(record)}>Editar</Button>
        <Button danger onClick={() => handleDelete(record.key)}>Eliminar</Button>
      </div>
    ),
  },
];

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    // Aquí podrías eliminar el cliente con la clave proporcionada
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>Clientes</h1>
      <Button type="primary" onClick={handleAdd}>Añadir cliente</Button>
      <Table dataSource={dataSource} columns={columns} />
      <Modal title="Cliente" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item label="Nombre" name="nombre">
            <Input />
          </Form.Item>
          <Form.Item label="Correo" name="correo">
            <Input />
          </Form.Item>
          <Form.Item label="Teléfono" name="telefono">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Clientes;
    