import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Container, Box, Typography, Grid, Rating , TextField } from "@mui/material";
import { Image } from "mui-image";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import CakeIcon from "@mui/icons-material/Cake";
import StarIcon from "@mui/icons-material/Star";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { UsuarioContext } from "./UsuarioContext";
import { useNavigate } from "react-router-dom";

function EditarMiPerfil() {
  const { user, setUser } = useContext(UsuarioContext);
  const [ data, setData ] = useState([]);
  const navigate = useNavigate();

  const [nombreInput, setNombreInput] = useState("");
  const [apellidosInput, setApellidosInput] = useState("");
  const [fechaNacimientoInput, setFechaNacimientoInput] = useState("");
  const [telefonoInput, setTelefonoInput] = useState("");
  const [direccionInput, setDireccionInput] = useState("");

  var ruta = (import.meta.env.MODE==='development' ? import.meta.env.VITE_LOCALHOST_URL : import.meta.env.VITE_LANDBNB_URL);

  const getData = () => {
    fetch(ruta + "/api/usuarios/" + user.sub, {
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
        setNombreInput(myJson.nombre);
        setApellidosInput(myJson.apellidos);
        setFechaNacimientoInput(myJson.fechaNacimiento);
        setTelefonoInput(myJson.telefono);
        setDireccionInput(myJson.direccion);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  function volverPerfil() {
    navigate("/MiPerfil");
  }

  function confirmarCambios() {
    const email = user.email;
    const nombre = nombreInput;
    const apellidos = apellidosInput;
    const fechaNacimiento = fechaNacimientoInput;
    const direccion = direccionInput;
    const telefono = telefonoInput;
    const id = user.sub;
    const valoracion = data.valoracion;

    const usuario = {
      id,
      nombre,
      apellidos,
      fechaNacimiento,
      email,
      valoracion,
      direccion,
      telefono,
    };

    fetch(ruta + "/api/usuarios/" + user.sub, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    }).then(() => {
    });

    volverPerfil();
  }

  return (
    <Container>
      <Box
        sx={{
          borderRadius: 2,
          margin: "auto",
          width: "70vw",
          marginTop: "20px",
          background: "rgba(16, 75, 96, 0.21)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(7.3px)",
          WebkitBackdropFilter: "blur(7.3px)",
          border: "1px solid rgba(16, 75, 96, 0.3)",
        }}
      >
        <Stack spacing={3} p={3}>
          <Typography variant="h5"
            noWrap
            color="primary"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".15rem",
            }}>
            Mi perfil
          </Typography>
          <Box>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item xs={4}>
                <Image
                  width={270}
                  style={{ borderRadius: 16, aspectRatio: 3 / 2 }}
                  src={user.picture}
                  showLoading
                />
              </Grid>
              <Grid item xs={8}>
                <Stack paddingTop={3}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 1,
                      width: "100%",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <PersonPinIcon
                        sx={{  mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Nombre"
                        placeholder="Juan Miguel"
                        variant="standard"
                        onChange={(newValue) =>
                          setNombreInput(newValue.target.value)
                        }
                        value={nombreInput}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Apellidos"
                        placeholder="Díaz Pérez"
                        variant="standard"
                        onChange={(newValue) =>
                          setApellidosInput(newValue.target.value)
                        }
                        value={apellidosInput}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 1,
                      width: "100%",
                    }}
                  >

                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                      <CakeIcon
                        sx={{  mr: 1, my: 0.5 }}
                      />
                      <TextField
                        id="input-with-sx"
                        label="Fecha de nacimiento"
                        placeholder="2000-01-01"
                        variant="standard"
                        onChange={(newValue) =>
                          setFechaNacimientoInput(newValue.target.value)
                        }
                        value={fechaNacimientoInput}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 3,
                      width: "100%",
                    }}
                  >
                    <StarIcon />
                    <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                      Valoracion del afinitrion :
                    </Typography>
                    <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                      {`${data.valoracion + "/5"}`}
                    </Typography>
                    <Typography variant="subtitle" sx={{ paddingLeft: 2 }}>
                      108 opiniones
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Stack>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 1,
                  width: "100%",
                }}
              >
                <EmailIcon />
                <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                   {data.email}
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
                <LocalPhoneIcon />
                <TextField
                        id="input-with-sx"
                        label="Teléfono"
                        placeholder="+34 678 000 000"
                        variant="standard"
                        onChange={(newValue) =>
                          setTelefonoInput(newValue.target.value)
                        }
                        value={telefonoInput}
                      />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 1,
                  width: "100%",
                }}
              >
                <LocationOnIcon />
                <TextField
                        id="input-with-sx"
                        label="Dirección"
                        placeholder="Calle la Pepa, 17"
                        variant="standard"
                        onChange={(newValue) =>
                          setDireccionInput(newValue.target.value)
                        }
                        value={direccionInput}
                      />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 1,
                  width: "100%",
                }}
              >
                <Button variant="contained" onClick={() => confirmarCambios()}>
                  Confirmar cambios
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default EditarMiPerfil;
