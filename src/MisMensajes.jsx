import { useState, useEffect, useContext } from "react";
import { Container } from "@mui/system";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { UsuarioContext } from "./UsuarioContext";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ChatIcon from '@mui/icons-material/Chat';



function MisMensajes() {
    const [data, setData] = useState([]);
    
    const { user, setUser } = useContext(UsuarioContext);
    const ruta = `${"http://localhost:8081/api/mensaje/" + user.sub 
        }`;
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

    const navigate = useNavigate();
    
    
    const verChat = (id) => {
        navigate("/Chat/" + id);
    }
    

    return (
        user &&
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
                MIS MENSAJES
            </Typography>
            <TableContainer component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align="left">Fecha de la primera iteraccion</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="left">{row.nombreReceptor}</TableCell>
                                <TableCell align="left">{row.timestamp}</TableCell>
                                <TableCell>
                                <Button
                                    variant="contained"
                                    endIcon={<ChatIcon />}
                                    onClick={() => {
                                        if(user.sub===row.idReceptor){
                                            verChat(row.idRemitente)
                                        }else{

                                        verChat(row.idReceptor)}}}
                                >
                                    Chatear
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
export default MisMensajes;