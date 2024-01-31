import { useState } from "react";
import {
  WhatsAppOutlined,
  MailOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { FloatButton, Modal, Input, Button, Select } from "antd";

import { app, firestore } from "../firebase/firebase"; // Asegúrate de que la ruta del archivo firebase sea correcta
import { doc, setDoc } from "firebase/firestore";

import "./ChatBubble.css"; // Asegúrate de importar tu archivo CSS

const { Option } = Select;

function ChatBubble() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [personName, setPersonName] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [whatsappCount, setWhatsappCount] = useState(0);
  const [emailCount, setEmailCount] = useState(0);

  const whatsappURL = "https://api.whatsapp.com/send?phone=4432057194";

  const openWhatsAppModal = () => {
    setIsModalVisible(true);
  };

  const closeWhatsAppModal = () => {
    setIsModalVisible(false);
  };

    const sendWhatsAppMessage = () => {
        // Combinar el mensaje con el URL de WhatsApp y la categoría
        const message = `*Categoría:* ${selectedCategory}\n*Nombre:* ${personName}\n*Mensaje:* ${whatsappMessage}`;
        const fullURL = `${whatsappURL}&text=${encodeURIComponent(message)}`;
        window.open(fullURL, '_blank');
        setIsModalVisible(false);
    };

    return (
        <>
            <FloatButton.Group
                trigger="hover"
                style={{
                    right: 25,
                }}
                icon={<CommentOutlined /> /* Color del icono */}
            >
                <a href={`mailto:sandarinmuebles@gmail.com`} target="_blank" rel="noopener noreferrer">
                    <FloatButton icon={<MailOutlined />} />
                </a>
                <FloatButton icon={<WhatsAppOutlined />} onClick={openWhatsAppModal} style={{ marginTop: '10px' }} />
            </FloatButton.Group>

            <Modal
                title="Enviar Mensaje de WhatsApp"
                visible={isModalVisible}
                onOk={sendWhatsAppMessage}
                onCancel={closeWhatsAppModal}
                footer={[
                    <Button key="cancel" onClick={closeWhatsAppModal}>
                        Cancelar
                    </Button>,
                    <Button key="send" type="primary" onClick={sendWhatsAppMessage}>
                        Enviar
                    </Button>,
                ]}
            >
                <div style={{ marginBottom: '16px' }}>
                    <label>Categoría:</label>
                    <Select
                        value={selectedCategory}
                        onChange={(value) => setSelectedCategory(value)}
                        placeholder="Selecciona una categoría"
                        style={{ width: '100%' }}
                    >
                        <Option value="Venta">Venta</Option>
                        <Option value="Compra">Compra</Option>
                        <Option value="Informacion">Información</Option>
                        {/* Agrega más categorías según tus necesidades */}
                    </Select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label>Nombre:</label>
                    <Input
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="Nombre"
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <label>Mensaje:</label>
                    <Input.TextArea
                        value={whatsappMessage}
                        onChange={(e) => setWhatsappMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                    />
                </div>
            </Modal>
        </>
    );
}

export default ChatBubble;
