import { useState, useEffect } from "react";
import { Table, Tabs, notification, Badge, Input, Button } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { SearchOutlined } from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';


const { TabPane } = Tabs;

const ContactList = () => {
  const [contactDataContacts, setContactDataContacts] = useState([]);
  const [contactDataMsgPro, setContactDataMsgPro] = useState([]);
  const [contactDataMsgVenta, setContactDataMsgVenta] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMsgPro, setLoadingMsgPro] = useState(true);
  const [loadingMsgVenta, setLoadingMsgVenta] = useState(true);
  const [currentTab, setCurrentTab] = useState("contacts");
  const [notificationMessage] = useState("");
  const [newMessagesContacts, setNewMessagesContacts] = useState([]);
  const [newMessagesMsgPro, setNewMessagesMsgPro] = useState([]);
  const [newMessagesMsgVenta, setNewMessagesMsgVenta] = useState([]);
  const [notificationCountContacts, setNotificationCountContacts] = useState(0);
  const [notificationCountMsgPro, setNotificationCountMsgPro] = useState(0);
  const [notificationCountMsgVenta, setNotificationCountMsgVenta] = useState(0);

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

    const fetchMsgVenta = async () => {
      try {
        const contactCollection = collection(firestore, "msVenta");
        const querySnapshot = await getDocs(contactCollection);

        const contacts = [];
        querySnapshot.forEach((doc) => {
          contacts.push({ id: doc.id, ...doc.data() });
        });

        const newMessages = contacts.filter(
          (message) => !contactDataMsgVenta.some((existingMessage) => existingMessage.id === message.id)
        );

        setContactDataMsgVenta(contacts);

        if (newMessages.length > 0) {
          setNewMessagesMsgVenta(newMessages);
          setNotificationCountMsgVenta(newMessages.length);
        }

        setLoadingMsgVenta(false);
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }
    };

    if (currentTab === "contacts") {
      fetchContacts();
    } else if (currentTab === "msgpro") {
      fetchMsgPro();
    } else if (currentTab === "msgventa") {
      fetchMsgVenta();
    }
  }, [currentTab]);

  useEffect(() => {
    if (currentTab === "contacts" && newMessagesContacts.length > 0) {
      const description = newMessagesContacts.map((message) => `${message.name}: ${message.subject}`).join(", ");

      notification.info({
        message: notificationMessage || `Nuevo mensaje`,
        description,
        duration: 1.2,
        onClose: () => {
          setNotificationCountContacts(0);
          setNewMessagesContacts([]);
        },
      });
    } else if (currentTab === "msgpro" && newMessagesMsgPro.length > 0) {
      const description = newMessagesMsgPro.map((message) => `${message.name}: ${message.propertyName}`).join(", ");

      notification.info({
        message: notificationMessage || `Nuevo mensaje`,
        description,
        duration: 1.2,
        onClose: () => {
          setNotificationCountMsgPro(0);
          setNewMessagesMsgPro([]);
        },
      });
    } else if (currentTab === "msgventa" && newMessagesMsgVenta.length > 0) {
      const description = newMessagesMsgVenta.map((message) => `${message.nombre}: ${message.tipoPropiedad}`).join(", ");

      notification.info({
        message: notificationMessage || `Nuevo mensaje`,
        description,
        duration: 1.2,
        onClose: () => {
          setNotificationCountMsgVenta(0);
          setNewMessagesMsgVenta([]);
        },
      });
    }
  }, [newMessagesContacts, newMessagesMsgPro, newMessagesMsgVenta, notificationMessage, currentTab]);

  const handleTabChange = (key) => {
    setCurrentTab(key);
    setLoadingContacts(true);
    setLoadingMsgPro(true);
    setLoadingMsgVenta(true);
  };

  const columnsContacts = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      // Agregar campo de búsqueda para nombre
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Nombre"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Telefono"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.phone.toLowerCase().includes(value.toLowerCase()),
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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Correo"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Asunto",
      dataIndex: "subject",
      key: "subject",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Asunto"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.subject.toLowerCase().includes(value.toLowerCase()),
    },
  ];

  const columnsMsgPro = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      // Agregar campo de búsqueda para nombre en mensajes de propiedades
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Nombre"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Apellido",
      dataIndex: "lastname",
      key: "lastname",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Apellido"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Telefono",
      dataIndex: "phone",
      key: "phone",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Apellido"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Correo Electrónico",
      dataIndex: "email",
      key: "email",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Correo"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Mensaje",
      dataIndex: "intro",
      key: "intro",
    },
    {
      title: "Propiedad",
      dataIndex: "propertyName",
      key: "propertyName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Propiedad"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
        
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.propertyName.toLowerCase().includes(value.toLowerCase()),
    },
  ];

  const columnsMsgVenta = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      // Agregar campo de búsqueda para nombre
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Nombre"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.nombre.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Telefono"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.telefono.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar Correo"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Tipo de Propiedad",
      dataIndex: "tipoPropiedad",
      key: "tipoPropiedad",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar el Tipo de Propiedad"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.tipoPropiedad.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Direccion",
      dataIndex: "direccion",
      key: "direccion",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar la Direccion"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reiniciar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
      onFilter: (value, record) => record.direccion.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Mensaje",
      dataIndex: "motivo",
      key: "motivo",
    },
  ];

  const downloadExcel = (tabKey) => {
    let data, columns;
    
    if (tabKey === "contacts") {
      data = contactDataContacts;
      columns = columnsContacts;
    } else if (tabKey === "msgpro") {
      data = contactDataMsgPro;
      columns = columnsMsgPro;
    } else if (tabKey === "msgventa") {
      data = contactDataMsgVenta;
      columns = columnsMsgVenta;
    }
  
    const dataToExport = [];
    
    data.forEach((contact) => {
      const rowData = [];
      columns.forEach((column) => {
        rowData.push(contact[column.dataIndex]);
      });
      dataToExport.push(rowData);
    });
  
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([columns.map((column) => column.title), ...dataToExport]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    XLSX.writeFile(wb, `${tabKey}_tabla.xlsx`);
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
        <div style={{ marginBottom: 16 }}> {/* Agrega un margen inferior al contenedor */}
          <Button onClick={() => downloadExcel("contacts")} type="primary" icon={<DownloadOutlined />}>
            Descargar Excel
          </Button>
        </div>

          <Table dataSource={contactDataContacts} columns={columnsContacts} loading={loadingContacts} />
        </TabPane>
        <TabPane
          tab={
            <Badge count={notificationCountMsgPro} offset={[5, 0]}>
              Interesados en Propiedades
            </Badge>
          }
          key="msgpro"
        >

          <div style={{ marginBottom: 16 }}> {/* Agrega un margen inferior al contenedor */}
              <Button onClick={() => downloadExcel("msgpro")} type="primary" icon={<DownloadOutlined />}>
                Descargar Excel
              </Button>
            </div>

          <Table dataSource={contactDataMsgPro} columns={columnsMsgPro} loading={loadingMsgPro} />
        </TabPane>
        <TabPane
          tab={
            <Badge count={notificationCountMsgVenta} offset={[5, 0]}>
              Mensajes de Venta
            </Badge>
          }
          key="msgventa"
        >

         <div style={{ marginBottom: 16 }}> {/* Agrega un margen inferior al contenedor */}
            <Button onClick={() => downloadExcel("msgventa")} type="primary" icon={<DownloadOutlined />}>
              Descargar Excel
            </Button>
          </div>

          <Table dataSource={contactDataMsgVenta} columns={columnsMsgVenta} loading={loadingMsgVenta} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ContactList;
