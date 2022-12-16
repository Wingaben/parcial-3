import { Typography, Container, Grid, Rating, TextField, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect, useContext } from "react";
import { Image } from "mui-image";
import Link from "@mui/material/Link";
import DirectionsIcon from "@mui/icons-material/Directions";
import Badge from "@mui/material/Badge";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import { UsuarioContext } from "./UsuarioContext";
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton
} from "react-share";
import Messenger from "./assets/components/Messenger/Messenger"

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
function VerAlojamiento() {
  const match = { params: useParams() };
  let { idAlojamientoParam } = useParams();

  
  const [data, setData] = useState({});
  const [resenas, setResenas] = useState({});
  const [aeropuerto, setAeropuerto] = useState("");
  const [arrayFotos, setArrayFotos] = useState([]);
  const { user, setUser } = useContext(UsuarioContext);
  const [picSelector, setPicSeletor] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [editClicked, setEditClicked] = useState(false);

  var rutaOpenData;
  const url = window.location.href;
  const idAlojamiento = /[^/]*$/.exec(url)[0];
  //se supone que ha de hacerse con this.props.match.params.id pero me da muchos errores, aquí lo hago simplemente sacándolo de la URL

  const rutaApi =
    `${"http://localhost:8081/api/alojamientos/"}` + idAlojamiento;

  const rutaResenas = `${"http://localhost:8081/api/resena/"}` + idAlojamiento;

  let navigate = useNavigate();
  const routeChange = () => {
    if (user === null) {
      event.preventDefault();
      alert("Por favor, inicia sesión para realizar una reserva.");
    } else if(user.sub == data.idAnfitrion) {
      event.preventDefault();
      alert("No puedes reservar tu propio alojamiento!");
    } else {
      let path = `../CreateReserva/${data.id}`;
      navigate(path);
    }
  };

  function verUsuario(id) {
    navigate("/VerPerfil/" + id);
  }

  function getData () {
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
        setArrayFotos(myJson.fotos);
        rutaOpenData = `${"http://localhost:8082/api/airports?longitude=" + myJson.longitud + "&latitude=" + myJson.latitud + "&radius=50"}`
        console.log(rutaOpenData);

        return fetch(rutaOpenData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          }
      })
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function (miAeropuerto) {
        if(miAeropuerto.length>0){
          setAeropuerto(miAeropuerto[0].nombre);

          return fetch(rutaResenas, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            }
          }).then(function(answer) {
            return answer.json();
          }).then(function(misResenas){
              setResenas(misResenas);
              console.log(misResenas);
              setLoaded(true);
              console.log('hey'+user.sub)
          });
        }
      })
      });
  }

  useEffect(() => {
    getData();
  }, []);

  //Para modificar la reseña
  const [tituloInput, setTituloInput] = useState("");
  const [textoInput, setTextoInput] = useState("");
  const [valoracionInput, setValoracionInput] = useState(0);

  function modificarResena(idResena, idHuesped, fotoHuesped) {


    const idAlojamientoResena = idAlojamiento;
    const idHuespedResena = idHuesped;
    const tituloResena = tituloInput;
    const textoResena = textoInput;
    const valoracionResena = valoracionInput;
    const fotoHuespedResena = fotoHuesped; 

    console.log('heyyyy')
    console.log('idresena'+ idResena)
    console.log(idAlojamientoResena)
    console.log(idHuespedResena)
    console.log(tituloResena)
    console.log(fotoHuespedResena)

    const resena = {
      idAlojamientoResena,
      idHuespedResena,
      tituloResena,
      textoResena,
      fotoHuespedResena,
      valoracionResena
    };

    fetch("http://localhost:8081/api/resena/" + idResena, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resena),
    }).then(() => {
    });
  }

  return (
    <Container maxWidth="lg" style={{ padding: "20px" }}>
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
              <Box>
                <Typography
                  variant="h5"
                  color={"primary"}
                  style={{ fontWeight: 700 }}
                >
                  {data.titulo}
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
                <Image
                  width={280}
                  style={{ paddingTop: 10, borderRadius: 16 }}
                  src={arrayFotos[picSelector].url}
                  showLoading
                  
                />

                <Badge color="secondary" badgeContent={arrayFotos.length}>
                  <PhotoLibraryIcon
                    sx={{ "&:hover": { color: "blue" } }}
                    onClick={() => {
                      if (picSelector + 1 >= arrayFotos.length) {
                        setPicSeletor(0);
                      } else {
                        setPicSeletor(picSelector + 1);
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
                      sx={{ paddingLeft: 3, paddingRight: 2 }}
                      style={{ fontWeight: 700 }}
                    >
                      Anfitrión:
                    </Typography>
                    <Link
                      onClick={() => verUsuario(data.idAnfitrion)}
                      underline="hover"
                      style={{ fontWeight: 700 }}
                    >
                      {data.nombreAnfitrion}
                    </Link>
                    <Rating value={4} readOnly style={{ marginLeft: "20px" }} />
                    
                    <TwitterShareButton url={url} title={'¡Mira este alojamiento que he visto en LandBnb!'}>
                      <button className="btn btn-circle">
                          <i className="fab fa-twitter"> </i>
                      </button>
                    </TwitterShareButton>
                    
                    <WhatsappShareButton  url={url} title={'¡Mira este alojamiento que he visto en LandBnb!'}>
                    <button className="btn btn-circle">
                          <i className="fab fa-whatsapp"> </i>
                      </button>
                    </WhatsappShareButton>

                    <FacebookShareButton url={url} quote={'¡Mira este alojamiento que he visto en LandBnb!'}>
                    <button className="btn btn-circle">
                          <i className="fab fa-facebook"> </i>
                      </button>

                    </FacebookShareButton>
                    
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 2,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 2 }}
                      style={{ fontWeight: 700 }}
                    >
                      Capacidad:
                    </Typography>
                    <Typography>{data.capacidad}</Typography>
                    <GroupIcon />

                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 14, paddingRight: 2 }}
                      style={{ fontWeight: 700 }}
                    >
                      Precio:
                    </Typography>
                    <Typography>{data.precio}€/noche</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 2,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 2 }}
                    >
                      {" "}
                      <DirectionsIcon style={{ marginRight: "10px" }} />
                      {data.direccion}{","} {data.city}{","} {data.town} {data.state}
                      {" - "}
                      {data.country}
                    </Typography>
                  </Box>
                  { aeropuerto ? (
                    <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 2,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 2 }}
                    >
                      {" "}
                      <AirplanemodeActiveIcon style={{ marginRight: "10px" }} />
                      {aeropuerto}
                    </Typography>
                  </Box>
                  ) : (
                    <div></div>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 2,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ paddingLeft: 3, paddingRight: 2 }}
                      style={{ fontWeight: 700 }}
                    >
                      Descripción:
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextField
                      sx={{
                        fontcolor: "#000",
                        width: "100%",
                        paddingLeft: 3,
                        paddingRight: 10,
                      }}
                      value={data.descripcion}
                      multiline
                      fullWidth
                      readOnly
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      paddingLeft: 3,
                      paddingTop: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button variant="contained" onClick={routeChange}>
                      Solicitar reserva
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box paddingTop={3}>
                <MapContainer
                  center={[data.latitud, data.longitud]}
                  zoom={15}
                  style={{ height: "40vh", width: "50wh" }}
                >
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[data.latitud, data.longitud]}>
                    <Popup>
                      <span>🚶‍♂️</span> El alojamiento se encuentra aqui
                    </Popup>
                  </Marker>
                  <Box sx={{ height: "50%" }}></Box>
                </MapContainer>
              </Box>
              
            </Grid>
            <Messenger id='101849880438349715423'>      
            </Messenger>
          </Grid>
          <Box>
            <Typography
              variant="h5"
              color={"primary"}
              style={{ fontWeight: 700 }}
            >
              Reseñas de este alojamiento
            </Typography>
          </Box>
          <Box>
            {resenas.map((r) => (
              <Box
              sx={{
                background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)",
                borderRadius: 0,
                padding: 1,
                marginBottom: 1,
              }}
              p={3}
              elevation={10}
            >
              <Avatar src={r.fotoHuesped}/>
              {(user.sub==r.idHuesped && editClicked)?<Rating value={r.valoracion} />:<Rating readOnly value={r.valoracion} />} 
              {
                (user.sub==r.idHuesped && editClicked)?
                <TextField id="input-with-sx" label="titulo" placeholder={r.titulo} variant="standard" 
                onChange={(newValue) => setTituloInput(newValue.target.value)} value={tituloInput} />
                :
                <Typography sx={{fontWeight: 'Bold'}}>{r.titulo}</Typography>
                  
              }

              {
                (user.sub==r.idHuesped && editClicked)?
                <TextField id="input-with-sx" label="texto" placeholder={r.texto} variant="standard" 
                onChange={(newValue) => setTextoInput(newValue.target.value)} value={textoInput} />
                :
                <Typography >{r.texto}</Typography>
                  
              }
              {user.sub==r.idHuesped && (<EditIcon style={{ cursor: "pointer" }} onClick={() => { setEditClicked(!editClicked) }}></EditIcon>)}
              {(editClicked && user.sub==r.idHuesped ) && (<SaveAltIcon style={{ cursor: "pointer" }} onClick={() => { modificarResena(r.id, r.idHuesped, r.fotoHuesped) }}></SaveAltIcon>)}
              </Box>
              )
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default VerAlojamiento;
