import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useState } from "react";
import "../css/navBar.css";
import { SvgIcon } from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { UsuarioContext } from "../../UsuarioContext";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, setUser } = useContext(UsuarioContext);
  const [id, setId] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [email, setEmail] = useState(0);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);

  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const registrarUsuario = (decode) => {
    setId(decode.sub);
    setEmail(decode.email);
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

    fetch("http://localhost:8081/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>

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
              EMTInfo
            </Typography>
          </Link>

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
            EMTInfo
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
                  console.log(decoded);
                  sessionStorage.setItem("authSub", JSON.stringify(decoded))
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
              <MenuItem onClick={() => {
                alert("Timestamp: " + " Usuario: " + email + " Token: " + id)
              }} component="a" href="/">
                <Typography textAlign="center">Log</Typography>
              </MenuItem>
              

              <MenuItem onClick={() => {
                sessionStorage.clear();
                googleLogout()
              }} component="a" href="/">
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
