import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import CarouselCard from "./CarouselCard";

export default function LocationCards() {
  const [data, setData] = useState([]);
  const ruta = `${"http://localhost:8081/api/alojamientos"}`;

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
        console.log(data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box sx={{ mx: 2 }}>
      <Grid container rowSpacing={3} columnSpacing={3}>
        {data.map((row) => {
          return (
            <Grid key={row.id} xs={12} sm={4} md={4} lg={3} item={true}>
              <CarouselCard location={row} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
