import React, { useState , useContext } from "react";
import "./assets/css/inicio.css";
import { useNavigate } from "react-router-dom";
import { TextField, Container, Button, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import "dayjs/locale/es";
import { UsuarioContext } from "./UsuarioContext"

function Inicio() {
  const [ubicacion, setUbicacion] = useState("España");
  const [personas, setPersonas] = useState(1);
  const [fechaEntrada, setFechaEntrada] = useState(formatDate(new Date()));
  const [fechaSalida, setFechaSalida] = useState(formatDate(new Date()));
  const {user, setUser} = useContext(UsuarioContext)

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

  

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  return (
    <div className="app">
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
    </div>
  );
}

export default Inicio;
