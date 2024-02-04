import { Table } from 'antd';
import FichaTecnica from './FichaTecnica';

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
      <h1>Ficha Tecnica</h1>

      <FichaTecnica />
    </div>
  );
}

export default Contratos;