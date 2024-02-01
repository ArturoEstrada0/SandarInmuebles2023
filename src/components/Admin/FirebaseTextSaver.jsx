import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { Input, Button, message, Spin, Typography } from 'antd';
import { SaveOutlined, LoadingOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const FirebaseTextSaver = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const docRef = doc(firestore, 'landingPageData', 'pageData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setSubtitle(data.subtitle || '');
          setPageData(docSnap.id);
        }
      } catch (error) {
        console.error('Error al obtener el documento:', error);
      }
    };
    fetchDocument();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      if (pageData) {
        await setDoc(doc(firestore, 'landingPageData', 'pageData'), {
          title,
          subtitle,
          timestamp: new Date().toISOString()
        });
        setSavingStatus('success');
        message.success('Guardado exitosamente');
        console.log('Documento actualizado en Firebase con ID:', pageData);
      } else {
        const docRef = await addDoc(collection(firestore, 'landingPageData'), {
          title,
          subtitle,
          timestamp: new Date().toISOString()
        });
        setPageData(docRef.id);
        setSavingStatus('success');
        message.success('Guardado exitosamente');
        console.log('Documento creado en Firebase con ID:', docRef.id);
      }
    } catch (error) {
      setSavingStatus('error');
      message.error('Error al guardar el texto. Por favor, inténtalo de nuevo.');
      console.error('Error al guardar el texto:', error);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <Title level={3} style={{ marginBottom: '20px' }}>Editor de Texto</Title>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor="title">Título:</label>
        <Input.TextArea
          id="title"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 6 }}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor="subtitle">Subtítulo:</label>
        <Input.TextArea
          id="subtitle"
          placeholder="Subtítulo"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <Button
        type="primary"
        onClick={handleSave}
        icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
        disabled={loading || (!title && !subtitle)}
        style={{ width: '100%', marginBottom: '10px' }}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
      {savingStatus === 'success' && (
        <CheckCircleOutlined style={{ color: 'green', fontSize: '24px' }} />
      )}
      {savingStatus === 'error' && (
        <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px' }} />
      )}
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
    </div>
  );
};

export default FirebaseTextSaver;
