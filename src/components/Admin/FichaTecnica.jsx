import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import "./FichaTecnica.css";
import Logo from "../../assets/img/sandarPositivo.png";
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
  faLandmark,
  faSquare,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiIcono from "../../assets/img/m2.png";

const FichaTecnica = () => {
  const [propertyData, setPropertyData] = useState(null);

  // Función para obtener el icono según el nombre de la característica
  const getIcon = (key) => {
    const iconMapping = {
      Habitaciones: <FontAwesomeIcon icon={faBed} />,
      Baño: <FontAwesomeIcon icon={faBath} />,
      Cochera: <FontAwesomeIcon icon={faCar} />,
      Piscina: <FontAwesomeIcon icon={faSwimmingPool} />,
      "Aire acondicionado": <FontAwesomeIcon icon={faSnowflake} />,
      Alarma: <FontAwesomeIcon icon={faBell} />,
      Amueblado: <FontAwesomeIcon icon={faCouch} />,
      Estacionamiento: <FontAwesomeIcon icon={faCar} />,
      "Medio Baño": <FontAwesomeIcon icon={faToilet} />,
      Bodega: <FontAwesomeIcon icon={faBox} />,
      "Metros Construidos": <FontAwesomeIcon icon={faRulerCombined} />,
      Terreno: <FontAwesomeIcon icon={faMap} />,
      "Cámaras de seguridad": <FontAwesomeIcon icon={faVideo} />,
      Cocina: <FontAwesomeIcon icon={faUtensils} />,
      Gimnasio: <FontAwesomeIcon icon={faDumbbell} />,
      Jardín: <FontAwesomeIcon icon={faTree} />,
      "Mascotas permitidas": <FontAwesomeIcon icon={faPaw} />,
      "Salón de eventos": <FontAwesomeIcon icon={faGlassCheers} />,
      "Sistema de sonido": <FontAwesomeIcon icon={faVolumeUp} />,
      Terraza: <FontAwesomeIcon icon={faHouseFlag} />,
      Vestidor: <FontAwesomeIcon icon={faTshirt} />,
      "Vista a la ciudad": <FontAwesomeIcon icon={faCity} />,
      "Vista a la montaña": <FontAwesomeIcon icon={faMountain} />,
      "Vista al mar": <FontAwesomeIcon icon={faWater} />,
      "Vista panorámica": <FontAwesomeIcon icon={faBinoculars} />,
      "Área de juegos": <FontAwesomeIcon icon={faChess} />,
      Ático: <FontAwesomeIcon icon={faHome} />,
      Chimenea: <FontAwesomeIcon icon={faFire} />,
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

  return (
    <div className="ficha-tecnica-container">
      {propertyData && (
        <div className="ficha-tecnica">
          <div className="ficha-tecnica-header">
            <img src={Logo} alt="Logo" className="ficha-tecnica-logo" />
            <div className="ficha-tecnica-property-title">
              <h1>{propertyData.nombre}</h1>
              <p className="ficha-tecnica-property-price">${propertyData.precio.toLocaleString()} MXN</p>
            </div>
          </div>
          {propertyData.cardsActivadas && (
            <div className="ficha-tecnica-details">
              <h2>Detalles de la propiedad</h2>
              <div className="ficha-tecnica-property-details">
                <div className="ficha-tecnica-property-detail-card">
                  <div className="ficha-tecnica-detail-icon">{getIcon("Habitaciones")}</div>
                  <p>
                    <strong>Habitaciones:</strong> {propertyData.habitaciones}
                  </p>
                </div>
                <div className="ficha-tecnica-property-detail-card">
                  <div className="ficha-tecnica-detail-icon">{getIcon("Baño")}</div>
                  <p>
                    <strong>Baños:</strong> {propertyData.baños}
                  </p>
                </div>
                <div className="ficha-tecnica-property-detail-card">
                  <div className="ficha-tecnica-detail-icon">{getIcon("Terreno")}</div>
                  <p>
                    <strong>Terreno:</strong> {propertyData.tamanioPropiedad}
                  </p>
                </div>
                <div className="ficha-tecnica-property-detail-card">
                  <div className="ficha-tecnica-detail-icon">
                    {getIcon("Metros Construidos")}
                  </div>
                  <p>
                    <strong>Metros Construidos:</strong>{" "}
                    {propertyData.tamanioPropiedad}
                  </p>
                </div>
              </div>
              {/* Agregar más detalles según sea necesario */}
            </div>
          )}
          {/* Mostrar las cardsActivadas */}
          <h2>Caracteristicas</h2>
          <div className="ficha-tecnica-property-cards">
            {Object.entries(propertyData.cardsActivadas).map(([key, value]) => (
              <div className="ficha-tecnica-property-card" key={key}>
                {value && (
                  <>
                    <div className="ficha-tecnica-icon-text-wrapper">
                      {getIcon(key)}
                      <span className="ficha-tecnica-card-text">{key}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="ficha-tecnica-description">
            <h2>Descripción</h2>
            <div className="ficha-tecnica-description-info">
              {/* Información */}
              <p>{propertyData.descripcion}</p>
            </div>
          </div>

          <div className="ficha-tecnica-photos">
            <h2>Fotos</h2>
            <div className="ficha-tecnica-photos-info">
              {/* Imágenes */}
              <div className="ficha-tecnica-main-photo">
                <img src={propertyData.fotos[0]} alt="Main" />
              </div>
              <div className="ficha-tecnica-small-photos">
                {propertyData.fotos.slice(1, 11).map((photo, index) => (
                  <img key={index} src={photo} alt={`Photo-${index + 1}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="ficha-tecnica-contact-info">
            <h2>Datos de contacto:</h2>
            <p>Teléfono: 443-205-7194</p>
            <p>Correo electrónico: sandarinmuebles@gmail.com</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaTecnica;
