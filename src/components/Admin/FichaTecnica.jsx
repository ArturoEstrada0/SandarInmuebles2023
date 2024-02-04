import React, { useState, useEffect, useRef } from "react";
import { firestore } from "../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import "./FichaTecnica.css";
import Logo from "../../assets/img/sandarPositivo.png";
import QRCode from "qrcode.react";
import { jsPDF } from "jspdf";
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

const FichaTecnica = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);
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
          "fn18mVGEjeFzvAuDrxuL"
        );
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
  }, []);

  const generatePdf = () => {
    if (!propertyData) return;

    const doc = new jsPDF({
      orientation: "landscape",
    });

    const fichaTecnicaContent = fichaTecnicaRef.current;

    doc.html(fichaTecnicaContent, {
      callback: () => {
        doc.save("ficha-tecnica.pdf");
        setPdfGenerated(true);
      },
    });
  };

  useEffect(() => {
    if (pdfGenerated) {
      console.log("PDF generado correctamente");
    }
  }, [pdfGenerated]);

  return (
    <div className="ficha-tecnica-container">
      {propertyData && (
        <div className="ficha-tecnica" ref={fichaTecnicaRef}>
          <div className="ficha-tecnica-header">
            <img src={Logo} alt="Logo" className="ficha-tecnica-logo" />
            <div className="ficha-tecnica-property-title">
              <h1>{propertyData.nombre}</h1>
              <p className="ficha-tecnica-property-price">
                ${propertyData.precio.toLocaleString()} MXN
              </p>
            </div>
          </div>
          <div className="ficha-tecnica-details">
            <h2>Detalles de la propiedad</h2>
            <div className="ficha-tecnica-property-details">
              <div className="ficha-tecnica-property-detail-card">
                <div className="ficha-tecnica-detail-icon">
                  <FontAwesomeIcon icon={faBed} />
                </div>
                <p>
                  <strong>Habitaciones:</strong> {propertyData.habitaciones}
                </p>
              </div>
              <div className="ficha-tecnica-property-detail-card">
                <div className="ficha-tecnica-detail-icon">
                  <FontAwesomeIcon icon={faBath} />
                </div>
                <p>
                  <strong>Baños:</strong> {propertyData.baños}
                </p>
              </div>
              <div className="ficha-tecnica-property-detail-card">
                <div className="ficha-tecnica-detail-icon">
                  <FontAwesomeIcon icon={faMap} />
                </div>
                <p>
                  <strong>Terreno:</strong> {propertyData.tamanioPropiedad}
                </p>
              </div>
              <div className="ficha-tecnica-property-detail-card">
                <div className="ficha-tecnica-detail-icon">
                  <FontAwesomeIcon icon={faRulerCombined} />
                </div>
                <p>
                  <strong>Metros Construidos:</strong>{" "}
                  {propertyData.tamanioPropiedad}
                </p>
              </div>
            </div>
          </div>
          <h2>Caracteristicas</h2>
          <div className="ficha-tecnica-property-cards">
            {Object.entries(propertyData.cardsActivadas).map(
              ([key, value]) =>
                value && (
                  <div className="ficha-tecnica-property-card" key={key}>
                    <div className="ficha-tecnica-icon-text-wrapper">
                      <FontAwesomeIcon icon={getIcon(key)} />
                      <span className="ficha-tecnica-card-text">{key}</span>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="ficha-tecnica-description">
            <h2>Descripción</h2>
            <div className="ficha-tecnica-description-info">
              <p>{propertyData.descripcion}</p>
            </div>
          </div>
          <div className="ficha-tecnica-photos">
            <h2>Fotos</h2>
            <div className="ficha-tecnica-photos-info">
              <div className="ficha-tecnica-main-photo">
                <img src={propertyData.fotos[0]} alt="Main" />
              </div>
              <div className="ficha-tecnica-small-photos">
                {propertyData.fotos.slice(1, 11).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo-${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="ficha-tecnica-footer">
            <div className="contact-info">
              <h2>Datos de contacto:</h2>
              <p>Teléfono: 443-205-7194</p>
              <p>Correo electrónico: sandarinmuebles@gmail.com</p>
            </div>
            <QRCode
              value={`https://sandar-inmuebles.web.app/property/fn18mVGEjeFzvAuDrxuL`}
            />
          </div>
          <button onClick={generatePdf}>Generar PDF</button>
        </div>
      )}
    </div>
  );
};

export default FichaTecnica;
