import React, { useState, useContext, useEffect } from "react";
import "./assets/css/inicio.css";
import { useNavigate } from "react-router-dom";
import { TextField, Container, Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/es";
import { UsuarioContext } from "./UsuarioContext";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
function Inicio() {
  const [ubicacion, setUbicacion] = useState("España");
  const [personas, setPersonas] = useState(1);
  const { user, setUser } = useContext(UsuarioContext);
  const [data, setData] = useState([]);
  const [preMapLoc, setPreMapLoc] = useState(false);
  const [position, setPosition] = useState([0, 0]);
  const [dp, setDP] = useState("Salitre 30, Málaga");

  let navigate = useNavigate();
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        if (!preMapLoc) {
          setPreMapLoc(true);
          map.locate();
        } else {
          setPosition([e.latlng.lat, e.latlng.lng]);
        }
      },
      locationfound(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
        <Popup>Te encuentras aquí.</Popup>
      </Marker>
    );
  };
  function busquedaDP() {
    if (fechaEntrada > fechaSalida) {
      event.preventDefault();
      alert(
        "Por favor, la fecha de entrada no puede ser superior a la de salida"
      );
    } else {
      navigate("/BuscarAlojamientos", {
        state: {
          ubicacion: ubicacion,
          fechaEntrada: fechaEntrada,
          fechaSalida: fechaSalida,
          personas: personas,
        },
      });
    }
  }
  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;
  
  return (
    <Container maxWidth="xl">
      <Box paddingTop={3}>
        <MapContainer
          center={[36.72016, -4.42034]}
          zoom={17}
          style={{ height: "50vh", width: "50wh" }}
        >
          <LocationMarker />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Box sx={{ height: "50%" }}></Box>
        </MapContainer>
      </Box>
      <br />
      <form onSubmit={busquedaDP}>
        <Typography
          align="center"
          variant="h4"
          color={"black"}
          style={{ marginLeft: "20px" }}
        >
          Indicar dirección
        </Typography>
        <Container className="contenedor" style={{ paddingTop: "30px" }}>
          <TextField
            required
            placeholder="Dirección postal"
            variant="outlined"
            value={dp}
            label="Dirección postal"
            onChange={(newValue) => {
              setDP(newValue.target.value);
            }}
          />
          <Button variant="contained" color="secondary" type="submit">
            Buscar
          </Button>
        </Container>
      </form>
    </Container >

  );
}

export default Inicio;
