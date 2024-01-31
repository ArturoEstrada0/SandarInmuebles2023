import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { LoadingOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const ContactEditor = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactDocRef = doc(firestore, 'contactData', 'contactInfo');
        const docSnap = await getDoc(contactDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhoneNumber(data.phoneNumber || '');
          setEmail(data.email || '');
          setTitle(data.title || '');
          setParagraph(data.paragraph || '');
        } else {
          setError('El documento "contactInfo" no existe en Firestore.');
        }
      } catch (error) {
        setError('Error al obtener la información de contacto desde Firebase');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  const handleSave = async () => {
    try {
      const contactDocRef = doc(firestore, 'contactData', 'contactInfo');
      await setDoc(contactDocRef, {
        phoneNumber,
        email,
        title,
        paragraph,
        timestamp: new Date().toISOString()
      });
      setSavingStatus('success');
      message.success('Información de contacto guardada exitosamente en Firebase');
    } catch (error) {
      setSavingStatus('error');
      message.error('Hubo un error al guardar la información de contacto en Firebase');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor="phoneNumber">Número de Teléfono:</label>
        <Input
          id="phoneNumber"
          placeholder="Número de Teléfono"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor="email">Correo Electrónico:</label>
        <Input
          id="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={handleEmailChange}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor="title">Título:</label>
        <Input
          id="title"
          placeholder="Título"
          value={title}
          onChange={handleTitleChange}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor="paragraph">Párrafo:</label>
        <Input.TextArea
          id="paragraph"
          placeholder="Párrafo"
          value={paragraph}
          onChange={handleParagraphChange}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <Button type="primary" onClick={handleSave} style={{ marginBottom: '10px' }}>Guardar</Button>
      {savingStatus === 'success' && (
        <CheckCircleOutlined style={{ color: 'green', fontSize: '24px', marginRight: '10px' }} />
      )}
      {savingStatus === 'error' && (
        <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px', marginRight: '10px' }} />
      )}
      <LoadingOutlined style={{ fontSize: '24px', display: savingStatus === 'saving' ? 'block' : 'none' }} />
    </div>
  );
};

export default ContactEditor;
