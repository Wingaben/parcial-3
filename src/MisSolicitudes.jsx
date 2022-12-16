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

function MisSolicitudes() {
  const [data, setData] = useState([]);
  const [dataOwner , setDataOwner] = useState([]);
  const { user, setUser } = useContext(UsuarioContext);
  const idUser = user.sub;
  const ruta = `${
    "http://localhost:8081/api/reservas?idHuesped=" + idUser
  }`;

  const rutaAnfitrion = `${
    "http://localhost:8081/api/reservas?idAnfitrion=" + idUser + "&estado=pendiente"
  }`;
  const navigate = useNavigate();

  function verAlojamiento(id) {
    navigate("/VerAlojamiento/" + id);
  }

  function verUsuario(id) {
    navigate("/VerPerfil/" + id);
  }

  const getDataInvitado = () => {  //Here grabs all the invitations that the user has sended ( Guest - Huesped )
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

  const getDataAnfitrion= () => {  //Here grabs all the requests that the user has to handle ( Owner - Dueño )
    fetch(rutaAnfitrion, {
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
        setDataOwner(myJson);
        console.log(myJson);
      });
  };

  function modificarReserva(dataRow, e){
    const fechaEntrada = dataRow.fechaEntrada;
    const fechaSalida = dataRow.fechaSalida;
    const idAnfitrion = dataRow.idAnfitrion 
    const idAlojamiento = dataRow.idAlojamiento;
    const idHuesped = dataRow.idHuesped;
    const tituloAlojamiento = dataRow.tituloAlojamiento;
    const estado = e;
    const reservaModificada = {
      fechaEntrada,
      fechaSalida,
      idAnfitrion,
      idHuesped,
      idAlojamiento,
      tituloAlojamiento,
      estado
    };
    fetch("http://localhost:8081/api/reservas/" + dataRow.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservaModificada),
    }).then(() => {
    });
  };

  function borrarReserva(id) {
    const rutaBorrar = `${"http://localhost:8081/api/reservas/" + id}`;
    console.log(rutaBorrar);
    fetch(rutaBorrar, { method: "DELETE" });
  }

  useEffect(() => {
    getDataInvitado();
    getDataAnfitrion();
  }, []);

  return (
    <Container maxWidth="xl">
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
        Solicitudes enviadas
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left">Fecha Entrada</TableCell>
              <TableCell align="left">Fecha Salida</TableCell>
              <TableCell align="left">Estado</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.tituloAlojamiento}
                </TableCell>
                <TableCell align="left">
                  <Button onClick={() => verAlojamiento(row.idAlojamiento)} variant="contained">Ver alojamiento</Button>
                </TableCell>
                <TableCell align="left">{row.fechaEntrada}</TableCell>
                <TableCell align="left">{row.fechaSalida}</TableCell>
                <TableCell align="left">{row.estado[0].toUpperCase() + row.estado.slice(1)}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        Solicitudes recibidas
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell align="left">Fecha Entrada</TableCell>
              <TableCell align="left">Fecha Salida</TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOwner.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">{row.tituloAlojamiento}</TableCell>
                <TableCell align="left">{row.fechaEntrada}</TableCell>
                <TableCell align="left">{row.fechaSalida}</TableCell>
                <TableCell align="left">
                  <Button onClick={() => verUsuario(row.idHuesped)}  variant="contained">Ver Usuario</Button>
                </TableCell>
                <TableCell align="left">
                  <Button variant="contained" onClick={()=>modificarReserva(row,'aceptada')}>Aceptar Solicitud</Button>
                </TableCell>
                <TableCell align="left">
                  <Button variant="contained" color="error" onClick={()=>borrarReserva(row.id)}>
                    Denegar Solicitud
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

export default MisSolicitudes;
