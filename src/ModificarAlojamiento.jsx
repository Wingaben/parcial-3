import Container from "@mui/material/Container";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EuroIcon from "@mui/icons-material/Euro";
import DirectionsIcon from "@mui/icons-material/Directions";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import ImageIcon from '@mui/icons-material/Image';
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useLocation } from "react-router-dom";
import { UsuarioContext } from "./UsuarioContext";
import { useNavigate } from "react-router-dom";
import { ImageList, ImageListItem } from '@mui/material';

// const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-07'));

function ModificarAlojamiento() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { idalojamiento } = state;
  const { user, setUser } = useContext(UsuarioContext);

  const [descripcionInput, setdescripcionInput] = useState("");
  const [tituloInput, setTituloInput] = useState("");
  const [capacidades, setCapacidades] = useState(0);
  const [checkInInput, setCheckInInput] = useState(dayjs());
  const [checkOutInput, setCheckoutInput] = useState(dayjs());
  const [data, setData] = useState([]);
  const [precioNoche, setPrecioNoche] = useState(0);
  const [direccionInput, setDireccionInput] = useState("");
  const [direccionLlavesInput, setDireccionLlavesInput] = useState("");
  const [position, setPosition] = useState([0, 0]);

  const [tabId, setTabId] = useState(0);

  const [preMapLoc, setPreMapLoc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalTab, setGeneralTab] = useState(true);
  const [precioTab, setPrecioTab] = useState(false);
  const [direccionTab, setDireccionTab] = useState(false);
  const [imagenesTab, setImagenesTab] = useState(false);
  const [descriptionTab, setDescriptionTab] = useState(false);
  const [images, setImages] = useState([]);
  const [getLoading, setGetLoading] = useState(false);

  const handleChange = (event) => {
    setTipoAlojamiento(event.target.value);
  };

  function uploadWidget() {
    var myWidget = window.cloudinary.openUploadWidget(
      {
        cloud_name: 'dionckchd',
        upload_preset: 'xmkbucid',
        tags: ['miniflix'],
        sources: ["local",
          "url",
          "camera",
          "image_search",
          "google_drive",
          "facebook",
          "dropbox",
          "instagram",
          "shutterstock",
          "getty",
          "istock",
          "unsplash"]

      },
      (error, result) => {
        if (!error && result && result.event == "success") {
          setImages((prev) => [...prev, { url: result.info.url, id: result.info.public_id }])
        }
      });
    myWidget.open();
  }

  const handleSubmit = (e) => {
    setLoading(true);
    const capacidad = capacidades;
    const descripcion = descripcionInput;
    const titulo = tituloInput;
    const checkIn = checkInInput.format("HH:mm:ss");
    const checkOut = checkOutInput.format("HH:mm:ss");

    const precio = precioNoche;

    const direccion = direccionInput;
    const direccionLlaves = direccionLlavesInput;

    const latitud = position[0];
    const longitud = position[1];
    const fotos = images;
    const idAnfitrion = user.sub;
    const valoracionAnfitrion = 0;
    const nombreAnfitrion = user.name;
    const alojamiento = {
      capacidad,
      descripcion,
      titulo,
      direccion,
      direccionLlaves,
      checkIn,
      checkOut,
      precio,
      latitud,
      longitud,
      fotos,
      idAnfitrion,
      valoracionAnfitrion,
      nombreAnfitrion,
    };

    fetch("http://localhost:8081/api/alojamientos/" + idalojamiento, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alojamiento),
    }).then(() => {
      setLoading(false);
    });

    navigate("/MisAlojamientos");
  };

  const rutaGet =
    "http://localhost:8081/api/alojamientos/" + idalojamiento;

  const handleGetRequest = async () => {
    setGetLoading(false);
    fetch(rutaGet, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setData(myJson);
        setTituloInput(myJson.titulo);
        setCapacidades(myJson.capacidad);
        setdescripcionInput(myJson.descripcion);
        setCheckInInput(dayjs(myJson.checkIn, "HH:mm:ss"));
        setCheckoutInput(dayjs(myJson.checkOut, "HH:mm:ss"));
        setPrecioNoche(myJson.precio);
        setDireccionInput(myJson.direccion);
        setDireccionLlavesInput(myJson.direccionLlaves);
        setPosition([myJson.latitud, myJson.longitud]);
        setImages(myJson.fotos);
        // necessary to check the rest of them
        setGetLoading(true);
      });
  };

  useEffect(() => {
    handleGetRequest();
  }, []);

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>Estas Aqui</Popup>
      </Marker>
    );
  };

  return (
    <>
      {getLoading && (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"es"}>
        <Container sx={{ backgroundColor: "" }}>
          <Box paddingTop={5} paddingX={10}>
            <Typography
              variant="h5"
              noWrap
              color="primary"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".15rem",
              }}
            >
              MODIFICAR ALOJAMIENTO
            </Typography>
            <BottomNavigation
              showLabels
              value={tabId}
              onChange={(event, newValue) => {
                setTabId(newValue);
                if (newValue === 0) {
                  setDescriptionTab(false);
                  setDireccionTab(false);
                  setPrecioTab(false);
                  setImagenesTab(false)
                  setGeneralTab(true);
                } else if (newValue === 1) {
                  setDescriptionTab(false);
                  setDireccionTab(false);
                  setPrecioTab(true);
                  setImagenesTab(false)
                  setGeneralTab(false);
                } else if (newValue === 2) {
                  setDescriptionTab(false);
                  setDireccionTab(true);
                  setPrecioTab(false);
                  setImagenesTab(false)
                  setGeneralTab(false);
                } else if (newValue === 3) {
                  setDescriptionTab(false);
                  setDireccionTab(false);
                  setPrecioTab(false);
                  setImagenesTab(true)
                  setGeneralTab(false);
                } else if (newValue === 4) {
                  setDescriptionTab(true);
                  setDireccionTab(false);
                  setPrecioTab(false);
                  setImagenesTab(false)
                  setGeneralTab(false);
                }
              }}
              sx={{ border: 1, justifyContent: "space-between" }}
            >
              <BottomNavigationAction label="General" icon={<HomeIcon />} />
              <BottomNavigationAction label="Precio" icon={<EuroIcon />} />
              <BottomNavigationAction
                label="Direccion"
                icon={<DirectionsIcon />}
              />
              <BottomNavigationAction label="Fotos" icon={<ImageIcon />} />
              <BottomNavigationAction label="Resumen" icon={<InfoIcon />} />
            </BottomNavigation>
            {generalTab && (
              <Box marginTop={2} border={1}>
                <Stack spacing={2} padding={3}>
                  <Box className="input">
                    <Typography sx={{ marginLeft: "15px" }}>Título</Typography>
  
                    <TextField
                      required
                      id="filled-basic"
                      variant="outlined"
                      placeholder="Título del alojamiento"
                      onChange={(newValue) =>
                        setTituloInput(newValue.target.value)
                      }
                      value={tituloInput}
                    />
                  </Box>
                  <Box className="input">
                    <Typography sx={{ marginLeft: "15px" }}>
                      Descripción
                    </Typography>
                    <TextField
                      required
                      id="filled-textarea-descripcion"
                      placeholder="Servicios, restricciones..."
                      multiline
                      variant="outlined"
                      onChange={(newValue) =>
                        setdescripcionInput(newValue.target.value)
                      }
                      value={descripcionInput}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InfoIcon fontSize="15px" sx={{ pb: 2 }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
  
                  <Box>
                    <Stack direction="row" className="input">
                      <Box>
                        <Typography sx={{ marginLeft: "15px" }}>
                          Capacidad
                        </Typography>
                        <TextField
                          required
                          variant="outlined"
                          size="small"
                          inputProps={{ type: "number", min: 1 }}
                          onChange={(newValue) =>
                            setCapacidades(Number(newValue.target.value))
                          }
                          value={capacidades}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ marginLeft: "15px" }}>
                          Check in
                        </Typography>
                        <TimePicker
                          value={checkInInput}
                          onChange={(newValue) => setCheckInInput(newValue)}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ marginLeft: "15px" }}>
                          Check out
                        </Typography>
                        <TimePicker
                          value={checkOutInput}
                          onChange={(newValue) => {
                            setCheckoutInput(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}
            {precioTab && (
              <Box marginTop={2} border={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  padding={2}
                >
                  <Grid item xs={4}>
                    <Box>
                      <InputLabel htmlFor="input-precio-noche" sx={{ pr: 10 }}>
                        Precio por noche
                      </InputLabel>
                      <Input
                        id="input-precio-noche"
                        type="number"
                        onChange={(newValue) =>
                          setPrecioNoche(Number(newValue.target.value))
                        }
                        value={precioNoche}
                        startAdornment={
                          <InputAdornment position="start">
                            <EuroIcon />
                          </InputAdornment>
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
            {direccionTab && (
              <Box marginTop={2} border={1}>
                <Box p={2}>
                  <Stack spacing={0} padding={0}>
                    <Box className="input">
                      <Typography sx={{ marginLeft: "15px" }}>
                        Dirección del alojamiento
                      </Typography>
                      <TextField
                        id="filled-textarea-direccion"
                        placeholder="Dirección del alojamiento"
                        multiline
                        variant="outlined"
                        fullWidth
                        onChange={(newValue) =>
                          setDireccionInput(newValue.target.value)
                        }
                        value={direccionInput}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DirectionsIcon fontSize="15px" sx={{ pb: 2 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box className="input">
                      <Typography sx={{ marginLeft: "15px", marginTop: "20px" }}>
                        Dirección recogida de llaves
                      </Typography>
                      <TextField
                        id="filled-textarea-direccion"
                        placeholder="Dirección llaves"
                        multiline
                        variant="outlined"
                        fullWidth
                        onChange={(newValue) =>
                          setDireccionLlavesInput(newValue.target.value)
                        }
                        value={direccionLlavesInput}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DirectionsIcon fontSize="15px" sx={{ pb: 2 }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <Box paddingTop={3}>
                      <MapContainer
                        center={[36.72016,-4.42034]}
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
                  </Stack>
                </Box>
              </Box>
            )}
            {imagenesTab && (
              <Box marginTop={2} border={1}>
                <Box p={2}>
                <button id="upload-widget" className="cloudinary-button" onClick={uploadWidget}>
                          Subir imágenes
                        </button>
                  <ImageList sx={{ width: 1 }} cols={3} rowHeight={200}>
                    {images.map((image) => (
                      <ImageListItem key={image.public_id}>
                        <img
                          src={image.url}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              </Box>
            )}
            {descriptionTab && (
              <Box marginTop={2} border={1}>
                <Box p={2}>
                  <Typography variant="h5" color="primary">
                    Resumen{" "}
                  </Typography>
                  <Stack spacing={2} paddingY={2}>
                    <Typography>Título: {tituloInput}</Typography>
                    <Typography>Descripción: {descripcionInput}</Typography>
                    <Typography>Capacidad: {capacidades}</Typography>
                    <Typography>
                      Check-In: {checkInInput.format("HH:mm:ss")}
                    </Typography>
                    <Typography>
                      Check-Out: {checkInInput.format("HH:mm:ss")}
                    </Typography>
                    <Typography>Precio por noche: {precioNoche}</Typography>
                    <Typography>
                      Dirección del alojamiento: {direccionInput}
                    </Typography>
                    <Typography>
                      Dirección de recogida de llaves: {direccionLlavesInput}
                    </Typography>
                  </Stack>
                  <LoadingButton
                    loading={loading}
                    onClick={handleSubmit}
                    sx={{
                      margin: "auto",
                      background: "#92aac0",
                      "&:hover": { color: "#FFF", backgroundColor: "#47adb4" },
                    }}
                  >
                    Confirmar
                  </LoadingButton>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </LocalizationProvider >
      )}
    </>
  );
}

export default ModificarAlojamiento;
