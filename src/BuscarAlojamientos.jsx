import { CssBaseline, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/system";
import { Grid, Button, Stack } from "@mui/material";
import CarouselCard from "./assets/components/CarouselCard";
import { Navigate, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ReplayIcon from "@mui/icons-material/Replay";

function BuscarAlojamientos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { ubicacion, fechaEntrada, fechaSalida, personas } = state;

  var ruta = (import.meta.env.MODE==='development' ? import.meta.env.VITE_LOCALHOST_URL : import.meta.env.VITE_LANDBNB_URL);

  const getData = () => {
    fetch(ruta + "/api/alojamientos?ubicacion=" + ubicacion +
    "&fechaEntrada=" +
    fechaEntrada +
    "&fechaSalida=" +
    fechaSalida +
    "&capacidad=" +
    personas, {
      method: "GET",
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
        setData(myJson);
        console.log(myJson);
        setLoading(true);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      {!loading && (
        <Container>
          <Box
            sx={{ display: "flex", alignItems: "center", paddingTop: "20%" }}
          >
            <CircularProgress sx={{ alignSelf: "center", margin: "auto" }} />
          </Box>
        </Container>
      )}
      {loading && (
        <Box
          sx={{ display: "flex", flexDirection: "column", height: "inherit" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              height: 100,
              overflowY: "scroll",
            }}
          >
            <Container maxWidth="xl" sx={{ mb: 3 }}>
              <Box sx={{ mx: 2 }}>
                <Grid container rowSpacing={3} columnSpacing={3}>
                  {data.length === 0 || data === undefined ? (
                    <Stack
                      sx={{
                        margin: "auto",
                        paddingTop: "19%",
                        display: "flex",
                      }}
                      gap="40px"
                    >
                      <Typography variant="h4">
                        {" "}
                        No se ha podido encontrar ningun alojamiento 😔{" "}
                      </Typography>

                      <Button
                        variant="contained"
                        color="warning"
                        type="submit"
                        sx={{ paddingTop: "10px", margin: "auto" }}
                        onClick={() => {
                          navigate("/");
                        }}
                        startIcon={<ReplayIcon />}
                      >
                        Buscar de nuevo
                      </Button>
                    </Stack>
                  ) : (
                    data.map((row) => {
                      return (
                        <Grid
                          key={row.id}
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                          item={true}
                        >
                          <CarouselCard location={row} />
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              </Box>
            </Container>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}

export default BuscarAlojamientos;
