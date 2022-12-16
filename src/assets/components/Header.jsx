import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import EmailIcon from '@mui/icons-material/Email';
import Fab from "@mui/material/Fab"

export default function Header() {
    const navigation = useNavigate()
    const [toggle, setToggle] = useState(false)
    const [signedIn, setSignedIn] = useState(false)

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            setSignedIn(true)
        } else {
            setSignedIn(false)
        }
    });

    const desconectarClick = () => {
        auth.signOut();
        navigation(`/`)
    }

    const perfilClick = () => {
        navigation(`/usuarios/${auth.currentUser?.uid}`)
    }

    const usuariosClick = () => {
        navigation(`/usuarios`)
    }
    const reservasClick = () => {
        navigation(`/reservas`)
    }

    const crearReservaClick = () => {
        navigation("/newReserva")
    }

    const logoClick = () => {
        navigation(`/`)
    }

    const signInClick = () => {
        navigation(`/iniciarSesion`)
    }

    const toggleNav = () => {
        setToggle(!toggle)
    }

    const messagesClick = () => {
        navigation(`/messages/${auth.currentUser?.uid}`);
    }

    return (
        <nav className='bg-blue-500'>
            <div className='flex flex-row justify-between items-center'>
                {/* Lado izquierdo */}
                <div className='text-xl font-title basis-1/4 py-3 mx-10 md:mx-20 cursor-pointer hover:text-white' onClick={logoClick}>RideAlong</div>
                {/* Lado derecho */}
                <div className='basis-3/4 py-3 px-20 hidden md:block'>
                    {
                        signedIn ?
                            <ul className='list-none flex flex-row justify-between items-center'>
                                <li onClick={perfilClick} className='px-3 cursor-pointer hover:text-white'>Perfil</li>
                                <li onClick={desconectarClick} className='px-3 cursor-pointer hover:text-red-800'>Desconectar</li>
                                <li onClick={messagesClick} className='px-3 cursor-pointer hover:text-white'>
                                </li>
                            </ul>
                            :
                            <ul className='list-none flex flex-row justify-between items-center'>
                                <li onClick={usuariosClick} className='px-3 cursor-pointer hover:text-white'>Usuarios</li>
                                <li onClick={reservasClick} className='px-3 cursor-pointer hover:text-white'>Reservas</li>
                                <li onClick={signInClick} className='px-3 cursor-pointer hover:text-white'>Iniciar Sesión</li>
                            </ul>
                    }

                </div>
                {/* mobile menu */}

                {toggle ?
                    <button onClick={toggleNav} className='mx-10 md:hidden'>
                        <div className="space-y-2">
                            <span className="block w-7 h-1 bg-gray-600"></span>
                            <span className="block w-7 h-1 bg-gray-600"></span>
                            <span className="block w-7 h-1 bg-gray-600"></span>
                        </div>
                    </button>
                    :
                    <button onClick={toggleNav} className='mx-10 md:hidden'>
                        <div className="space-y-2">
                            <div className="w-7 h-0.5 bg-gray-600"></div>
                            <div className="w-7 h-0.5 bg-gray-600"></div>
                            <div className="w-7 h-0.5 bg-gray-600"></div>
                        </div>
                    </button>
                }
            </div>
            {toggle ?
                <div className='basis-3/4 py-3 px-10 bg-blue-300'>
                    {
                        signedIn ?
                            <ul className='grid justify-items-center'>
                                <li onClick={perfilClick} className='cursor-pointer my-3 hover:text-white'>Perfil</li>
                                <li onClick={desconectarClick} className='cursor-pointer my-3 hover:text-red-800'>Desconectar</li>
                            </ul>
                            :
                            <ul className='grid justify-items-center'>
                                <li onClick={usuariosClick} className='cursor-pointer my-3'>Usuarios</li>
                                <li onClick={reservasClick} className=' cursor-pointer my-3'>Reservas</li>
                                <li onClick={signInClick} className='cursor-pointer my-3'>Iniciar Sesión</li>
                            </ul>
                    }
                </div>
                :
                null
            }
        </nav>
    )
}
