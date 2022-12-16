import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useState } from "react"

const MaxMarks = 2
function ClickMark({ addPoint }) {
  const map = useMap()

  useEffect(() => {
    map.addEventListener("click", (e) => {
      addPoint([e.latlng.lat, e.latlng.lng])
    })
  }, [])

  return null
}

function LocationMarker({ useCurrentLocation }) {
  const map = useMap()

  // Get current location
  useEffect(() => {

    if (useCurrentLocation) {
      map.locate().on("locationfound", function (e) {
        const currentPosition = e.latlng
        map.flyTo(currentPosition, map.getZoom())
      });
    }

  }, []);

  return null
}

export default function Map() {

  const [points, setPoinst] = useState(Array)(props.points);

  const addPoint = () => {
    let i = 0

    for (let _p of points) {
      if (_p === null) {
        break
      }
      i++
    }

    if (i < MaxMarks) updatePoints(i, p)
  }

  const updatePoints = (index, p) => {
    setPoinst(prevPoints => {
      prevPoints[index] = p
      return prevPoints
    })

    props.marksCallback(points)
  }
  return (

    <MapContainer center={props.center} zoom={props.zoom} scrollWheelZoom={props.scrollWheelZoom}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <LocationMarker useCurrentLocation={props.useCurrentLocation} origin={props.points[0]} destination={props.points[1]} marksCallback={props.marksCallback}/> */}
      {/* <ClickMarkers points={props.points}/> */}
      <LocationMarker useCurrentLocation={props.useCurrentLocation} />
      <ClickMark addPoint={addPoint} />
      {
        points === null ? null : (
          points.map((p, index) => {
            if (p !== null) {
              const tag = index === 0 ? "Origen" : "Destino";
              return (<DraggableMarker key={index} position={p} tag={tag} updateCallback={updatePoints} />);
            }
          })
        )
      }
    </MapContainer>
  )
}