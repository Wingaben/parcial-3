import React, { useState, useEffect, useContext } from "react";
import "./assets/css/inicio.css";
import { useNavigate } from "react-router-dom";
import { TextField, Container, Button, Typography } from "@mui/material";
import "dayjs/locale/es";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UsuarioContext } from "./UsuarioContext";

function Inicio() {
  const [dp, setDP] = useState("Salitre 30, Málaga");
  const [parada, setParada] = useState("Louis Pasteur");
  const [linea, setLinea] = useState(1);
  const [sentido, setSentido] = useState(1);
  const [position, setPosition] = useState([0, 0]);
  const { user, setUser } = useContext(UsuarioContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [preMapLoc, setPreMapLoc] = useState(false);

  const ruta = `${"http://localhost:8081/api/usuarios/"    }`;

  const getData = () => {
    fetch(ruta, {
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
        console.log(myJson);
        setData(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  function busquedaLineaSentido() {
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
  function busquedaParada() {
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
      <Marker position={position}>
        <Popup>Tu alojamiento se encuentra aquí.</Popup>
      </Marker>
    );
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
      <Container sx={{ backgroundColor: "" }}>
        <Box paddingTop={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              alert("Timestamp: " + " Usuario: " + data.email + " Token: " + data.id)
            }}
          >
            LOG
          </Button>
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
          <br />
          <form onSubmit={busquedaLineaSentido}>
            <Typography
              align="center"
              variant="h4"
              color={"black"}
              style={{ marginLeft: "20px" }}
            >
              Búsqueda de líneas y sentido
            </Typography>
            <Container className="contenedor" style={{ paddingTop: "30px" }}>
              <TextField
                placeholder="Número de línea"
                variant="outlined"
                type="number"
                label="Número de línea"
                required
                value={linea}
                onChange={(e) => {
                  setLinea(parseInt(e.target.value));
                }}
                inputProps={{ min: 1 }}
                style={{ width: "130px" }}
              />
              <TextField
                placeholder="Sentido"
                variant="outlined"
                type="number"
                label="Sentido"
                required
                value={sentido}
                onChange={(e) => {
                  setSentido(parseInt(e.target.value));
                }}
                inputProps={{ min: 1 }}
                style={{ width: "130px" }}
              />
              <Button variant="contained" color="secondary" type="submit">
                Buscar
              </Button>
            </Container>
          </form>
          <br />
          <form onSubmit={busquedaParada}>
            <Typography
              align="center"
              variant="h4"
              color={"black"}
              style={{ marginLeft: "20px" }}
            >
              Búsqueda de paradas
            </Typography>
            <Container className="contenedor" style={{ paddingTop: "30px" }}>
              <TextField
                required
                placeholder="Parada"
                variant="outlined"
                value={parada}
                label="Parada"
                onChange={(newValue) => {
                  setParada(newValue.target.value);
                }}
              />
              <Button variant="contained" color="secondary" type="submit">
                Buscar
              </Button>
            </Container>
          </form>
          <br />
          <form onSubmit={busquedaDP}>
            <Typography
              align="center"
              variant="h4"
              color={"black"}
              style={{ marginLeft: "20px" }}
            >
              Búsqueda de dirección postal
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
          <br />
          <Button variant="contained" color="secondary">
            LOG de Timestamp
          </Button>
        </Box>
      </Container>
    </LocalizationProvider >
  );
}

export default Inicio;
