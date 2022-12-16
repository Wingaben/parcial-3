import { createTheme } from "@mui/material/styles";

const tema = createTheme({
  palette: {
    primary: {
      main: "#92aac0",
    },
    secondary: {
      main: "#47adb4",
    },
    warning: {
      main: "#EBA447",
    },
    error: {
      main: "#CE4760",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
          padding: "7px 40px",
          textTransform: "unset",
          fontSize: "1rem",
          margin: "5px 5px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#92aac0",
          outline: "none",
          margin: "5px 5px",
          color: "white",
        },
        notchedOutline: {
          borderColor: "#92aac0",
        },
        input: {
          padding: "8.5px 15px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "200px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#92aac0",
        },
      },
    },
  },
});

export default tema;
