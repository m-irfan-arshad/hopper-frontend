import React from "react";
import {MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";

interface MenuItem {
    value: string
    id: string
}

interface Props {
    menuItems: MenuItem[]
    selectId: string
    additionalStyles?: React.CSSProperties | object
    onChange: (value: string) => void
    value: string
    placeholder?: string
}

export default function DropDownComponent(props: Props) {
    const {menuItems, selectId, additionalStyles, onChange, value, placeholder} = props;

    const defaultStyles = {
        color: "black.main",
        height: "2.5rem",
        borderRadius: "none",
        ".MuiSelect-select": {
            display: 'flex',
            alignItems: 'center',
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "gray.main",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { 
            borderColor: "gray.main"
        }
    };
    
    return (
        <Select
            value={value ? value : placeholder}
            id={selectId}
            renderValue={          
                value !== "" ? undefined : () => <Typography variant="body2" sx={{color: "gray.dark"}}>{value !== '' ? value : placeholder}</Typography>
            }
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