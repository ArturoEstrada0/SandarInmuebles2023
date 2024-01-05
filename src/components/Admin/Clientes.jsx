import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';  // Asegúrate de importar la instancia correcta de firestore

function Clientes() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState([]);

  // Datos simulados
  const dataSource = usuarios.map((usuario) => ({ key: usuario.id, ...usuario }));

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'nombre',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'correo',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
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

  useEffect(() => {
    const obtenerUsuariosFirestore = async () => {
      const usuariosCollection = collection(firestore, 'usuarios');
      try {
        const querySnapshot = await getDocs(usuariosCollection);
        const usuariosData = [];
        querySnapshot.forEach((doc) => {
          usuariosData.push({ id: doc.id, ...doc.data() });
        });
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios desde Firestore:', error);
        // Puedes manejar el error según tus necesidades
      }
    };

    obtenerUsuariosFirestore();
  }, []);

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    // Aquí podrías implementar la lógica para eliminar el cliente con la clave proporcionada
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
