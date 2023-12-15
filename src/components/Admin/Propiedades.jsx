import { useState } from "react";
import {
  Steps,
  Divider,
  Checkbox,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  InputNumber,
  Upload,
  Row,
  Col,
  notification,
  Select,
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;



function Propiedades() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [features] = useState([
    "Baño",
    "Habitaciones",
    "Cocina",
    "Patio",
    "Jardín",
    "Oficina/estudio",
    "Lavadero",
    "Sótano",
    "Ático",
    "Closets",
    "Terraza",
    "Cochera",
    "Numero de pisos",
  ]);

  const [featuresChecked, setFeaturesChecked] = useState({
    Baño: false,
    Habitaciones: false,
    Cocina: false,
    Patio: false,
    Jardín: false,
    "Oficina/estudio": false,
    Lavadero: false,
    Sótano: false,
    Ático: false,
    Closets: false,
    Terraza: false,
    Cochera: false,
    "numero de pisos": false,
  });
  const [featuresCount, setFeaturesCount] = useState({
    Baño: 0,
    Habitaciones: 0,
    Cocina: 0,
    Patio: 0,
    Jardín: 0,
    "Oficina/estudio": 0,
    Lavadero: 0,
    Sótano: 0,
    Ático: 0,
    Closets: 0,
    Terraza: 0,
    Cochera: 0,
    "Numero de pisos": 0,
  });

  const handleFeatureCheck = (feature) => {
    setFeaturesChecked((prevState) => ({
      ...prevState,
      [feature]: !prevState[feature],
    }));
  };

  // Manejador para el cambio de checkboxes
  const onFeaturesChange = (checkedValues) => {
    console.log("Características seleccionadas: ", checkedValues);
  };

  // Manejador para agregar propiedades
  const handleAdd = () => {
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  // Manejador para editar propiedades
  const handleEdit = (record) => {
    form.setFieldsValue({ ...record, imagen: [] });
    setIsModalVisible(true);
  };

  // Manejador para el envío del formulario
  const onFormSubmit = (values) => {
    notification.success({
      message: "Propiedad guardada",
      description: "La propiedad ha sido guardada con éxito.",
    });
    setIsModalVisible(false);
  };

  // Manejador para el cambio en la carga de archivos
  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Previsualización de imágenes
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  // Función para manejar la búsqueda
  const handleSearch = (value) => {
    console.log("Buscar:", value);
    // Implementa aquí tu lógica de búsqueda
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFeatureIncrement = (feature) => {
    setFeaturesCount((prevState) => {
      let incrementValue = feature === "Baño" ? 0.5 : 1;
      return { ...prevState, [feature]: prevState[feature] + incrementValue };
    });
  };

  const handleFeatureDecrement = (feature) => {
    setFeaturesCount((prevState) => {
      let decrementValue = feature === "Baño" ? 0.5 : 1;
      if (prevState[feature] - decrementValue >= 0) {
        return { ...prevState, [feature]: prevState[feature] - decrementValue };
      } else {
        return prevState; // Mantener el mismo estado si el valor resultante es negativo.
      }
    });
  };

  // Datos simulados
const dataSource = [
  {
    key: "1",
    nombre: "Propiedad 1",
    ubicacion: "Ubicación 1",
    precio: 1000,
    descripcion: "Descripción 1",
    caracteristicas: "Característica 1",
    // Asumiendo que tienes un campo para imágenes
    imagenes: [
      // URLs de imágenes, si las tienes
    ],
  },
  // Más propiedades aquí...
];

const columns = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    key: "nombre",
  },
  {
    title: "Ubicación",
    dataIndex: "ubicacion",
    key: "ubicacion",
  },
  {
    title: "Precio",
    dataIndex: "precio",
    key: "precio",
  },
  // Puedes añadir más columnas como descripción y características si lo necesitas
  {
    title: "Acciones",
    key: "acciones",
    render: (text, record) => (
      <Space>
        <Button type="primary" onClick={() => handleEdit(record)}>
          Editar
        </Button>
        <Button danger onClick={() => handleDelete(record.key)}>
          Eliminar
        </Button>
      </Space>
    ),
  },
];

  return (
    <div>
      <h1>Propiedades</h1>
      <Space direction="vertical">
        <Button type="primary" onClick={handleAdd}>
          Añadir propiedad
        </Button>
        <Input.Search
          placeholder="Buscar propiedad"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
      </Space>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Propiedad"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Steps current={currentStep} style={{ marginBottom: "20px" }}>
          <Step title="Información Básica" />
          <Step title="Descripción" />
          <Step title="Características" />
          <Step title="Fotos" />
        </Steps>
        <Form form={form} layout="vertical" onFinish={onFormSubmit}>
          {currentStep === 0 && (
            <>
              <Form.Item
                label="Nombre"
                name="nombre"
                rules={[
                  { required: true, message: "Por favor ingresa el nombre" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ubicación"
                name="ubicacion"
                rules={[
                  { required: true, message: "Por favor ingresa la ubicación" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Precio"
                name="precio"
                rules={[
                  { required: true, message: "Por favor ingresa el precio" },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Form.Item label="Descripción" name="descripcion">
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label="Características adicionales"
                name="caracteristicas"
              >
                <Input />
              </Form.Item>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Divider>Características</Divider>
              {features.map((feature, index) => (
                <Row
                  align="middle"
                  gutter={16}
                  key={index}
                  style={{ marginBottom: "10px" }}
                >
                  <Col span={8}>
                    <Checkbox
                      checked={featuresChecked[feature]}
                      onChange={() => handleFeatureCheck(feature)}
                    >
                      {feature}
                    </Checkbox>
                  </Col>
                  <Col span={4}>
                    {featuresChecked[feature] ? featuresCount[feature] : "-"}
                  </Col>
                  <Col span={6}>
                    <Button
                      disabled={!featuresChecked[feature]}
                      onClick={() => handleFeatureIncrement(feature)}
                    >
                      +
                    </Button>
                  </Col>
                  <Col span={6}>
                    <Button
                      disabled={
                        !featuresChecked[feature] || featuresCount[feature] <= 0
                      }
                      onClick={() => handleFeatureDecrement(feature)}
                    >
                      -
                    </Button>
                  </Col>
                </Row>
              ))}
            </>
          )}

          {currentStep === 3 && (
            <Form.Item label="Fotos" name="fotos">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleUploadChange}
                onPreview={onPreview}
                beforeUpload={() => false}
              >
                {fileList.length < 5 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Subir</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          )}

          <Divider />
          {currentStep > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={prevStep}>
              Anterior
            </Button>
          )}
          {currentStep < 3 && (
            <Button type="primary" onClick={nextStep}>
              Siguiente
            </Button>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default Propiedades;
