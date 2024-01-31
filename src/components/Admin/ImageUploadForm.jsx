import React, { useState } from 'react';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Button, Form, Upload, message, Col, Row } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Item } = Form;

function ImageUploadForm() {
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (info) => {
    const fileList = [...info.fileList];

    Promise.all(fileList.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file.originFileObj);
      });
    })).then(results => {
      setImages(fileList.map((file, index) => file.originFileObj));
      setImageUrls(results);
    });
  };

  const handleImageRemove = (index) => {
    const newImages = [...images];
    const newImageUrls = [...imageUrls];
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const handleSubmit = async () => {
    if (images.length > 0) {
      setLoading(true);
      const storage = getStorage();
      try {
        await Promise.all(images.map(async (image, index) => {
          const storageRef = ref(storage, `LandingPage/${image.name}`);
          await uploadBytes(storageRef, image);
        }));
        message.success("¡Imágenes subidas correctamente!");
      } catch (error) {
        console.error("Error al subir las imágenes:", error);
        message.error("Error al subir las imágenes. Por favor, inténtalo de nuevo.");
      }
      setLoading(false);
      setImages([]);
      setImageUrls([]);
    } else {
      message.warning("Por favor, selecciona al menos una imagen para subir.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{ marginBottom: '20px' }}>Subir Imágenes</h2>
      <Form layout="vertical">
        <Item>
          <Upload
            accept="image/*"
            multiple
            onChange={handleImageChange}
            showUploadList={false}
            beforeUpload={() => false}
          >
            <Button
              icon={<UploadOutlined />}
              loading={loading}
              disabled={loading}
            >
              Seleccionar Imágenes
            </Button>
          </Upload>
        </Item>
        <Item>
          <Row gutter={[16, 16]}>
            {imageUrls.map((url, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
                <div style={{ position: 'relative' }}>
                  <img src={url} alt={`Vista previa de la imagen ${index + 1}`} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    size="small"
                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                    onClick={() => handleImageRemove(index)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Item>
        <Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || images.length === 0}
          >
            Subir
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default ImageUploadForm;
