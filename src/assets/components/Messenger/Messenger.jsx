import { Paper, Typography } from "@mui/material";
import { MessageLeft, MessageRight } from "./Message";
import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../../../UsuarioContext";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

import dayjs from "dayjs";

export default function Messenger() {
  const { user, setUser } = useContext(UsuarioContext);
  const [data, setData] = useState([]);
  const [messageField, setMessageField] = useState("");
  const idReceptorEnlace = /[^/]*$/.exec(window.location.href)[0];
  const {loading , setLoading } = useState(false)
  

  const usersub = user.sub;

  const ruta =
    "http://localhost:8081/api/mensaje?idReceptor=" +
    usersub +
    "&idRemitente=" +
    idReceptorEnlace;

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

  const handleSubmit = (e) => {
    if (messageField === "") {
      
    } else {

      const idReceptor = idReceptorEnlace
      const idRemitente = usersub;
      const nombreReceptor = user.name; //test case
      const nombreRemitente = user.name;
      const cuerpo = messageField;

      const mensajePost = {
        idReceptor,
        idRemitente,
        nombreReceptor,
        nombreRemitente,
        cuerpo,
      };

      fetch("http://localhost:8081/api/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensajePost),
      }).then((response) => {
        getData();
        setMessage("");
      });
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        style={{
          width: "80vw",
          height: "80vh",
          maxWidth: "500px",
          maxHeight: "700px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
        }}
        zdepth={2}
      >
        <Paper
          id="style-1"
          style={{
            width: "calc( 100% - 20px )",
            margin: 10,
            overflowY: "scroll",
            height: "calc( 100% - 80px )",
          }}
        >
          {(data.length===0 || data===undefined)  && <Typography color="primary" variant="secondary" sx={{margin:"auto" ,marginLeft:"70px"}}>manda un mensaje para empezar la conversacion 👋🏼</Typography>}
          
          {data.map((item) =>
            item.idRemitente === usersub ? (
              <MessageRight
                message={item.cuerpo}
                timestamp={item.timestamp}
                photoURL="" //no hace falta
                displayName={item.nombreReceptor}
                avatarDisp={true}
              />
            ) : (
              <MessageLeft
                message={item.cuerpo}
                photoURL=""
                timestamp={item.timestamp}
                displayName={item.nombreReceptor}
                avatarDisp={true}
              />
            )
          )}
        </Paper>
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            width: "95%",
            margin: "auto",
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Escribe tu mensaje"
            value={messageField}
            sx={{ width: "100%" }}
            variant="standard"
            onChange={(newValue) => setMessageField(newValue.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            endIcon={<SendIcon />}
          >
            Mandar
          </Button>
        </form>
      </Paper>
    </div>
  );
}
