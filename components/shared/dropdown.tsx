import React from "react";
import {MenuItem, Select, Typography} from "@mui/material";

interface MenuItem {
    value: string
    id: string
}

interface Props {
    menuItems: MenuItem[]
    title: string
    selectId: string
    additionalStyles?: React.CSSProperties
}

export default function DropDownComponent(props: Props) {
    const {menuItems, title, selectId, additionalStyles} = props;

    const defaultStyles = {
        color: "black.main",
        height: "2rem",
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
            id={selectId}
            defaultValue={menuItems[0].value}
            renderValue={(value) => (
                <Typography variant="body2">{title} {value}</Typography>
            )}
            sx={{
                ...defaultStyles,
                ...additionalStyles
            }}
        >
            {
                menuItems.map((item, index) => (
                    <MenuItem key={index} value={item.value} sx={{fontSize: "0.688rem"}}>{item.value}</MenuItem>
                ))
            }
        </Select>
    );
}