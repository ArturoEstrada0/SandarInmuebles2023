import React, { useState, useEffect } from "react";
import { Table, Tabs, notification, Badge, Input, Row, Col } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase"; // Asegúrate de especificar la ruta correcta

import { SearchOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const ContactList = () => {
  const [contactDataContacts, setContactDataContacts] = useState([]);
  const [contactDataMsgPro, setContactDataMsgPro] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMsgPro, setLoadingMsgPro] = useState(true);
  const [currentTab, setCurrentTab] = useState("contacts");
  const [notificationMessage] = useState("");
  const [newMessagesContacts, setNewMessagesContacts] = useState([]);
  const [newMessagesMsgPro, setNewMessagesMsgPro] = useState([]);
  const [notificationCountContacts, setNotificationCountContacts] = useState(0);
  const [notificationCountMsgPro, setNotificationCountMsgPro] = useState(0);

  // Estados para los filtros de búsqueda de contactos
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchSubject, setSearchSubject] = useState("");

  // Estados para los filtros de búsqueda de mensajes de propiedades
  const [searchMsgProName, setSearchMsgProName] = useState("");
  const [searchMsgProEmail, setSearchMsgProEmail] = useState("");
  const [searchMsgProProperty, setSearchMsgProProperty] = useState("");

  const filteredContacts = contactDataContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchName.toLowerCase()) &&
      contact.phone.toLowerCase().includes(searchPhone.toLowerCase()) &&
      contact.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      contact.subject.toLowerCase().includes(searchSubject.toLowerCase())
  );

  // Filtrar mensajes de propiedades según los criterios de búsqueda
  const filteredMsgPro = contactDataMsgPro.filter(
    (msgPro) =>
      msgPro.name.toLowerCase().includes(searchMsgProName.toLowerCase()) &&
      msgPro.email.toLowerCase().includes(searchMsgProEmail.toLowerCase()) &&
      msgPro.propertyName.toLowerCase().includes(searchMsgProProperty.toLowerCase())
  );

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactCollection = collection(firestore, "contacts");
        const querySnapshot = await getDocs(contactCollection);

        const contacts = [];
        querySnapshot.forEach((doc) => {
          contacts.push({ id: doc.id, ...doc.data() });
        });

        const newMessages = contacts.filter(
          (message) => !contactDataContacts.some((existingMessage) => existingMessage.id === message.id)
        );

        setContactDataContacts(contacts);

        if (newMessages.length > 0) {
          setNewMessagesContacts(newMessages);
          setNotificationCountContacts(newMessages.length);
        }

        setLoadingContacts(false);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    const fetchMsgPro = async () => {
      try {
        const contactCollection = collection(firestore, "msgpro");
        const querySnapshot = await getDocs(contactCollection);

        const contacts = [];
        querySnapshot.forEach((doc) => {
          contacts.push({ id: doc.id, ...doc.data() });
        });

        const newMessages = contacts.filter(
          (message) => !contactDataMsgPro.some((existingMessage) => existingMessage.id === message.id)
        );

        setContactDataMsgPro(contacts);

        if (newMessages.length > 0) {
          setNewMessagesMsgPro(newMessages);
          setNotificationCountMsgPro(newMessages.length);
        }

        setLoadingMsgPro(false);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    if (currentTab === "contacts") {
      fetchContacts();
    } else if (currentTab === "msgpro") {
      fetchMsgPro();
    }
  }, [currentTab]);

  useEffect(() => {
    // Mostrar notificación solo si hay nuevos mensajes
    if (currentTab === "contacts" && newMessagesContacts.length > 0) {
      const description = newMessagesContacts.map((message) => `${message.name}: ${message.subject}`).join(", ");

      notification.info({
        message: notificationMessage || `Nuevo mensaje`,
        description,
        duration: 1.2, // Mantener abierta la notificación hasta que el usuario la cierre
        onClose: () => {
          // Limpiar el contador y la lista de nuevos mensajes después de cerrar la notificación
          setNotificationCountContacts(0);
          setNewMessagesContacts([]);
        },
      });
    } else if (currentTab === "msgpro" && newMessagesMsgPro.length > 0) {
      const description = newMessagesMsgPro.map((message) => `${message.name}: ${message.propertyName}`).join(", ");

      notification.info({
        message: notificationMessage || `Nuevo mensaje`,
        description,
        duration: 1.2, // Mantener abierta la notificación hasta que el usuario la cierre
        onClose: () => {
          // Limpiar el contador y la lista de nuevos mensajes después de cerrar la notificación
          setNotificationCountMsgPro(0);
          setNewMessagesMsgPro([]);
        },
      });
    }
  }, [newMessagesContacts, newMessagesMsgPro, notificationMessage, currentTab]);

  const columnsContacts = [
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
  ];

  const columnsMsgPro = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Correo Electrónico",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mensaje",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Propiedad",
      dataIndex: "propertyName",
      key: "propertyName",
    },
  ];

  const handleTabChange = (key) => {
    setCurrentTab(key);
    setLoadingContacts(true);
    setLoadingMsgPro(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bandeja de Entrada</h2>
      <Tabs activeKey={currentTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <Badge count={notificationCountContacts} offset={[5, 0]}>
              Contactos
            </Badge>
          }
          key="contacts"
        >
          {/* Agregar filtros de búsqueda para contactos */}
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            <Col span={6}>
              <Input
                placeholder="Buscar por nombre"
                onChange={(e) => setSearchName(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="Buscar por teléfono"
                onChange={(e) => setSearchPhone(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="Buscar por correo"
                onChange={(e) => setSearchEmail(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="Buscar por asunto"
                onChange={(e) => setSearchSubject(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
          </Row>
          <Table dataSource={filteredContacts} columns={columnsContacts} loading={loadingContacts} />
        </TabPane>
        <TabPane
          tab={
            <Badge count={notificationCountMsgPro} offset={[5, 0]}>
              Interesados en Propiedades
            </Badge>
          }
          key="msgpro"
        >
          {/* Agregar filtros de búsqueda para mensajes de propiedades */}
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            <Col span={8}>
              <Input
                placeholder="Buscar por nombre"
                onChange={(e) => setSearchMsgProName(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="Buscar por correo electrónico"
                onChange={(e) => setSearchMsgProEmail(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="Buscar por propiedad"
                onChange={(e) => setSearchMsgProProperty(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
          </Row>
          <Table dataSource={filteredMsgPro} columns={columnsMsgPro} loading={loadingMsgPro} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ContactList;
