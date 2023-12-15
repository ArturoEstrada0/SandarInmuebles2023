import { Table } from 'antd';

const dataSource = [
  {
    key: '1',
    cliente: 'Juan',
    propiedad: 'Propiedad 1',
    inicioContrato: '01/01/2023',
    finContrato: '31/12/2023',
  },
  // Más contratos aquí...
];

const columns = [
  {
    title: 'Cliente',
    dataIndex: 'cliente',
    key: 'cliente',
  },
  {
    title: 'Propiedad',
    dataIndex: 'propiedad',
    key: 'propiedad',
  },
  {
    title: 'Inicio del contrato',
    dataIndex: 'inicioContrato',
    key: 'inicioContrato',
  },
  {
    title: 'Fin del contrato',
    dataIndex: 'finContrato',
    key: 'finContrato',
  },
];

function Contratos() {
  return (
    <div>
      <h1>Contratos</h1>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default Contratos;