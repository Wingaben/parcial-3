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
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/system";
import { UsuarioContext } from "./UsuarioContext";

function MisAlojamientos() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UsuarioContext);

  const ruta = `${
    "http://localhost:8081/api/alojamientos?idAnfitrion=" + user.sub
  }`;

  function verAlojamiento(id) {
    navigate("/VerAlojamiento/" + id);
  }

  const getData = () => {
    fetch(ruta, {
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

  function borrarAlojamiento(id) {
    const rutaBorrar = `${"http://localhost:8081/api/alojamientos/" + id}`;
    console.log(rutaBorrar);
    fetch(rutaBorrar, { method: "DELETE" }).then(window.location.reload(false));
  }

  function modificarAlojamiento(id) {
    navigate("/ModificarAlojamiento", {
      state: { idalojamiento: id },
    });
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
        MIS ALOJAMIENTOS
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell align="left">Dirección</TableCell>
              <TableCell align="left">Dirección Llaves</TableCell>
              <TableCell align="left">Precio</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" onClick={() => verAlojamiento(row.id)}>
                  {row.titulo}
                </TableCell>
                <TableCell align="left">{row.direccion}</TableCell>
                <TableCell align="left">{row.direccionLlaves}</TableCell>
                <TableCell align="left">{row.precio}</TableCell>
                <TableCell align="left">
                  <Button
                    variant="contained"
                    onClick={() => modificarAlojamiento(row.id)}
                  >
                    Modificar
                  </Button>
                </TableCell>
                <TableCell align="left">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => borrarAlojamiento(row.id)}
                  >
                    Borrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default MisAlojamientos;
