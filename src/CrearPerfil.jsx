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
import Axios from "axios";
import ImageIcon from "@mui/icons-material/Image";
import { UsuarioContext } from "./UsuarioContext";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ImageList, ImageListItem } from "@mui/material";

function CrearPerfil() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(UsuarioContext);
    const [apellidosP, setApellidos] = useState("");
    const [nombreP, setNombre] = useState("");
    const [emailP, setEmail] = useState("");
    const [fechaNacimientoP, setFechaNacimiento] = useState("");
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

    var ruta =
        import.meta.env.MODE === "development"
            ? import.meta.env.VITE_LOCALHOST_URL
            : import.meta.env.VITE_LANDBNB_URL;

    function handleRemoveImg(imgObj) {
        setImageToRemove(imgObj.public_id);
        Axios.delete(ruta + "/" + imgObj.public_id)
            .then(() => {
                setImageToRemove(null);
                setImages((prev) =>
                    prev.filter((img) => img.public_id !== imgObj.public_id)
                );
            })
            .catch((e) => console.log(e));
    }

    function uploadWidget() {
        var myWidget = window.cloudinary.openUploadWidget(
            {
                cloud_name: "dionckchd",
                upload_preset: "xmkbucid",
                tags: ["miniflix"],
                sources: [
                    "local",
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
                    "unsplash",
                ],
            },
            (error, result) => {
                if (!error && result && result.event == "success") {
                    setImages((prev) => [
                        ...prev,
                        { url: result.info.url, id: result.info.public_id },
                    ]);
                }
            }
        );
        myWidget.open();
    }

    const handleSubmit = (e) => {
        if (
            nombreP == "" ||
            apellidosP == "" ||
            emailP == "" ||
            fechaNacimientoP == "" ||
            images.length == 0
        ) {
            alert(
                "Compruebe que ha rellenado los siguientes campos obligatorios."
            );
        } else {
            setLoading(true);
            const nombre = nombreP;
            const apellidos = apellidosP;
            const email = emailP;
            const fechaNacimiento = fechaNacimientoP;
            const fotos = images;
            const perfil = {
                nombre,
                apellidos,
                email,
                fechaNacimiento,
                fotos
            };

            fetch(ruta + "/api/perfiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(perfil),
            }).then(() => {
                setLoading(false);
            });

            navigate("/");
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
                        CREAR PERFIL
                    </Typography>
                    <BottomNavigation
                        showLabels
                        value={tabId}
                        onChange={(event, newValue) => {
                            setTabId(newValue);
                            if (newValue === 0) {
                                setDescriptionTab(false);
                                setImagenesTab(false);
                                setGeneralTab(true);
                            } else if (newValue === 1) {
                                setDescriptionTab(false);
                                setImagenesTab(true);
                                setGeneralTab(false);
                            } else if (newValue === 2) {
                                setDescriptionTab(true);
                                setImagenesTab(false);
                                setGeneralTab(false);
                            }
                        }}
                        sx={{ border: 1, justifyContent: "space-between" }}
                    >
                        <BottomNavigationAction label="General" icon={<HomeIcon />} />
                        <BottomNavigationAction label="Fotos" icon={<ImageIcon />} />
                        <BottomNavigationAction label="Resumen" icon={<InfoIcon />} />
                    </BottomNavigation>
                    {generalTab && (
                        <Box marginTop={2} border={1}>
                            <Stack spacing={2} padding={3}>
                                <Box className="input">
                                    <Typography sx={{ marginLeft: "15px" }}>Nombre</Typography>
                                    <TextField
                                        required
                                        id="filled-basic"
                                        variant="outlined"
                                        placeholder="Nombre"
                                        onChange={(newValue) =>
                                            setNombre(newValue.target.value)
                                        }
                                        value={nombreP}
                                    />
                                </Box>
                                <Box className="input">
                                    <Typography sx={{ marginLeft: "15px" }}>Apellidos</Typography>
                                    <TextField
                                        required
                                        id="filled-basic"
                                        variant="outlined"
                                        placeholder="Apellidos"
                                        onChange={(newValue) =>
                                            setApellidos(newValue.target.value)
                                        }
                                        value={apellidosP}
                                    />
                                </Box>
                                <Box className="input">
                                    <Typography sx={{ marginLeft: "15px" }}>Email</Typography>
                                    <TextField
                                        required
                                        id="filled-basic"
                                        variant="outlined"
                                        placeholder="Email"
                                        onChange={(newValue) =>
                                            setEmail(newValue.target.value)
                                        }
                                        value={emailP}
                                    />
                                </Box>
                                <Box className="input">
                                    <Typography sx={{ marginLeft: "15px" }}>Fecha de nacimiento</Typography>
                                    <TextField
                                        required
                                        id="filled-basic"
                                        variant="outlined"
                                        placeholder="Fecha de nacimiento"
                                        onChange={(newValue) =>
                                            setFechaNacimiento(newValue.target.value)
                                        }
                                        value={fechaNacimientoP}
                                    />
                                </Box>
                            </Stack>

                        </Box>

                    )}
                    {imagenesTab && (
                        <Box marginTop={2} border={1}>
                            <Box p={2}>
                                <Button
                                    id="upload-widget"
                                    variant="contained"
                                    onClick={uploadWidget}
                                >
                                    Subir imágenes
                                </Button>
                                <ImageList sx={{ width: 1 }} cols={3} rowHeight={200}>
                                    {images.map((image) => (
                                        <ImageListItem key={image.public_id}>
                                            <img src={image.url} />
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
                                    <Typography>Nombre: {nombreP}</Typography>
                                    <Typography>Apellidos: {apellidosP}</Typography>
                                    <Typography>Email: {emailP}</Typography>
                                    <Typography>Fecha de nacimiento: {fechaNacimientoP}</Typography>
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
        </LocalizationProvider>
    );
}

export default CrearPerfil;
