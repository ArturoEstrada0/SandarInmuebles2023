import { Card, Col, Row, Statistic } from 'antd';
import { Line } from '@ant-design/charts';

function Inicio() {
  const data = [
    { mes: 'Enero', valor: 100 },
    { mes: 'Febrero', valor: 120 },
    { mes: 'Marzo', valor: 138 },
    // Más datos aquí...
  ];

  const config = {
    data,
    height: 400,
    xField: 'mes',
    yField: 'valor',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <div>
      <h1>Inicio</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total de propiedades" value={1128} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total de clientes" value={11289} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Total de contratos" value={112893} />
          </Card>
        </Col>
      </Row>
      <Line {...config} />
    </div>
  );
}

export default Inicio;
