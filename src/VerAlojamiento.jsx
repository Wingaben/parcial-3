import {
  Typography,
  Container,
  Grid,
  Rating,
  TextField,
  Avatar,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect, useContext } from "react";
import { Image } from "mui-image";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import DirectionsIcon from "@mui/icons-material/Directions";
import Badge from "@mui/material/Badge";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import { UsuarioContext } from "./UsuarioContext";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import EditIcon from "@mui/icons-material/Edit";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Divider from "@mui/material/Divider";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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

  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;

  const rutaApi = `${ruta + "/api/alojamientos/"}` + idAlojamiento;

  const rutaResenas = `${ruta + "/api/resena/"}` + idAlojamiento;

  let navigate = useNavigate();
  const routeChange = () => {
    if (user === null) {
      event.preventDefault();
      alert("Por favor, inicia sesión para realizar una reserva.");
    } else if (user.sub == data.idAnfitrion) {
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

  function getData() {
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
        ruta = `${
          ruta +
          "/api/alojamientos/airports?longitude=" +
          myJson.longitud +
          "&latitude=" +
          myJson.latitud +
          "&radius=50"
        }`;
        return fetch(ruta, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then(function (respuesta) {
            return respuesta.json();
          })
          .then(function (miAeropuerto) {
            if (miAeropuerto.length > 0) {
              setAeropuerto(miAeropuerto[0].nombre);

              return fetch(rutaResenas, {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              })
                .then(function (answer) {
                  return answer.json();
                })
                .then(function (misResenas) {
                  setResenas(misResenas);
                  console.log(misResenas);
                  setLoaded(true);
                });
            }
          });
      });
  }

  useEffect(() => {
    getData();
  }, []);

  //Para modificar la reseña
  const [tituloInput, setTituloInput] = useState("");
  const [textoInput, setTextoInput] = useState("");
  const [valoracionInput, setValoracionInput] = useState(0);

  function modificarSet(res) {
    setEditClicked(!editClicked);
    setTituloInput(res.titulo);
    setTextoInput(res.texto);
    setValoracionInput(res.valoracion);
  }

  function reloadPage() {
    window.location.reload();
  }

  function borrarResena(idResena) {
    fetch(ruta + "/api/resena/" + idResena, { method: "DELETE" }).then(
      reloadPage()
    );
  }

  function modificarResena(idResena, idHuesped, fotoHuespedInput) {
    const idHuespedResena = idHuesped;
    const titulo = tituloInput;
    const texto = textoInput;
    const fotoHuesped = fotoHuespedInput;
    const valoracion = valoracionInput;

    const resenaModificada = {
      idAlojamiento,
      idHuesped,
      titulo,
      texto,
      fotoHuesped,
      valoracion,
    };

    fetch(ruta + "/api/resena/" + idResena, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resenaModificada),
    }).then(() => {
      reloadPage();
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

                <Rating value={data.valoracionAlojamiento} readOnly />
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
                      style={{
                        fontWeight: 700,
                        width: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {data.nombreAnfitrion}
                    </Link>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      <TwitterShareButton
                        url={url}
                        title={
                          "¡Mira este alojamiento que he visto en LandBnb!"
                        }
                      >
                        <button className="btn btn-circle">
                          <i className="fab fa-twitter"> </i>
                        </button>
                      </TwitterShareButton>

                      <WhatsappShareButton
                        url={url}
                        title={
                          "¡Mira este alojamiento que he visto en LandBnb!"
                        }
                      >
                        <button className="btn btn-circle">
                          <i className="fab fa-whatsapp"> </i>
                        </button>
                      </WhatsappShareButton>

                      <FacebookShareButton
                        url={url}
                        quote={
                          "¡Mira este alojamiento que he visto en LandBnb!"
                        }
                      >
                        <button className="btn btn-circle">
                          <i className="fab fa-facebook"> </i>
                        </button>
                      </FacebookShareButton>
                    </Box>
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
                      {data.direccion}
                      {","} {data.city}
                      {","} {data.town} {data.state}
                      {" - "}
                      {data.country}
                    </Typography>
                  </Box>
                  {aeropuerto ? (
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
                        <AirplanemodeActiveIcon
                          style={{ marginRight: "10px" }}
                        />
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
          </Grid>
          <Divider variant="middle" style={{ marginTop: "20px" }} />
          <Box>
            <Typography
              variant="h5"
              color={"primary"}
              style={{ fontWeight: 700, marginTop: "20px" }}
            >
              Reseñas de este alojamiento
            </Typography>
          </Box>
          {resenas.length === 0 || resenas === undefined ? (
            <Typography
              variant="h5"
              sx={{ margin: 3, fontWeight: 700, color: "gray" }}
            >
              {" "}
              Aún no hay reseñas para este alojamiento.{" "}
            </Typography>
          ) : (
            <Box>
              {resenas.map((r) => (
                <Box
                  sx={{
                    background: "white",
                    borderRadius: 1.5,
                    padding: 2,
                    marginBottom: 1,
                    marginTop: 1,
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      onClick={() => {
                        verUsuario(r.idHuesped);
                      }}
                      style={{ cursor: "pointer" }}
                      src={r.fotoHuesped}
                    />
                    <Typography sx={{ fontWeight: "Bold", marginLeft: "10px" }}>
                      {r.nombreHuesped}
                    </Typography>
                  </Box>

                  {user !== null && user.sub == r.idHuesped && editClicked ? (
                    <Rating
                      onChange={(newValue) =>
                        setValoracionInput(Number(newValue.target.value))
                      }
                      value={valoracionInput}
                      required
                    />
                  ) : (
                    <Rating readOnly value={r.valoracion} />
                  )}
                  {user !== null && user.sub == r.idHuesped && !editClicked && (
                    <EditIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        modificarSet(r);
                      }}
                    ></EditIcon>
                  )}
                  <Stack sx={{ width: "100%" }}>
                    {user !== null && user.sub == r.idHuesped && editClicked ? (
                      <TextField
                        label="Título"
                        placeholder={r.titulo}
                        variant="outlined"
                        onChange={(newValue) =>
                          setTituloInput(newValue.target.value)
                        }
                        value={tituloInput}
                        style={{ marginTop: "10px", width: "50%" }}
                      />
                    ) : (
                      <Typography sx={{ fontWeight: "Bold" }}>
                        {r.titulo}
                      </Typography>
                    )}
                  </Stack>
                  <Stack>
                    {user !== null && user.sub == r.idHuesped && editClicked ? (
                      <TextField
                        label="Comentario"
                        placeholder={r.texto}
                        v
                        onChange={(newValue) =>
                          setTextoInput(newValue.target.value)
                        }
                        value={textoInput}
                        style={{ marginTop: "10px", width: "50%" }}
                      />
                    ) : (
                      <Typography>{r.texto}</Typography>
                    )}
                  </Stack>
                  <Box>
                    {editClicked &&
                      user !== null &&
                      user.sub == r.idHuesped && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => borrarResena(r.id)}
                        >
                          {" "}
                          Borrar reseña{" "}
                        </Button>
                      )}
                    {editClicked &&
                      user !== null &&
                      user.sub == r.idHuesped && (
                        <Button
                          variant="contained"
                          onClick={() => {
                            modificarResena(r.id, r.idHuesped, r.fotoHuesped);
                          }}
                        >
                          Guardar
                        </Button>
                      )}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}

export default VerAlojamiento;
