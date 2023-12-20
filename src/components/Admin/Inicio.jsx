import { useEffect, useState } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { Card, Col, Row, Statistic } from 'antd'
import { Line } from '@ant-design/charts'
import { firestore } from '../firebase/firebase'

function Inicio() {
  const [data, setData] = useState([])

  useEffect(() => {
    const q = query(collection(firestore, 'hi'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newData = []
      snapshot.forEach((doc) => {
        newData.push(doc.data())
      })
      setData(newData)
    })

    // Limpiar la suscripción al desmontar
    return () => unsubscribe()
  }, [])

  const config = {
    data,
    height: 400,
    xField: 'mes',
    yField: 'valor',
    point: {
      size: 5,
      shape: 'diamond',
    },
  }

  return (
    <div>
      <h1>Inicio</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title='Total de propiedades' value={1128} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title='Total de clientes' value={11289} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title='Total de contratos' value={112893} />
          </Card>
        </Col>
      </Row>
      <Line {...config} />
    </div>
  )
}

export default Inicio
