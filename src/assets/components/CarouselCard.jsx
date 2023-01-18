import React from "react";
import "../css/carouselCard.css";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MobileStepper from "@mui/material/MobileStepper";
import { Box, Typography, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import "../css/global.css";
import { useNavigate } from "react-router-dom";
import {
  carouselImage,
  flexBetween,
  fixedBottom,
  carouselDot,
} from "../temas/estilosComunes";

const CarouselCard = ({ location }) => {
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `../VerAlojamiento/${location.id}`;
    navigate(path);
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const maxSteps = location.fotos.length; // so that we know how many dots

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1); // jumps when we click the next arrow
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1); // when we click the back arrow
  };

  const handleStepChange = (step) => {
    setActiveStep(step); // handle swipe change
  };

  return (
    <Box
      className="carouselCard"
      onClick={routeChange}style={{cursor:'pointer'}}
      sx={{
        flexGrow: 1,
        position: "relative",
        padding: "20px",
      }}
    >

      <Box sx={fixedBottom}>
        {location.fotos.length > 1 && (
          <MobileStepper
            sx={{ backgroundColor: "transparent" }}
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                sx={carouselDot}
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
              >
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size="small"
                sx={carouselDot}
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                <KeyboardArrowLeft />
              </Button>
            }
          />
        )}
      </Box>

      <Box sx={flexBetween}>
        <Box sx={{ mt: 2 }} onClick={routeChange} style={{ cursor: "pointer" }}>
          <Typography style={{ fontWeight: 700, color: "#92aac0" }}>
            {" "}
            {location.titulo}
          </Typography>
          <Typography>
            {" "}
            {location.town}
            {location.city} {location.state}, {location.country}
          </Typography>
          <Typography> {location.precio} €/noche</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <React.Fragment>
            <Typography variant="h6" className="centrar">
              {" "}
              {location.valoracionAlojamiento}
              <StarIcon />
            </Typography>
            <Typography variant="h6" className="centrar">
              {" "}
              {location.capacidad}
              <GroupIcon />
            </Typography>
          </React.Fragment>
        </Box>
      </Box>
    </Box>
  );
};

export default CarouselCard;
