import { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Button,
  Typography,
  Form,
  Input,
  message,
  Card,
} from "antd";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import backgroundImage1 from "../../assets/img/houses/banner.jpg";
import backgroundImage2 from "../../assets/img/houses/banner-2.jpg";
import backgroundImage3 from "../../assets/img/houses/banner-3.jpg";
import CountUp from "react-countup";
import ImageCarousel from "./ImageCarousel";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

function LandingPage() {
  const [animated, setAnimated] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);
  const images = [backgroundImage1, backgroundImage2, backgroundImage3];

  useEffect(() => {
    setAnimated(true);

    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage % images.length) + 1);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (

    
    <Content style={{backgroundColor: "#e2f4fe"}}>
      <div
        className="landing-page-container"
        style={{ height: "80vh", marginLeft: "30px" }}
      >
        <Row gutter={16} style={{ height: "100%" }}>
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
                style={{ fontSize: "1.2rem", fontFamily: "Lato, sans-serif" }}
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
                  className={`landing-page-stat ${animated ? "animated" : ""}`}
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
                  className={`landing-page-stat ${animated ? "animated" : ""}`}
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
                  className={`landing-page-stat ${animated ? "animated" : ""}`}
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
                backgroundImage: `url(${images[currentImage - 1]})`,
              }}
            ></div>
            {/* <Col>
              <ImageCarousel />
            </Col> */}
          </Col>
        </Row>
      </div>
    </Content>
  );
}

export default LandingPage;
