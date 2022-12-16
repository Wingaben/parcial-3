import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/system";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

function Payments() {
    const { state } = useLocation();
    const { dataRow, e } = state;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    function modificarReserva(dataR, status) {
        setLoading(true);
        const fechaEntrada = dataR.fechaEntrada;
        const fechaSalida = dataR.fechaSalida;
        const idAnfitrion = dataR.idAnfitrion
        const idAlojamiento = dataR.idAlojamiento;
        const idHuesped = dataR.idHuesped;
        const tituloAlojamiento = dataR.tituloAlojamiento;
        const estado = status;
        const reservaModificada = {
            fechaEntrada,
            fechaSalida,
            idAnfitrion,
            idHuesped,
            idAlojamiento,
            tituloAlojamiento,
            estado
        };
        fetch("http://localhost:8081/api/reservas/" + dataR.id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservaModificada),
        }).then(() => {
            setLoading(false);
        });
        navigate("/MisReservas");
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
                                        value: "13.99"
                                    }
                                }
                            ]
                        });
                    }}
                    onApprove={async (data, actions) => {
                        const details = await actions.order.capture();
                        const name = details.payer.name.given_name;
                        alert("Transacción completada por " + name);
                        
                    }}
                />
            </PayPalScriptProvider>
            <LoadingButton
                            loading={loading}
                            onClick={() => modificarReserva(dataRow, e)}
                            sx={{
                                margin: "auto",
                                background: "#92aac0",
                                "&:hover": { color: "#FFF", backgroundColor: "#47adb4" },
                            }}
                        >
                            Confirmar
                        </LoadingButton>
        </Container>
    );
}

export default Payments;
