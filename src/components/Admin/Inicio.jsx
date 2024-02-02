import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, List } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from 'recharts';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import {
  UserOutlined, HomeOutlined, TeamOutlined, LikeOutlined, EyeOutlined,
} from '@ant-design/icons';
import { firestore } from '../firebase/firebase';

function Inicio() {
  const [totalPropiedades, setTotalPropiedades] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadMasClickeada, setPropiedadMasClickeada] = useState('');
  const [propiedadConMasFavoritos, setPropiedadConMasFavoritos] = useState('');
  const [propiedadesSeleccionadas, setPropiedadesSeleccionadas] = useState(null);
  const [metodosContacto, setMetodosContacto] = useState([]);
  const [usuariosPorMes, setUsuariosPorMes] = useState([]);
  const [datosContador, setDatosContador] = useState([]);


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [propiedadesPorTipo, setPropiedadesPorTipo] = useState([]);
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    { mes: 1, usuarios: 10 },
    { mes: 2, usuarios: 15 },
    { mes: 3, usuarios: 20 },
    { mes: 4, usuarios: 12 },
    { mes: 5, usuarios: 25 },
    { mes: 6, usuarios: 18 },
    { mes: 7, usuarios: 30 },
    { mes: 8, usuarios: 22 },
    { mes: 9, usuarios: 27 },
    { mes: 10, usuarios: 15 },
    { mes: 11, usuarios: 28 },
    { mes: 12, usuarios: 35 },
  ]);

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
    const propiedadesCollection = collection(firestore, 'propiedades');
    const propiedadesSnapshot = await getDocs(propiedadesCollection);

    const propiedadesData = [];
    let maxClickCount = 0;
    let maxFavoriteCount = 0;
    let propiedadClickeada = '';
    let propiedadFavorita = '';

    propiedadesSnapshot.forEach((propiedad) => {
      const data = propiedad.data();
      propiedadesData.push(data);

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

  const obtenerCaracteristicasPorTipo = (tipo) => {
    switch (tipo) {
      case 'Casa':
        return { tipo: 'Casa', pausadas: 5, vendidas: 20, rentadas: 8 };
      case 'Departamento':
        return { tipo: 'Departamento', pausadas: 3, vendidas: 15, rentadas: 10 };
      case 'Terreno':
        return { tipo: 'Terreno', pausadas: 1, vendidas: 10, rentadas: 5 };
      default:
        return { tipo: 'Otros', pausadas: 7, vendidas: 11, rentadas: 10 };
    }
  };

  useEffect(() => {
    const fetchDatosContador = async () => {

        try {
          const docRefWhatsApp = doc(firestore, 'msgCount', 'whatsappCount');
          const docSnapWhatsApp = await getDoc(docRefWhatsApp);
          const whatsappCount = docSnapWhatsApp.exists() ? docSnapWhatsApp.data().count : 0;
  
          const docRefEmail = doc(firestore, 'msgCount', 'emailCount');
          const docSnapEmail = await getDoc(docRefEmail);
          const emailCount = docSnapEmail.exists() ? docSnapEmail.data().count : 0;
        const docRef = doc(firestore, 'msgCount', 'contactCount');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const contador = docSnap.data().count;
          setDatosContador([{ metodo: 'Formulario de Contacto', cantidad: contador },
          { metodo: 'WhatsApp', cantidad: whatsappCount },
          { metodo: 'Correo Electrónico', cantidad: emailCount }]);
          
        }
      } catch (error) {
        console.error('Error al obtener datos del contador:', error);
      }

    };

    fetchDatosContador();
  }, []);

  const obtenerPropiedadesPorTipo = async () => {
    const datosDePrueba = [
      { nombre: 'Propiedad1', tipo: 'casa' },
      { nombre: 'Propiedad2', tipo: 'departamento' },
      { nombre: 'Propiedad3', tipo: 'casa' },
      { nombre: 'Propiedad4', tipo: 'terreno' },
      { nombre: 'Propiedad5', tipo: 'departamento' },
    ];

    const propiedadesPorTipoData = {};
    datosDePrueba.forEach((propiedad) => {
      const tipo = propiedad.tipo || 'Otros';
      if (propiedadesPorTipoData[tipo]) {
        propiedadesPorTipoData[tipo]++;
      } else {
        propiedadesPorTipoData[tipo] = 1;
      }
    });

    setPropiedadesPorTipo(Object.entries(propiedadesPorTipoData));

    const obtenerTotalUsuarios = async () => {
      const firestore = getFirestore();
      const usuariosCollection = collection(firestore, 'usuarios');
      const usuariosSnapshot = await getDocs(usuariosCollection);

      const usuariosPorMesData = Array(12).fill(0);

      usuariosSnapshot.forEach((usuario) => {
        const fechaRegistro = usuario.data().fechaRegistro;
        const mesRegistro = parseInt(fechaRegistro.substring(5, 7), 10);
        usuariosPorMesData[mesRegistro - 1]++;
      });

      setUsuariosPorMes(usuariosPorMesData);
    };
  };

  useEffect(() => {
    obtenerTotalPropiedades();
    obtenerTotalUsuarios();
    obtenerTotalContacts();
    obtenerPropiedades();
    obtenerPropiedadesPorTipo();
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
        {dataGeneral.map((item, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic title={item.name} value={item.valor} prefix={index === 0 ? <HomeOutlined /> : (index === 1 ? <UserOutlined /> : <TeamOutlined />)} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: '20px' }}>
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

        <Col span={12}>
          <Card title="Propiedades y Estadísticas">
            <BarChart width={600} height={300} data={dataPropiedades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill="#52c41a" />
            </BarChart>

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

        <Col span={12}>
          <Card title="Distribución de Propiedades por Tipo">
            <PieChart width={400} height={300}>
              <Pie
                data={propiedadesPorTipo}
                dataKey={(entry) => entry[1]}
                nameKey={(entry) => entry[0]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                onClick={(data, index) => {
                  const tipoSeleccionado = data.payload.name;
                  const caracteristicas = obtenerCaracteristicasPorTipo(tipoSeleccionado);
                  setPropiedadesSeleccionadas(caracteristicas);
                }}
              >
                {propiedadesPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            {propiedadesSeleccionadas && (
              <div style={{ marginTop: '20px' }}>
                <h3>Características de {propiedadesSeleccionadas.tipo}</h3>
                <p>Pausadas: {propiedadesSeleccionadas.pausadas}</p>
                <p>Vendidas: {propiedadesSeleccionadas.vendidas}</p>
                <p>Rentadas: {propiedadesSeleccionadas.rentadas}</p>
              </div>
            )}
          </Card>
        </Col>

        <Col span={12}>
      <Card title="Contactos por Método">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosContador}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metodo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Col>

        <Col span={24}>
          <Card title="Usuarios Registrados">
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Inicio;
