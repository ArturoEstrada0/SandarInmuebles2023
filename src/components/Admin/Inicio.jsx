import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Inicio() {
  const [totalPropiedades, setTotalPropiedades] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);

  const obtenerTotalPropiedades = async () => {
    const firestore = getFirestore();
    const propiedadesCollection = collection(firestore, 'propiedades');
    const propiedadesSnapshot = await getDocs(propiedadesCollection);
    const totalPropiedades = propiedadesSnapshot.size;
    setTotalPropiedades(totalPropiedades);
  };

  const obtenerTotalUsuarios = async () => {
    const firestore = getFirestore();
    const usuariosCollection = collection(firestore, 'usuarios');
    const usuariosSnapshot = await getDocs(usuariosCollection);
    const totalUsuarios = usuariosSnapshot.size;
    setTotalUsuarios(totalUsuarios);
  };

  const obtenerTotalContacts = async () => {
    const firestore = getFirestore();
    const contactsCollection = collection(firestore, 'contacts');
    const contactsSnapshot = await getDocs(contactsCollection);
    const totalContacts = contactsSnapshot.size;
    setTotalContacts(totalContacts);
  };

  useEffect(() => {
    obtenerTotalPropiedades();
    obtenerTotalUsuarios();
    obtenerTotalContacts();
  }, []);

  const data = [
    { name: 'Propiedades', valor: totalPropiedades },
    { name: 'Usuarios', valor: totalUsuarios },
    { name: 'Contacts', valor: totalContacts },
  ];

  return (
    <div>
      <h1>Inicio</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total de propiedades" value={totalPropiedades} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total de clientes" value={totalUsuarios} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total de contactos" value={totalContacts} />
          </Card>
        </Col>
      </Row>
      
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="valor" fill="#8884d8" />
      </BarChart>
    </div>
  )
}

export default Inicio
