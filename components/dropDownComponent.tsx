import React from "react";
import { FormControl } from "@mui/material";

interface Props {
    fullWidth?: boolean
    children: React.ReactNode
}

export default function DropDownComponent(props: Props) {

  return (
    <FormControl 
        fullWidth={props.fullWidth}
        sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "blue.light"
                },  
                svg: {
                   color: "blue.main"
                }
            }}
    >
        {props.children}
    </FormControl>
  );
}
