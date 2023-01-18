import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useState } from "react";
import "../css/navBar.css";
import logo from "../img/logo.svg";
import { SvgIcon } from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { UsuarioContext } from "../../UsuarioContext";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import Button from "@mui/material/Button";

import { useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, setUser } = useContext(UsuarioContext);
  const [correo, setCorreo] = useState("");
  const [conexion, setConexion] = useState("");
  const [caducidad, setCaducidad] = useState("");
  const [token, setToken] = useState("");
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();
  const [isPerfilVisible, setIsPerfilVisible] = useState(false);


  var ruta =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCALHOST_URL
      : import.meta.env.VITE_LANDBNB_URL;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const registrarUsuario = (decode) => {
    const id = decode.sub;
    const email = decode.email;
    const conexion = decode.iat;
    const caducidad = decode.exp;
    const nombre = decode.name;
    const usuario = {
      id,
      email,
      conexion,
      caducidad,
      nombre
    };

    fetch(ruta + "/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
  };
  function verPerfil(correo, nombre, conexion, caducidad, token) {
    navigate("/MiPerfil/", {
      state: { co: correo, n: nombre, c: conexion, ca: caducidad, t: token },
    });
  }
  return (
    <AppBar position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <SvgIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <img src={logo} alt="Logo" />
          </SvgIcon>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "white",
              }}
            >
              ParkingNET
            </Typography>
          </Link>

          <SvgIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
            <img src={logo} alt="Logo" />
          </SvgIcon>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            ParkingNET
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <div className="centrar">
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{ borderRadius: 0.5 }}
                  style={{ marginRight: "10px" }}
                >
                  <Typography sx={{ marginRight: "10px" }} color="white">
                    {user.given_name}
                  </Typography>
                  <Avatar src={user.picture} />
                </IconButton>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  var decoded = jwt_decode(credentialResponse.credential);
                  setUser(decoded);
                  registrarUsuario(decoded);
                  sessionStorage.setItem("authSub", JSON.stringify(decoded));
                  setCorreo(decoded.email);
                  setNombre(decoded.name);
                  setConexion(decoded.iat);
                  setCaducidad(decoded.exp);
                  setToken(decoded.sub);
                  setIsPerfilVisible(true);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                auto_select
              />
            )}
            {isPerfilVisible && (
              <Button
                variant="contained"

                onClick={() => verPerfil(correo, nombre, conexion, caducidad, token)}
              >
                Mi Perfil
              </Button>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >


              


              <MenuItem
                onClick={() => {
                  sessionStorage.clear();
                  setIsPerfilVisible(false);
                  googleLogout();

                }}
                component="a"
                href="/"
              >
                <Typography textAlign="center">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
