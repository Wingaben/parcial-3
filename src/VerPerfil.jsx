import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Container, Box, Typography, Grid, Rating } from "@mui/material";
import { Image } from "mui-image";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import CakeIcon from "@mui/icons-material/Cake";
import StarIcon from "@mui/icons-material/Star";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { UsuarioContext } from "./UsuarioContext";
import { useNavigate } from "react-router-dom";

function MiPerfil() {
  const { user, setUser } = useContext(UsuarioContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const idUsuario = /[^/]*$/.exec(window.location.href)[0];

  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;

  const getData = () => {
    fetch(ruta + "/api/usuarios/" + idUsuario, {
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
          <Typography variant="h4" color="secondary">
            {" "}
            Perfil de {data.nombre}
          </Typography>
          <Box>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
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
                    <PersonPinIcon />
                    <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                      {data.nombre != undefined
                        ? data.nombre + " " + data.apellidos
                        : "El usuario aun no ha completado su informaci??n"}
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
                    <CakeIcon />
                    {data.fechaNacimiento ? (
                      <div>
                        <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                          {data.fechaNacimiento}
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                        El usuario a??n no ha completado su informaci??n
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 1,
                      width: "100%",
                    }}
                  >
                    <StarIcon />
                    <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                      Valoracion del anfitri??n:
                    </Typography>
                    <Rating value={data.valoracion ?? 0} readOnly />
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
                {data.telefono ? (
                  <div>
                    <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                      {data.telefono}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                    El usuario a??n no ha completado su informaci??n
                  </Typography>
                )}
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
                {data.direccion ? (
                  <div>
                    <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                      {data.direccion}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="h6" sx={{ paddingLeft: 2 }}>
                    El usuario a??n no ha completado su informaci??n
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: 1,
                  width: "100%",
                }}
              ></Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default MiPerfil;
