import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import {
  getDocs,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore, auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

function Asociados() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [usuarios, setUsuarios] = useState([]);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleteKey, setDeleteKey] = useState(null);
  const [editingUid, setEditingUid] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  

  useEffect(() => {
    const obtenerUsuariosFirestore = async () => {
      const usuariosCollection = collection(firestore, "usuarios");
      try {
        const querySnapshot = await getDocs(usuariosCollection);
        const usuariosData = [];
        querySnapshot.forEach((doc) => {
          usuariosData.push({ uid: doc.id, ...doc.data() });
        });
        setUsuarios(usuariosData);
      } catch (error) {
        console.error(
          "Error al obtener la lista de usuarios desde Firestore:",
          error
        );
      }
    };

    obtenerUsuariosFirestore();
  }, []);

  const usuariosAsociados = usuarios.filter(
    (usuario) => usuario.role === "asociado"
  );
  const dataSource = usuariosAsociados.map((usuario) => ({
    key: usuario.uid,
    ...usuario,
  }));

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "nombre",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "correo",
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "telefono",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          >
            Editar
          </Button>
          <Button
            danger
            onClick={() => showDeleteConfirm(record.key)}
            icon={<DeleteOutlined />}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const showDeleteConfirm = (key) => {
    setConfirmDeleteVisible(true);
    setDeleteKey(key);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, "usuarios", deleteKey));
      setUsuarios(usuarios.filter((usuario) => usuario.uid !== deleteKey));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    } finally {
      setConfirmDeleteVisible(false);
    }
  };

  const handleAdd = () => {
    setIsModalVisible(true);
  };

// La función handleEdit
const handleEdit = (record) => {
  const { uid, name, phone, email } = record;
  form.setFieldsValue({ nombre: name, telefono: phone, correo: email });
  setEditingUid(uid);
  setIsEditMode(true);
  setIsModalVisible(true);
};

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { nombre, telefono, correo, contraseña } = values;

      if (isEditMode) {
        const userDocRef = doc(firestore, "usuarios", editingUid);
        await updateDoc(userDocRef, { name: nombre, phone: telefono });

        const updatedUsuarios = usuarios.map((usuario) =>
          usuario.uid === editingUid
            ? { ...usuario, name: nombre, phone: telefono }
            : usuario
        );
        setUsuarios(updatedUsuarios);
      } else {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          correo,
          contraseña
        );
        const userDocRef = doc(firestore, "usuarios", user.uid);
        await setDoc(userDocRef, {
          name: nombre,
          phone: telefono,
          email: correo,
          role: "asociado",
        });

        setUsuarios([
          ...usuarios,
          {
            uid: user.uid,
            name: nombre,
            phone: telefono,
            email: correo,
            role: "asociado",
          },
        ]);
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error al editar o añadir el usuario:", error);
    }
  };

  const handleCancel = () => {
    setEditingUid(null);
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>Asociados</h1>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd} icon={<UserAddOutlined />}>
          Añadir Asociado
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Confirmación de Eliminación"
        visible={confirmDeleteVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p>¿Estás seguro que deseas eliminar este usuario?</p>
      </Modal>

      <Modal
        title="Cliente"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={{ uid: editingUid }}>
          <Form.Item label="Nombre" name="nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {!isEditMode && (
            <>
              <Form.Item
                label="Correo"
                name="correo"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="contraseña"
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item name="uid" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Asociados;
