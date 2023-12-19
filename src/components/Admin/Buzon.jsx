import  { useState, useEffect } from "react";
import { Table } from "antd";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from "../firebase/firebase"; // Asegúrate de especificar la ruta correcta

const ContactList = () => {
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactCollection = collection(firestore, "contacts");
        const querySnapshot = await getDocs(contactCollection);

        const contacts = [];
        querySnapshot.forEach((doc) => {
          contacts.push({ id: doc.id, ...doc.data() });
        });

        setContactData(contacts);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    fetchContacts();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Mensaje",
      dataIndex: "message",
      key: "message",
    },
    {
        title: "Correo",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Asunto",
        dataIndex: "subject",
        key: "subject",
      },
    // Agrega más columnas según las propiedades de tus documentos
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bandeja de Entrada</h2>
      <Table dataSource={contactData} columns={columns} loading={loading} />
    </div>
  );
};

export default ContactList;
