import React from "react";
import { Box } from "@mui/material";

interface Props {
    additionalStyles?: React.CSSProperties | object
}


export default function DottedDivider(props: Props) {
  const { additionalStyles } = props;

  return (
    <Box 
        sx={{ 
            height: "0.063rem",
            backgroundImage: "linear-gradient(to right, #D1E4ED 40%, rgba(255, 255, 255, 0) 20%)",
            backgroundPosition: "top",
            backgroundSize: "8px 1px",
            backgroundRepeat: "repeat-x",
            ...additionalStyles
        }} 
    />
  );
}
