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
import {Icon} from 'leaflet'
function Inicio() {
  const [ubicacion, setUbicacion] = useState("España");
  const [personas, setPersonas] = useState(1);
  const [fechaEntrada, setFechaEntrada] = useState(formatDate(new Date()));
  const [fechaSalida, setFechaSalida] = useState(formatDate(new Date()));
  const { user, setUser } = useContext(UsuarioContext);
  const [data, setData] = useState([]);
  const [preMapLoc, setPreMapLoc] = useState(false);
  const [position, setPosition] = useState([0, 0]);

  let navigate = useNavigate();
  function realizarBusqueda() {
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
      <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
        <Popup>Te encuentras aquí.</Popup>
      </Marker>
    );
  };


  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;
  const getData = () => {
    fetch(ruta + "/api/perfiles", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);
  function borrarPerfil(id) {
    const rutaBorrar = `${ruta + "/api/perfiles/" + id}`;
    console.log(rutaBorrar);
    fetch(rutaBorrar, { method: "DELETE" }).then(window.location.reload(false));
  }
  function modificarPerfil(id) {
    navigate("/ModificarPerfil", {
      state: { idperfil: id },
    });
  }
  function verPerfil(id) {
    navigate("/Perfil", {
      state: { idperfil: id },
    });
  }
  return (
    <Container maxWidth="xl">
      <Typography
        variant="h5"
        noWrap
        color="primary"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".15rem",
          textDecoration: "none",
          marginY: "20px",
        }}
      >
        PERFILES
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
            time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds(),
            dateCad = today.getFullYear() + '-' + (today.getMonth() + 4) + '-' + today.getDate();
          alert("Timestamp: " + date + "T" + time + "+00:00" +
            "\nUsuario: " + user.email +
            "\nCaducidad: " + dateCad + "T" + time + "+00:00" +
            "\nToken: " + user.sub);
        }
        }
      >
        LOG
      </Button>
      <TableContainer component={Paper}>
        {data.length === 0 || data === undefined ? (
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="h5"
              sx={{ margin: 3, fontWeight: 700, color: "gray" }}
            >
              {" "}
              Aún no tienes perfiles creados 😔{" "}
            </Typography>
            <Button
              variant="contained"
              type="submit"
              sx={{ paddingTop: "10px", margin: "auto" }}
              onClick={() => {
                navigate("/CrearPerfil");
              }}
            >
              Crear perfil
            </Button>
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell align="left">Apellidos</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Fecha de nacimiento</TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">
                    <img src={row.fotos[0].url} width="90"></img>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ cursor: "pointer" }}
                    onClick={() => verPerfil(row.id, row.fotos[0].url)}
                  >
                    {row.nombre} 🔍
                  </TableCell>

                  <TableCell align="left">{row.apellidos}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.fechaNacimiento}</TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      onClick={() => modificarPerfil(row.id)}
                    >
                      Modificar
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => borrarPerfil(row.id)}
                    >
                      Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
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
    </Container >

    /*<div className="app">
      <div className="main">
        <div style={{ marginTop: "30vh" }}>
          <form onSubmit={realizarBusqueda}>
            <Typography
              variant="h4"
              color={"white"}
              style={{ marginLeft: "20px" }}
            >
              Encuentra tu alojamiento
            </Typography>

            <Container className="contenedor" style={{ paddingTop: "30px" }}>
              <TextField
                required
                placeholder="País o ciudad"
                variant="outlined"
                value={ubicacion}
                label="País o ciudad"
                onChange={(newValue) => {
                  setUbicacion(newValue.target.value);
                }}
              />

              <DatePicker
                inputFormat={"DD/MM/YYYY"}
                value={fechaEntrada}
                label="Fecha entrada *"
                required
                minDate={new Date()}
                onChange={(newValue) => {
                  setFechaEntrada(formatDate(newValue));
                }}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                inputFormat={"DD/MM/YYYY"}
                value={fechaSalida}
                label="Fecha salida *"
                required
                minDate={fechaEntrada}
                onChange={(newValue) => {
                  setFechaSalida(formatDate(newValue));
                }}
                renderInput={(params) => <TextField {...params} />}
              />

              <TextField
                placeholder="Capacidad"
                variant="outlined"
                type="number"
                label="Capacidad"
                required
                value={personas}
                onChange={(e) => {
                  setPersonas(parseInt(e.target.value));
                }}
                inputProps={{ min: 1 }}
                style={{ width: "130px" }}
              />

              <Button variant="contained" color="secondary" type="submit">
                Buscar
              </Button>
            </Container>
          </form>
        </div>
      </div>
    </div>*/
  );
}

export default Inicio;
