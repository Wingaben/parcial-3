import React , {useContext} from "react";
import Inicio from "./Inicio";
import { BrowserRouter as Router, Route, Routes, Link, UNSAFE_RouteContext } from "react-router-dom";
import CrearAlojamiento from "./CrearAlojamiento";
import MisAlojamientos from "./MisAlojamientos";
import MisReservas from "./MisReservas";
import MiPerfil from "./MiPerfil"
import VerAlojamiento from "./VerAlojamiento";
import ModificarAlojamiento from "./ModificarAlojamiento";
import CreateReserva from "./CreateReserva";
import BuscarAlojamientos from "./BuscarAlojamientos";
import NavBar from "./assets/components/NavBar";
import { useState , useEffect } from "react";
import "dayjs/locale/es";
import EditarMiPerfil from "./EditarMiPerfil";
import MisSolicitudes from "./MisSolicitudes";
import VerPerfil from "./VerPerfil";
import MisMensajes from "./MisMensajes";
import Messenger from "./assets/components/Messenger/Messenger";
import AnadirResena from "./AnadirResena";
import Provider from "./UsuarioContext";
import Payments from "./Payments"

const AppRouter = () => {
    

    return(
        <Router>
            <Provider >
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/Payments" element={<Payments />} />
                    <Route path="/CrearAlojamiento" element={<CrearAlojamiento />} />
                    <Route path="/MisAlojamientos" element={<MisAlojamientos />} />
                    <Route path="/VerAlojamiento/:id" element={<VerAlojamiento />} />
                    <Route
                        path="/ModificarAlojamiento"
                        element={<ModificarAlojamiento />}
                    />
                    <Route path="/MisMensajes" element={<MisMensajes />} />
                    <Route path="/MisReservas" element={<MisReservas />} />
                    <Route path="/MisSolicitudes" element={<MisSolicitudes />} />
                    <Route path="/CreateReserva/:id" element={<CreateReserva />} />
                    <Route path="/BuscarAlojamientos" element={<BuscarAlojamientos />}/>
                </Routes>
            </Provider>
        </Router>
    )
}

export default AppRouter;