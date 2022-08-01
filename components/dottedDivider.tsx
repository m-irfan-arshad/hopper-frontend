import React from "react";
import { Box } from "@mui/material";

export default function DottedDivider() {

  return (
    <Box 
        sx={{ 
            height: "0.063rem",
            marginTop: "2rem",
            backgroundImage: "linear-gradient(to right, #D1E4ED 40%, rgba(255, 255, 255, 0) 20%)",
            backgroundPosition: "top",
            backgroundSize: "8px 1px",
            backgroundRepeat: "repeat-x",
        }} 
    />
  );
}
