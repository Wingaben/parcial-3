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

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, setUser } = useContext(UsuarioContext);

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
    const nombre = decode.given_name;
    const apellidos = decode.family_name;
    const usuario = {
      id,
      email,
      nombre,
      apellidos,
    };

    fetch(ruta + "/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
  };

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
              LANDBNB
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
            LANDBNB
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
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                auto_select
              />
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
                component={Link}
                to="/MiPerfil"
                onClick={() => handleCloseUserMenu()}
              >
                <Typography textAlign="center">Mi perfil</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/MisMensajes"
                onClick={() => handleCloseUserMenu()}
              >
                <Typography textAlign="center">Mis mensajes</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/CrearAlojamiento"
                onClick={() => handleCloseUserMenu()}
              >
                <Typography textAlign="center">Añadir alojamiento</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/MisAlojamientos"
                onClick={() => handleCloseUserMenu()}
              >
                <Typography textAlign="center">Mis alojamientos</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/MisReservas"
                onClick={() => handleCloseUserMenu()}
              >
                <Typography textAlign="center">Mis reservas</Typography>
              </MenuItem>

              <MenuItem
                component={Link}
                to="/MisSolicitudes"
                onClick={() => handleCloseUserMenu()}
              >
                <Typography textAlign="center">Mis solicitudes</Typography>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  sessionStorage.clear();
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
