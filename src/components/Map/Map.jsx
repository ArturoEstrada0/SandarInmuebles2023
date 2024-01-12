/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import { Button } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

const position = [19.7028, -101.1927]
const zoom = 14

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon

function MapInvalidateSize() {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
  }, [])

  return null
}

function SetViewOnClick({ coords }) {
  const map = useMap()

  return (
    <Button
      type='primary'
      icon={<EnvironmentOutlined />}
      style={{
        zIndex: 999,
        bottom: 10,
        left: 23,
        position: 'absolute',
        cursor: 'pointer',
      }}
      onClick={() => {
        map.setView(coords, zoom)
      }}>
      Centrar
    </Button>
  )
}

function Map({ height, width }) {
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: height, width: width }}>
      <TileLayer
        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> © CartoDB'
        maxZoom={19}
      />
      <SetViewOnClick coords={position} />
      <MapInvalidateSize />
    </MapContainer>
  )
}
export default Map
