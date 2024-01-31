import React, { useEffect, useState } from "react";
import { Layout, Row, Col, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import CountUp from "react-countup";
import "./LandingPage.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function LandingPage() {
  const [animated, setAnimated] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    setAnimated(true);
  
    const storage = getStorage();
    const landingPageRef = ref(storage, "LandingPage");
  
    const fetchImages = async () => {
      try {
        const imagesList = await listAll(landingPageRef);
        const urls = await Promise.all(
          imagesList.items.map(async (imageRef) => {
            return getDownloadURL(imageRef);
          })
        );
        setImageURLs(urls);
  
        console.log("Todas las imágenes cargadas:", urls);
  
        // Start the interval after images are loaded
        const interval = setInterval(() => {
          setCurrentImage((prevImage) => (prevImage + 1) % urls.length);
        }, 4000);
  
        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error("Error al obtener las imágenes:", error);
      }
    };
  
    fetchImages();
  }, []);
  
    return (
      <Content style={{ backgroundColor: "#e2f4fe" }}>
        <div className="landing-page-container">
          <Row gutter={16}>
            <Col xs={{ span: 24 }} md={{ span: 9 }} style={{ height: "40vh" }}>
              <div
                className="landing-page-text"
                style={{ height: "100%", padding: "0 15px" }}
              >
                <Title
                  level={2}
                  style={{ fontSize: "2.2rem", fontFamily: "Geometos" }}
                >
                  Encuentra la Casa de Tus Sueños con Nosotros
                </Title>
                <Paragraph
                  style={{
                    fontSize: "1.2rem",
                    fontFamily: "Lato, sans-serif",
                  }}
                >
                  Encuentra la casa de tus sueños con nosotros. Te ofrecemos una
                  amplia variedad de opciones que se adaptarán a tus necesidades.
                  ¡Explora nuestros inmuebles ahora!
                </Paragraph>
                <Link to="/inmuebles">
                  <Button
                    size="large"
                    className="banner-button"
                    style={{
                      background: "black",
                      color: "white",
                      border: "1px solid white",
                      borderRadius: "4px",
                      padding: "30px 30px",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      fontFamily: "Geometos",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Ver Inmuebles
                  </Button>
                </Link>
                <Row gutter={16} style={{ marginTop: "20px" }}>
                  <Col
                    xs={{ span: 24 }}
                    md={{ span: 8 }}
                    className={`landing-page-stat ${
                      animated ? "animated" : ""
                    }`}
                  >
                    <div className="landing-page-stat-number">
                      <CountUp end={300} duration={5} />+
                    </div>
                    <div className="landing-page-stat-title">
                      Propiedades Disponibles
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    md={{ span: 8 }}
                    className={`landing-page-stat ${
                      animated ? "animated" : ""
                    }`}
                  >
                    <div className="landing-page-stat-number">
                      <CountUp end={1000} duration={5} />+
                    </div>
                    <div className="landing-page-stat-title">
                      Inmuebles Vendidos
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    md={{ span: 8 }}
                    className={`landing-page-stat ${
                      animated ? "animated" : ""
                    }`}
                  >
                    <div className="landing-page-stat-number">
                      <CountUp end={95} duration={5} />%
                    </div>
                    <div className="landing-page-stat-title">
                      Clientes Satisfechos
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={{ span: 0 }} md={{ span: 15 }} style={{ height: "60vh" }}>
              <div
                className="landing-page-image"
                style={{
                  height: "100%",
                  backgroundImage: `url(${
                    imageURLs.length > 0 ? imageURLs[currentImage] : ""
                  })`,
                }}
              ></div>
            </Col>
          </Row>
        </div>
      </Content>
    );
  }

  export default LandingPage;
