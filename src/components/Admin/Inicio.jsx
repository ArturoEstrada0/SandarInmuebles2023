import { Card, Col, Row, Statistic, List } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {
  UserOutlined, HomeOutlined, TeamOutlined, LikeOutlined, EyeOutlined,
} from '@ant-design/icons';

function Inicio() {
  const [totalPropiedades, setTotalPropiedades] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadMasClickeada, setPropiedadMasClickeada] = useState('');
  const [propiedadConMasFavoritos, setPropiedadConMasFavoritos] = useState('');

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

  const obtenerPropiedades = async () => {
    const firestore = getFirestore();
    const propiedadesCollection = collection(firestore, 'propiedades'); // Reemplaza 'nombre_de_tu_coleccion' con el nombre real de tu colección
    const propiedadesSnapshot = await getDocs(propiedadesCollection);

    const propiedadesData = [];
    let maxClickCount = 0;
    let maxFavoriteCount = 0;
    let propiedadClickeada = '';
    let propiedadFavorita = '';

    propiedadesSnapshot.forEach((propiedad) => {
      const data = propiedad.data();
      propiedadesData.push(data);

      // Actualizar el conteo máximo de clics y favoritos
      if (data.clickCount > maxClickCount) {
        maxClickCount = data.clickCount;
        setClickCount(maxClickCount);
        propiedadClickeada = data.nombre;
      }

      if (data.favoriteCount > maxFavoriteCount) {
        maxFavoriteCount = data.favoriteCount;
        setFavoriteCount(maxFavoriteCount);
        propiedadFavorita = data.nombre;
      }
    });

    setPropiedades(propiedadesData);
    setPropiedadMasClickeada(propiedadClickeada);
    setPropiedadConMasFavoritos(propiedadFavorita);
  };

  useEffect(() => {
    obtenerTotalPropiedades();
    obtenerTotalUsuarios();
    obtenerTotalContacts();
    obtenerPropiedades();
  }, []);

  const dataGeneral = [
    { name: 'Propiedades', valor: totalPropiedades },
    { name: 'Usuarios', valor: totalUsuarios },
    { name: 'Contactos', valor: totalContacts },
  ];

  const dataPropiedades = [
    { name: 'Vistas', valor: clickCount },
    { name: 'Favoritos', valor: favoriteCount },
  ];

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Inicio</h1>

      <Row gutter={16}>
        {/* Estadísticas generales */}
        {dataGeneral.map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic title={item.name} value={item.valor} prefix={index === 0 ? <HomeOutlined /> : (index === 1 ? <UserOutlined /> : <TeamOutlined />)} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
        {/* Gráfico de estadísticas generales */}
        <Col span={12}>
          <Card title="Estadísticas Generales">
            <BarChart width={600} height={300} data={dataGeneral}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#1890ff" />
            </BarChart>
          </Card>
        </Col>

        {/* Estadísticas de propiedades */}
        <Col span={12}>
          <Card title="Propiedades y Estadísticas">
            {/* Gráfico de clics y favoritos */}
            <BarChart width={600} height={300} data={dataPropiedades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#52c41a" />
            </BarChart>

            {/* Lista de propiedades */}
            <List
              dataSource={propiedades}
              renderItem={(item) => (
                <List.Item>
                  <strong>{item.nombre}:</strong>
                  <span>
                    <EyeOutlined /> Vistas: {item.clickCount}, <LikeOutlined /> Favoritos: {item.favoriteCount}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Inicio;