import { createContext, useState } from "react";

export const UsuarioContext = createContext();


const Provider = ({ children }) => {
    const val = window.sessionStorage.getItem("authSub");

    var valueJSON = null

    try {


        if (val === null || val === undefined) { valueJSON = null } else {
            valueJSON = JSON.parse(val)
        }

    } catch (e) {
        valueJSON = null
    }
    const [user, setCambiarUser] = useState(valueJSON);

    const value = {
        user,
        setUser: (value) => {
            setCambiarUser(value);
            sessionStorage.setItem("authSub", JSON.stringify(user))
        }
    }
    return (
        <UsuarioContext.Provider value={value}>
            {children}
        </UsuarioContext.Provider>
    )
}

// Exportamos by defult nuestro componente Provider, pues lo vamos a usar para proveer nuestro Context en la app
export default Provider;
