import React from "react";
import {MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";

interface MenuItem {
    value: string
    id: string
}

interface Props {
    menuItems: MenuItem[]
    title: string
    selectId: string
    additionalStyles?: React.CSSProperties
    onChange: (value: any) => void
    value: any,
    multiple?: boolean
}

export default function DropDownComponent(props: Props) {
    const {menuItems, title, selectId, additionalStyles, onChange, value, multiple} = props;

    const defaultStyles = {
        color: "black.main",
        height: "2.5rem",
        borderRadius: "none",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray.main",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { 
            borderColor: "gray.main"
        },
        svg: {
            color: "blue.main"
        }
    };
    
    return (
        <Select
            value={multiple ? value.split(", ") : value}
            id={selectId}
            multiple={multiple}
            renderValue={(value: any) => (
                <Typography variant="body2">{title} {multiple ? value.join(", ") : value}</Typography>
            )}
            sx={{
                ...defaultStyles,
                ...additionalStyles
            }}
            onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        >
            {
                menuItems.map((item, index) => (
                    <MenuItem key={index} value={item.value} sx={{fontSize: "0.688rem"}}>{item.value}</MenuItem>
                ))
            }
        </Select>
    );
}