import { Typography, Container, Grid, Rating, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UsuarioContext } from "./UsuarioContext";
import "leaflet/dist/leaflet.css";
import InfoIcon from "@mui/icons-material/Info";
import Stack from "@mui/material/Stack";
import { TimePicker } from "@mui/x-date-pickers";
import InputAdornment from "@mui/material/InputAdornment";
import "./assets/css/crearAlojamiento.css";

function AnadirResena() {
  const { user, setUser } = useContext(UsuarioContext);
  const [ data, setData ] = useState([]);
  const idAlojamiento = /[^/]*$/.exec(window.location.href)[0];
  let navigate = useNavigate();
  const rutaApi = `${"http://localhost:8081/api/alojamientos/"}` + idAlojamiento;

  const [tituloInput, setTituloInput] = useState("");
  const [textoInput, setTextoInput] = useState("");
  const [valoracionInput, setValoracionInput] = useState(0);

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
        })
  }

  function crearResena () {
    const titulo = tituloInput;
    const texto = textoInput;
    const valoracion = valoracionInput;
    const idHuesped = user.sub;
    const fotoHuesped = user.picture;
    const resena = {
    idAlojamiento,
    idHuesped,
    titulo,
    texto,
    valoracion,
    fotoHuesped,
    };

    fetch("http://localhost:8081/api/resena", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resena),
    }).then(() => {
        console.log(resena);
    });

    navigate("/MisReservas");
}

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box marginTop={2} border={1}>
        <Stack spacing={2} padding={3}>
            <form onSubmit={crearResena}>
                <Box className="input">
                    <Typography sx={{ marginLeft: "15px" }}>Título</Typography>
                    <TextField
                    required
                    id="filled-basic"
                    variant="outlined"
                    placeholder="Título de la reseña"
                    onChange={(newValue) =>
                        setTituloInput(newValue.target.value)
                    }
                    value={tituloInput}
                    />
                </Box>
                <Box className="input">
                    <Typography sx={{ marginLeft: "15px" }}>
                    Comentario
                    </Typography>
                    <TextField
                    required
                    id="filled-textarea-descripcion"
                    placeholder="El trato ha sido agradable, la casa estaba muy limpia..."
                    multiline
                    variant="outlined"
                    onChange={(newValue) =>
                        setTextoInput(newValue.target.value)
                    }
                    value={textoInput}
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
                    <Typography sx={{ marginLeft: "15px" }}>
                    Valoración
                    </Typography>
                    <Rating style={{ marginLeft: "20px" }}
                    onChange={(newValue) =>
                        setValoracionInput(Number(newValue.target.value))
                    }
                    value={valoracionInput} required />
                </Box>
                <Box>
                    <button type="submit">
                        Añadir Reseña
                    </button>
                </Box>
            </form>
        </Stack>
    </Box>
  );
}

export default AnadirResena;