// Importa useState y useEffect desde React
import React, { useState, useEffect } from 'react'
// Importa los componentes y funciones necesarios de Ant Design y Firebase
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore'
import { firestore } from '../firebase/firebase'
import { Input, Button, message, Spin, Typography } from 'antd'
import {
  SaveOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

// Extrae el componente Title de Typography
const { Title } = Typography

const FirebaseTextSaver = () => {
  // Define estados para los valores de los inputs de "Inmuebles vendidos" y "Clientes satisfechos"
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [soldProperties, setSoldProperties] = useState('')
  const [satisfiedClients, setSatisfiedClients] = useState('')
  // Define estados adicionales según el componente original
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savingStatus, setSavingStatus] = useState('')

  useEffect(() => {
    // Función para obtener el documento de Firebase al cargar el componente
    const fetchDocument = async () => {
      try {
        const docRef = doc(firestore, 'landingPageData', 'pageData')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setTitle(data.title || '')
          setSubtitle(data.subtitle || '')
          setSoldProperties(data.soldProperties || '') // Establece el estado para "Inmuebles vendidos"
          setSatisfiedClients(data.satisfiedClients || '') // Establece el estado para "Clientes satisfechos"
          setPageData(docSnap.id)
        }
      } catch (error) {
        console.error('Error al obtener el documento:', error)
      }
    }
    fetchDocument()
  }, [])

  // Función para guardar los datos en Firebase
  const handleSave = async () => {
    setLoading(true)

    try {
      if (pageData) {
        await setDoc(doc(firestore, 'landingPageData', 'pageData'), {
          title,
          subtitle,
          soldProperties, // Agrega el valor de "Inmuebles vendidos"
          satisfiedClients, // Agrega el valor de "Clientes satisfechos"
          timestamp: new Date().toISOString(),
        })
        setSavingStatus('success')
        message.success('Guardado exitosamente')
        console.log('Documento actualizado en Firebase con ID:', pageData)
      } else {
        const docRef = await addDoc(collection(firestore, 'landingPageData'), {
          title,
          subtitle,
          soldProperties, // Agrega el valor de "Inmuebles vendidos"
          satisfiedClients, // Agrega el valor de "Clientes satisfechos"
          timestamp: new Date().toISOString(),
        })
        setPageData(docRef.id)
        setSavingStatus('success')
        message.success('Guardado exitosamente')
        console.log('Documento creado en Firebase con ID:', docRef.id)
      }
    } catch (error) {
      setSavingStatus('error')
      message.error('Error al guardar el texto. Por favor, inténtalo de nuevo.')
      console.error('Error al guardar el texto:', error)
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <Title level={3} style={{ marginBottom: '20px' }}>
        Editor de Texto
      </Title>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor='title'>Título:</label>
        <Input.TextArea
          id='title'
          placeholder='Título'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 6 }}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor='subtitle'>Subtítulo:</label>
        <Input.TextArea
          id='subtitle'
          placeholder='Subtítulo'
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ marginBottom: '10px' }}
        />
      </div>
      {/* Agrega un input para "Inmuebles vendidos" */}
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor='soldProperties'>Inmuebles vendidos:</label>
        <Input
          id='soldProperties'
          placeholder='Cantidad de inmuebles vendidos'
          value={soldProperties}
          onChange={(e) => setSoldProperties(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>
      {/* Agrega un input para "Clientes satisfechos" */}
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <label htmlFor='satisfiedClients'>Clientes satisfechos:</label>
        <Input
          id='satisfiedClients'
          placeholder='Cantidad de clientes satisfechos'
          value={satisfiedClients}
          onChange={(e) => setSatisfiedClients(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <Button
        type='primary'
        onClick={handleSave}
        icon={loading ? <LoadingOutlined /> : <SaveOutlined />}
        disabled={loading || (!title && !subtitle)}
        style={{ width: '100%', marginBottom: '10px' }}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
      {savingStatus === 'success' && (
        <CheckCircleOutlined style={{ color: 'green', fontSize: '24px' }} />
      )}
      {savingStatus === 'error' && (
        <ExclamationCircleOutlined style={{ color: 'red', fontSize: '24px' }} />
      )}
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
      />
    </div>
  )
}

export default FirebaseTextSaver
