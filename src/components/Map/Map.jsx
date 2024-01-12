import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { Button } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import customIcon from '../../assets/img/IconoSandar.png';

const defaultPosition = [19.7028, -101.1927]
const defaultZoom = 14

let DefaultIcon = L.icon({
  iconUrl: customIcon,
  shadowUrl: iconShadow,
  iconSize: [200, 120],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
})

L.Marker.prototype.options.icon = DefaultIcon

function MapInvalidateSize() {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
  }, [])

  return null
}

function SetViewOnClick({ setMarkerCoords }) {
  const map = useMap();

  const handleClick = () => {
    const center = map.getCenter();
    setMarkerCoords([center.lat, center.lng]);
  };

  return (
    <Button
      type="primary"
      icon={<EnvironmentOutlined />}
      style={{
        zIndex: 999,
        bottom: 10,
        left: 23,
        position: 'absolute',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      Centrar
    </Button>
  );
}

function Map({ height, width, markerCoords, setMarkerCoords }) {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={defaultZoom}
      style={{ height: height, width: width }}
    >
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> © CartoDB'
        maxZoom={19}
      />
      <Marker position={markerCoords} icon={DefaultIcon}>
        {/* Puedes personalizar el marcador si es necesario */}
      </Marker>
      <SetViewOnClick setMarkerCoords={setMarkerCoords} />
      <MapInvalidateSize />
    </MapContainer>
  );
}

export default Map;
