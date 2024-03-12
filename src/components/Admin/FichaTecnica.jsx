import { useState, useEffect, useRef } from "react";
import { firestore } from "../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import "./FichaTecnica.css";
import Logo from "../../assets/img/sandarPositivo.png";
import LogoQR from "../../assets/img/sandarQR.png";
import QRCode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBed,
  faBath,
  faCar,
  faSwimmingPool,
  faSnowflake,
  faBell,
  faCouch,
  faBox,
  faVideo,
  faUtensils,
  faDumbbell,
  faTree,
  faPaw,
  faGlassCheers,
  faVolumeUp,
  faHouseFlag,
  faTshirt,
  faCity,
  faMountain,
  faWater,
  faBinoculars,
  faChess,
  faHome,
  faFire,
  faToilet,
  faRulerCombined,
  faMap,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faBed,
  faBath,
  faCar,
  faSwimmingPool,
  faSnowflake,
  faBell,
  faCouch,
  faBox,
  faVideo,
  faUtensils,
  faDumbbell,
  faTree,
  faPaw,
  faGlassCheers,
  faVolumeUp,
  faHouseFlag,
  faTshirt,
  faCity,
  faMountain,
  faWater,
  faBinoculars,
  faChess,
  faHome,
  faFire,
  faToilet,
  faRulerCombined,
  faMap
);

const FichaTecnica = ({ propertyId }) => {
  const [propertyData, setPropertyData] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const fichaTecnicaRef = useRef(null);

  const getIcon = (key) => {
    const iconMapping = {
      Habitaciones: faBed,
      Baño: faBath,
      Cochera: faCar,
      Piscina: faSwimmingPool,
      "Aire acondicionado": faSnowflake,
      Alarma: faBell,
      Amueblado: faCouch,
      Estacionamiento: faCar,
      "Medio Baño": faToilet,
      Bodega: faBox,
      "Metros Construidos": faRulerCombined,
      Terreno: faMap,
      "Cámaras de seguridad": faVideo,
      Cocina: faUtensils,
      Gimnasio: faDumbbell,
      Jardín: faTree,
      "Mascotas permitidas": faPaw,
      "Salón de eventos": faGlassCheers,
      "Sistema de sonido": faVolumeUp,
      Terraza: faHouseFlag,
      Vestidor: faTshirt,
      "Vista a la ciudad": faCity,
      "Vista a la montaña": faMountain,
      "Vista al mar": faWater,
      "Vista panorámica": faBinoculars,
      "Área de juegos": faChess,
      Ático: faHome,
      Chimenea: faFire,
    };
    return iconMapping[key] || null;
  };

  useEffect(() => {
    const getPropertyData = async () => {
      try {
        const propertyRef = doc(
          collection(firestore, "propiedades"),
          propertyId
        ); // Usa la propiedad propertyId aquí
        const docSnapshot = await getDoc(propertyRef);

        if (docSnapshot.exists()) {
          setPropertyData(docSnapshot.data());
        } else {
          console.log("No se encontraron datos de la propiedad");
        }
      } catch (error) {
        console.error("Error obteniendo datos de Firebase:", error);
      }
    };

    getPropertyData();
  }, [propertyId]); // Añade propertyId como dependencia

  useEffect(() => {
    if (!propertyData) return;

    const images = document.querySelectorAll(".ficha-tecnica-photos-info img");
    const promises = Array.from(images).map(
      (image) =>
        new Promise((resolve) => {
          if (image.complete) {
            resolve();
          } else {
            image.addEventListener("load", () => resolve());
            image.addEventListener("error", () => resolve());
          }
        })
    );

    Promise.all(promises).then(() => setImagesLoaded(true));
  }, [propertyData]);

  // Luego, en tu código para generar el PDF:

  const generatePDF = () => {
    if (!imagesLoaded) return;

    // Guarda el elemento padre original
    const originalParent = fichaTecnicaRef.current.parentElement;

    // Crea un nuevo div al final del body
    const printContainer = document.createElement("div");
    document.body.appendChild(printContainer);

    // Mueve el contenido a imprimir al nuevo div
    printContainer.appendChild(fichaTecnicaRef.current);

    // Oculta todo el contenido de la página
    document.body.style.visibility = "hidden";

    // Muestra solo el contenido del componente que deseas imprimir
    fichaTecnicaRef.current.style.visibility = "visible";

    // Oculta el footer
    const footer = document.getElementById("footer");
    if (footer) {
      footer.style.visibility = "hidden";
    }

    // Imprime el contenido de la página
    window.print();

    // Restaura la visibilidad del contenido de la página
    document.body.style.visibility = "visible";

    // Muestra el footer
    if (footer) {
      footer.style.visibility = "visible";
    }

    // Mueve el contenido a imprimir de vuelta a su lugar original
    originalParent.appendChild(fichaTecnicaRef.current);

    // Elimina el div que se creó para imprimir
    document.body.removeChild(printContainer);
  };

  return (
    <div className="ficha-tecnica-container">
      {propertyData && (
        <div className="ficha-tecnica" ref={fichaTecnicaRef}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="download-button"
              onClick={generatePDF}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faDownload}
                style={{ fontSize: "30px", color: "white" }}
              />{" "}
              Descargar ficha técnica
            </button>
          </div>
          <div
            className="ficha-tecnica-header"
            style={{ position: "relative" }}
          >
            <img src={Logo} alt="Logo" className="ficha-tecnica-logo" />
            <div className="ficha-tecnica-property-title">
              <h1 style={{ fontSize: "32px" }}>{propertyData.nombre}</h1>
              <p
                className="ficha-tecnica-property-price"
                style={{
                  fontSize: "36px", // Aumenta el tamaño de la fuente
                  color: "#fff", // Cambia el color del texto
                  padding: "5px", // Agrega un poco de espacio alrededor del texto
                }}
              >
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(propertyData.precio)}{" "}
                MXN
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "blue",
                padding: "5px 10px",
                borderRadius: "5px",
                textTransform: "uppercase",
              }}
            >
              <strong>EN {propertyData.condicion}</strong>
            </div>
          </div>
          <div className="ficha-tecnica-details">
            <h2>Detalles de la propiedad</h2>
            <div className="ficha-tecnica-property-details">
              <div
                className="ficha-tecnica-property-detail-card"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  className="ficha-tecnica-detail-icon"
                  style={{ marginRight: "10px" }}
                >
                  <FontAwesomeIcon icon={faBed} />
                </div>
                <p style={{ fontSize: "18px" }}>
                  <strong>Habitaciones:</strong> {propertyData.habitaciones}
                </p>
              </div>
              <div
                className="ficha-tecnica-property-detail-card"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  className="ficha-tecnica-detail-icon"
                  style={{ marginRight: "10px" }}
                >
                  <FontAwesomeIcon icon={faBath} />
                </div>
                <p style={{ fontSize: "18px" }}>
                  <strong>Baños:</strong> {propertyData.baños}
                </p>
              </div>
              <div
                className="ficha-tecnica-property-detail-card"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  className="ficha-tecnica-detail-icon"
                  style={{ marginRight: "10px" }}
                >
                  <FontAwesomeIcon icon={faMap} />
                </div>
                <p style={{ fontSize: "18px" }}>
                  <strong>Terreno:</strong> {propertyData.tamanioPropiedad}
                </p>
              </div>
              <div
                className="ficha-tecnica-property-detail-card"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  className="ficha-tecnica-detail-icon"
                  style={{ marginRight: "10px" }}
                >
                  <FontAwesomeIcon icon={faRulerCombined} />
                </div>
                <p style={{ fontSize: "18px" }}>
                  <strong>Metros Construidos:</strong>{" "}
                  {propertyData.metrosConstruidos}
                </p>
              </div>
            </div>
          </div>
          <h2>Caracteristicas</h2>
          <div className="ficha-tecnica-property-cards">
            {Object.entries(propertyData.cardsActivadas)
              .filter(
                ([key]) =>
                  ![
                    "Habitaciones",
                    "Baño",
                    "Terreno",
                    "Metros Construidos",
                  ].includes(key)
              )
              .map(
                ([key, value]) =>
                  value && (
                    <div className="ficha-tecnica-property-card" key={key}>
                      <div className="ficha-tecnica-icon-text-wrapper">
                        <FontAwesomeIcon icon={getIcon(key)} />
                        <span className="ficha-tecnica-card-text">
                          {key}
                          {key === "Medio Baño" &&
                            `: ${propertyData.medioBaño}`}
                          {key === "Estacionamiento" &&
                            `: ${propertyData.estacionamiento}`}
                        </span>
                      </div>
                    </div>
                  )
              )}
          </div>
          <div
            className="ficha-tecnica-description"
            style={{ marginBottom: "30px" }}
          >
            <h2>Descripción</h2>
            <div className="ficha-tecnica-description-info">
              <p>{propertyData.descripcion}</p>
            </div>
          </div>
          <div className="ficha-tecnica-photos" style={{ marginTop: "30px" }}>
            <h2>Fotos</h2>
            <div className="ficha-tecnica-photos-info">
              <div
                className="ficha-tecnica-main-photo"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={propertyData.fotos[0]} alt="Main" />
              </div>
              <div className="ficha-tecnica-small-photos">
                {propertyData.fotos.slice(1, 11).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo-${index + 1}`}
                    onLoad={() => setImagesLoaded(true)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div
            className="ficha-tecnica-footer"
            style={{ position: "relative" }}
          >
            <div className="contact-info">
              <h2>Datos de contacto:</h2>
              <p>
                Teléfono | Whatsapp:{" "}
                <a
                  href="https://wa.me/4432057194"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  443-205-7194
                </a>
              </p>
              <p>
                Correo electrónico:{" "}
                <a
                  href={`mailto:sandarinmuebles@gmail.com`}
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  sandarinmuebles@gmail.com
                </a>
              </p>
            </div>
            <div className="qr-code-container">
              <QRCode
                value={`https://sandar-inmuebles.web.app/property/${propertyId}`}
                size={128}
                imageSettings={{
                  src: LogoQR,
                  height: 34,
                  width: 34,
                  excavate: true,
                }}
                style={{
                  padding: "10px",
                  backgroundColor: "white",
                  borderRadius: "10px",
                }}
              />

              {/* Enlace "Ver Propiedad" */}
              <p
                style={{
                  textAlign: "center",
                  color: "#007bff",
                  textDecoration: "none",
                }}
              >
                <a href="https://sandar-inmuebles.web.app/property/2qfo9XJjAkNw7MYfNgNK">
                  Ver Propiedad
                </a>
              </p>
            </div>

            {/* Enlace en el centro y abajo */}
            <div
              className="center-bottom-link"
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                width: "100%",
              }}
            >
              <a
                href="https://sandarinmuebles.com"
                style={{ color: "#007bff", textDecoration: "none" }}
              >
                SandarInmuebles.com
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaTecnica;
