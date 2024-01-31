import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Input, message, Spin, Button, Row, Col } from 'antd';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { LoadingOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AboutUsEditor = () => {
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchAboutUsData = async () => {
      try {
        const aboutUsDocRef = doc(firestore, 'aboutUsData', 'aboutUsInfo');
        const docSnap = await getDoc(aboutUsDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setParagraph(data.paragraph || '');
        } else {
          setError('El documento "aboutUsInfo" no existe en Firestore.');
        }
      } catch (error) {
        setError('Error al obtener los textos de "Sobre Nosotros" desde Firebase');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onSnapshot(doc(firestore, 'aboutUsData', 'aboutUsInfo'), (doc) => {
      const data = doc.data();
      setTitle(data.title);
      setParagraph(data.paragraph);
    });

    fetchAboutUsData();

    return () => unsubscribe();
  }, []);

  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
    setUnsavedChanges(true);
  }, []);

  const handleParagraphChange = useCallback((e) => {
    setParagraph(e.target.value);
    setUnsavedChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const aboutUsDocRef = doc(firestore, 'aboutUsData', 'aboutUsInfo');
      await setDoc(aboutUsDocRef, {
        title,
        paragraph,
        timestamp: new Date().toISOString()
      });
      setSavingStatus('success');
      message.success('Textos guardados exitosamente en Firebase');
      setUnsavedChanges(false);
    } catch (error) {
      setSavingStatus('error');
      message.error('Hubo un error al guardar los textos en Firebase');
    }
  }, [title, paragraph]);

  if (loading) {
    return <div style={{ textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <label htmlFor="title">Título:</label>
          <Input
            id="title"
            placeholder="Título"
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '10px' }}
            autoSize={{ minRows: 1, maxRows: 6 }}
          />
        </Col>
        <Col xs={24} lg={12}>
  <label htmlFor="paragraph">Párrafo:</label>
  <Input.TextArea
    id="paragraph"
    placeholder="Párrafo"
    value={paragraph}
    onChange={handleParagraphChange}
    style={{ marginBottom: '10px', width: '100%' }} // Establecer el ancho al 100%
    autoSize={{ minRows: 5, maxRows: 5 }}
  />
</Col>
      </Row>
      {unsavedChanges && (
        <Button type="primary" onClick={handleSave} style={{ marginBottom: '10px' }}>Guardar</Button>
      )}
      {savingStatus === 'success' && (
        <CheckCircleOutlined style={{ color: 'green', fontSize: '24px', marginRight: '10px' }} />
      )}
      {savingStatus === 'error' && (
        <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px', marginRight: '10px' }} />
      )}
      <Spin spinning={savingStatus === 'success'} indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
    </div>
  );
};

export default AboutUsEditor;
