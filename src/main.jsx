import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
import tema from "./assets/temas/tema.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";
import AppRouter from "./AppRouter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
    <GoogleOAuthProvider clientId="567698319957-53nqtfjjlte816g3rhm3sqaa425e2o5s.apps.googleusercontent.com">
      <ThemeProvider theme={tema}>
        <AppRouter />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </LocalizationProvider>
);
