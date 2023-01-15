import React, { useState, useEffect, useContext } from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/system";
import { UsuarioContext } from "./UsuarioContext";
import { useNavigate } from "react-router-dom";

function MisReservas() {
  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);
  const { user, setUser } = useContext(UsuarioContext);
  const navigate = useNavigate();
  const estadoA = "aceptada";
  const estadoB = "pagada";
  const [today, setToday] = useState(new Date());
  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;

  const rutaA = `${ruta + "/api/reservas/" + user.sub + "?estado=" + estadoA}`;
  const rutaB = `${ruta + "/api/reservas/" + user.sub + "?estado=" + estadoB}`;

  const getData = () => {
    fetch(rutaA, {
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
        setDataA(myJson);
      });
    fetch(rutaB, {
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
        setDataB(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  function borrarReserva(id) {
    const rutaBorrar = `${ruta + "/api/reservas/" + id}`;
    fetch(rutaBorrar, { method: "DELETE" });
    navigate("/");
  }

  function verAlojamiento(id) {
    navigate("/VerAlojamiento/" + id);
  }

  function pagarAlojamiento(row, status) {
    navigate("/Payments/", {
      state: { dataRow: row, e: status },
    });
  }

  function anadirResena(row) {
    navigate("/AnadirResena/" + row.idAlojamiento, {
      state: { dataRow: row },
    });
  }

  function empezarChat(id) {
    navigate("/Chat/" + id);
  }

  return (
    <Container maxWidth="xl">
      <Typography
        variant="h5"
        noWrap
        color="primary"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".15rem",
          textDecoration: "none",
          marginY: "20px",
        }}
      >
        MIS RESERVAS
      </Typography>
      <Typography
        variant="h5"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".15rem",
          color: "#92aac0",
          textDecoration: "none",
          marginY: "20px",
        }}
      >
        Reservas aceptadas
      </Typography>
      <TableContainer component={Paper}>
        {dataA.length === 0 || dataA === undefined ? (
          <Typography
            variant="h5"
            sx={{ margin: 3, fontWeight: 700, color: "gray" }}
          >
            {" "}
            No tienes reservas aceptadas. 😔{" "}
          </Typography>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell align="left">Fecha entrada</TableCell>
                <TableCell align="left">Fecha salida</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataA.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.tituloAlojamiento}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(row.fechaEntrada)}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(row.fechaSalida)}
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      onClick={() => verAlojamiento(row.idAlojamiento)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => pagarAlojamiento(row, "pagada")}
                    >
                      Pagar
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => borrarReserva(row.id)}
                    >
                      Borrar
                    </Button>
                  </TableCell>

                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => empezarChat(row.idAnfitrion)}
                    >
                      Chatear{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Typography
        variant="h5"
        noWrap
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".15rem",
          color: "#92aac0",
          textDecoration: "none",
          marginY: "20px",
        }}
      >
        Reservas pagadas
      </Typography>
      <TableContainer component={Paper}>
        {dataB.length === 0 || dataB === undefined ? (
          <Typography
            variant="h5"
            sx={{ margin: 3, fontWeight: 700, color: "gray" }}
          >
            {" "}
            No tienes reservas pagadas. 💸{" "}
          </Typography>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell align="left">Fecha entrada</TableCell>
                <TableCell align="left">Fecha salida</TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
                <TableCell align="left"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataB.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.tituloAlojamiento}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(row.fechaEntrada)}
                  </TableCell>
                  <TableCell align="left">
                    {formatDate(row.fechaSalida)}
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      onClick={() => verAlojamiento(row.idAlojamiento)}
                    >
                      Ver
                    </Button>
                  </TableCell>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => borrarReserva(row.id)}
                    >
                      Borrar
                    </Button>
                  </TableCell>
                  {today.getTime() > new Date(row.fechaSalida).getTime() &&
                    row.estado !== "valorada" && (
                      <TableCell align="left">
                        <Button
                          variant="contained"
                          onClick={() => anadirResena(row)}
                        >
                          Añadir reseña
                        </Button>
                      </TableCell>
                    )}
                  <TableCell align="left">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => empezarChat(row.idAnfitrion)}
                    >
                      Chatear{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Container>
  );
}

export default MisReservas;
