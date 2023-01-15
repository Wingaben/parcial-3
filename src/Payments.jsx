import React, { useState, useContext } from "react";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { UsuarioContext } from "./UsuarioContext";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

function Payments() {
  const { state } = useLocation();
  const { dataRow, e } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { user, setUser } = useContext(UsuarioContext);
  const [message , setMessage] = useState("")

  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;

  function modificarReserva(dataR, status) {
    setLoading(true);
    const fechaEntrada = dataR.fechaEntrada;
    const fechaSalida = dataR.fechaSalida;
    const idAnfitrion = dataR.idAnfitrion;
    const idAlojamiento = dataR.idAlojamiento;
    const idHuesped = dataR.idHuesped;
    const tituloAlojamiento = dataR.tituloAlojamiento;
    const correoHuesped = dataR.correoHuesped;
    const precioTotal = dataR.precioTotal;
    const estado = status;
    const reservaModificada = {
      fechaEntrada,
      fechaSalida,
      idAnfitrion,
      idHuesped,
      idAlojamiento,
      tituloAlojamiento,
      correoHuesped,
      precioTotal,
      estado,
    };
    fetch(ruta + "/api/reservas/" + dataR.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservaModificada),
    }).then(() => {
      setLoading(false);
    });
    // navigate(-1);
  }

  const mandarCorreo = () => {
    const recipient = user.email;
    const subject = "¡Felicidades, has completado tu pago en Landbnb!";
    const nombre = user.name;
    const titulo = "Has reservado: " + dataRow.tituloAlojamiento;
    const direccion = "Fecha entrada: " + dataRow.fechaEntrada;
    const correo = {
      recipient,
      subject,
      nombre,
      titulo,
      direccion,
    };
    fetch(ruta + "/mandarCorreo/exito", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(correo),
    }).then(() => {
      console.log(correo);
      console.log("hecho");
    });
  };

  const alertFunc = (msg) => {
    setIsAlertVisible(true);
        setMessage(msg);
  };

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
        Pagar Alojamiento
      </Typography>
      <PayPalScriptProvider>
        <PayPalButtons
          fundingSource="paypal"
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: dataRow.precioTotal ,
                    currency: "EUR",
                  },
                },
              ],
            });
          }}
          
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            const name = details.payer.name.given_name;
            modificarReserva(dataRow, e);
            mandarCorreo();
            alertFunc("Tu pago ha sido confirmado. ¡Gracias por usar Landbnb!");
          }}

          onCancel = {  (data, actions) => {
            alert("¡Vaya! Parece que has dejado el pago a medias...")
          }}
        />
      </PayPalScriptProvider>
      
      {isAlertVisible && (
        <Alert
          sx={{
            position: "absolute",
            left: "17px",
            bottom: "30px",
            width: "900px",
          }}
          action={
            <Button
              onClick={() => {
                navigate(-1);
              }}
              sx={{
                background: "#92aac0",
                "&:hover": { color: "#FFF", backgroundColor: "#47adb4" },
              }}
              size="small"
            >
              Volver
            </Button>
          }
        >
          
          {message}
        </Alert>
      )}
    </Container>
  );
}

export default Payments;
