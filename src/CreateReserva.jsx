import { Typography, Container, Grid, Rating, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect , useContext } from "react";
import { Image } from "mui-image";
import Link from "@mui/material/Link";
import DirectionsIcon from "@mui/icons-material/Directions";
import Badge from "@mui/material/Badge";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from "@mui/material/Button";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import LoadingButton from "@mui/lab/LoadingButton";
import dayjs, { Dayjs } from "dayjs";
import { UsuarioContext } from "./UsuarioContext";

import "dayjs/locale/es";
import {es} from 'date-fns/locale'

import "leaflet/dist/leaflet.css";
function CreateReserva() {
  const [fechaEntradaInput, setfechaEntrada] = useState(dayjs());
  const [fechaSalidaInput, setfechaSalida] = useState(dayjs());
  const [mostrarBotonReservar, setMostrarBotonReservar] = useState(false);
  const { user, setUser } = useContext(UsuarioContext);

  const [loading, setLoading] = useState(false);
  
  let navigate = useNavigate()
  const routeChange = () =>{ 
    let path = `../MisSolicitudes`; 
    navigate(path);
  }

  const handleSubmit = (e) => {
    setLoading(true);
    const fechaEntrada = fechaEntradaInput;
    const fechaSalida = fechaSalidaInput;
    const idAnfitrion = data.idAnfitrion 
    const idAlojamiento = idAlojamientoLink;
    const idHuesped = user.sub;
    const tituloAlojamiento = data.titulo;
    const estado = "pendiente"
    const reserva = {
      fechaEntrada,
      fechaSalida,
      idAnfitrion, // Owner
      idHuesped,// Invited
      idAlojamiento,
      tituloAlojamiento,
      estado
    };
    fetch("http://localhost:8081/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva),
    }).then(() => {
      setLoading(false);
      console.log(reserva)
      console.log(user)
    });
    routeChange() 
  };

  const [data, setData] = useState({});
  const [reservasAlojamiento, setReservasAlojamiento] = useState({});
  const [position, setPosition] = useState([0, 0]);
  const [picSelector, setPicSeletor] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [reservasLoaded, setReservasLoaded] = useState(false);
  const idAlojamientoLink = /[^/]*$/.exec(window.location.href)[0];
  const [value, setValue] = useState([null, null]);
  const rutaApi = `${"http://localhost:8081/api/alojamientos/"}`+idAlojamientoLink;
  const rutaApiReservasAlojamiento = `${"http://localhost:8081/api/reservas?alojamiento="}`+idAlojamientoLink;
  
  function disableWeekends(date) {    
    if(reservasAlojamiento.length>0)
    {
      for (var i = 0; i < reservasAlojamiento.length; i++)
      {
        if(date == Date.parse(reservasAlojamiento[i].fechaEntrada) || date == Date.parse(reservasAlojamiento[i].fechaSalida) 
        || (date > Date.parse(reservasAlojamiento[i].fechaEntrada)&&(date < Date.parse(reservasAlojamiento[i].fechaSalida))))
        {
          return true;
        }
      }
      return false;
    }
    else
    {
      return false;
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

  const getData = () => {
    fetch(rutaApi, {
      headers: {
        "Content-Type": "application/json", 
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
        setLoaded(true);
      });
  };

  const getReservas = () => {
    fetch(rutaApiReservasAlojamiento, {
      headers: {
        "Content-Type": "application/json", 
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setReservasAlojamiento(myJson);
        setReservasLoaded(true)
      });
  };

  useEffect(() => {
    getData();
    getReservas();
  }, []);

  return (
    <Container maxWidth="lg">
      {loaded && (
        <Box
          sx={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: 3,
          }}
          p={3}
          elevation={10}
        >
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item xs={12}>
              <Box sx={{ desplay: "flex", flexDirection: "row" }}>
                <Typography
                  variant="h5"
                  color={"primary"}
                  sx={{ textAlign: "start" }}
                >
                  Envíar una solicitud de reserva
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  backgroundColor: "",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {picSelector === 0 && (
                  <Image
                    width={280}
                    style={{ paddingTop: 10, borderRadius: 16 }}
                    src= {data.fotos[0].url}
                    showLoading
                  />
                )}
                {picSelector === 1 && (
                  <Image
                    width={280}
                    style={{ paddingTop: 10, borderRadius: 16 }}
                    src={data.fotos[0].url}
                    showLoading
                  />
                )}
                {picSelector === 2 && (
                  <Image
                    width={280}
                    style={{ paddingTop: 10, borderRadius: 16 }}
                    src={data.fotos[0].url}
                    showLoading
                  />
                )}
                <Badge color="secondary" badgeContent={3}>
                  <PhotoLibraryIcon
                    sx={{ "&:hover": { color: "blue" } }}
                    onClick={() => {
                      if(picSelector + 1 >= 3){
                        setPicSeletor(0)
                      }else{
                        setPicSeletor(picSelector + 1)
                      }
                    }}
                  />
                </Badge>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    width: "60%",
                    //   width:"60%" later I have to add a condition in case if it is smaller device show it better
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 1,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 4 }}
                    >
                      {data.titulo}
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 1,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 4 }}
                    >
                      {data.precio}€/noche 
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 4 }}
                    >
                      ★{data.valoracionAnfitrion}
                      
                    </Typography>
                  </Box>
                  
                  
                  <Box
                    sx={{
                      display: "flex",
                      paddingLeft: 3,
                      paddingTop: 2,
                      alignItems: "center",
                    }}
                  >
                    <DirectionsIcon /> <Typography>{data.direccion}</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    width: "60%",
                    //   width:"60%" later I have to add a condition in case if it is smaller device show it better
                  }}
                >
                 
              
                </Box>
                
              </Box>
              
            </Grid>
            <Grid item xs={12}>
              {reservasLoaded &&(<Box paddingTop={3}>
              <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={es}
                  
                  localeText={{ start: 'Check-in', end: 'Check-out' }}>
                  <StaticDateRangePicker
                  inputFormat={"DD/MM/YYYY"}
                  locale={es}
                  value={value}
                  shouldDisableDate={disableWeekends}
                  onChange={(newValue) => {
                    setValue(newValue);
                    setfechaEntrada(formatDate(newValue[0]));
                    setfechaSalida(formatDate(newValue[1]));
                    if(newValue[0]!=null && newValue[1]!=null)
                    {
                      setMostrarBotonReservar(true);
                    }
                    else
                    {
                      setMostrarBotonReservar(false);
                    }
                  }}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} />
                    </React.Fragment>
                  )}
                  />
              </LocalizationProvider>
              </Box>)}
            </Grid>
            
            <Box
                    sx={{
                      display: "flex",
                      paddingLeft: 3,
                      paddingTop: 2,
                      alignItems: "center",
                    }}
                  >
                    <LoadingButton
                      loading={loading}
                      onClick={handleSubmit}
                      variant="contained"
                      color="secondary"
                      disabled={!mostrarBotonReservar}
                      >
                      Reservar
                    </LoadingButton>
                  </Box>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default CreateReserva;
