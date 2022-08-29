import React from "react";
import {MenuItem, Select, FormControl, Typography} from "@mui/material";

interface MenuItem {
    value: string
    id: string
}

interface Props {
    menuItems: MenuItem[]
    additionalMenuItemText: string
    selectId: string
    additionalStyles?: React.CSSProperties
}

export default function DropDownComponent(props: Props) {
    const {menuItems, additionalMenuItemText, selectId, additionalStyles} = props;

    const defaultStyles = {
        color: "black.main",
        height: "2rem",
        borderRadius: "none",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "blue.light",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { 
            borderColor: "blue.light"
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
                <React.Fragment>{additionalMenuItemText} {value}</React.Fragment>
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