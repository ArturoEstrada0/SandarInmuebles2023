import { useState } from 'react';
import { WhatsAppOutlined, MailOutlined, CommentOutlined } from '@ant-design/icons';
import { FloatButton, Modal, Input, Button, Select } from 'antd';
import "./ChatBubble.css" // Asegúrate de importar tu archivo CSS

const { Option } = Select;

function ChatBubble() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [personName, setPersonName] = useState('');
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const whatsappURL = 'https://api.whatsapp.com/send?phone=4434395522';

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
                <a href={`mailto:arturoestrada301@gmail.com`} target="_blank" rel="noopener noreferrer">
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
                        <Option value="Alquiler">Alquiler</Option>
                        <Option value="Consultas">Consultas</Option>
                        <Option value="Mantenimiento">Mantenimiento</Option>
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
