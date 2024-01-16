import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "../../assets/img/icono2.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const zoom = 14;
const iconSize = [130, 92];
const circleRadius = 500; // Radio de la circunferencia en metros

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: iconSize,
  shadowSize: [0, 0],
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapInvalidateSize() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
}

function Map({ height, width, markerCoords }) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map && markerCoords) {
      // Centrar automáticamente el mapa cuando cambian las coordenadas
      map.setView(markerCoords, zoom);
    }
  }, [markerCoords, map]);

  const MapSetViewButton = () => {
    const map = useMap();

    return (
      <Button
        type="primary"
        icon={<EnvironmentOutlined />}
        style={{
          zIndex: 999,
          bottom: 10,
          left: 23,
          position: "absolute",
          cursor: "pointer",
        }}
        onClick={() => {
          if (markerCoords) {
            map.setView(markerCoords, zoom);
          }
        }}
      >
        Centrar
      </Button>
    );
  };

  return (
    <MapContainer
      center={markerCoords}
      zoom={zoom}
      style={{ height: height, width: width }}
      whenCreated={setMap}
    >
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> © CartoDB'
        maxZoom={19}
      />
      {markerCoords && (
        <>
          <Marker position={markerCoords}>
            <Popup>Ubicación</Popup>
          </Marker>
          <Circle
            center={markerCoords}
            radius={circleRadius}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
          />
        </>
      )}
      <MapInvalidateSize />
      {markerCoords && <MapSetViewButton />}
    </MapContainer>
  );
}

export default Map;
