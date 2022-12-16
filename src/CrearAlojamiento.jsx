import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import EuroIcon from "@mui/icons-material/Euro";
import DirectionsIcon from "@mui/icons-material/Directions";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import React, { useContext, useState } from "react";
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
import "./assets/css/crearAlojamiento.css";
import "leaflet/dist/leaflet.css";
import Axios from 'axios'
import ImageIcon from '@mui/icons-material/Image';
import { UsuarioContext } from "./UsuarioContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ImageList, ImageListItem } from '@mui/material';

function CrearAlojamiento() {
  const navigate = useNavigate();

  const { user, setUser } = useContext(UsuarioContext);
  const [descripcionInput, setdescripcionInput] = useState("");
  const [tituloInput, setTituloInput] = useState("");
  const [capacidades, setCapacidades] = useState(0);
  const [checkInInput, setCheckInInput] = useState(dayjs());
  const [checkOutInput, setCheckoutInput] = useState(dayjs());

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
  const [imageToRemove, setImageToRemove] = useState(null);

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
    if (tituloInput == "" || direccionInput == "" || direccionLlavesInput == "" || precioNoche == 0 || position[0] == 0 || capacidades == 0 || images.length == 0) {
      alert(
        "Compruebe que ha rellenado los siguientes campos obligatorios: Título, Capacidad, Precio, Dirección, Dirección Llaves, Mapa, Foto."
      );
    } else {
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
      const valoracionAnfitrion = 4;
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

      fetch("http://localhost:8081/api/alojamientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alojamiento),
      }).then(() => {
        setLoading(false);
      });

      navigate("/MisAlojamientos");
    }
  };

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
      </Container>
    </LocalizationProvider >
  );
}

export default CrearAlojamiento;
