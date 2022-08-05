import React from "react";
import {MenuItem, Select, FormControl} from "@mui/material";

interface MenuItem {
    value: string
    id: string
}

interface Props {
    menuItems: MenuItem[]
    additionalMenuItemText: string
    selectId: string
}

export default function DropDownComponent(props: Props) {
   const {menuItems, additionalMenuItemText, selectId} = props;

    return (
        <Select
            id={selectId}
            defaultValue={menuItems[0].value}
            renderValue={(value) => (
                <React.Fragment><span style={{fontWeight: "700"}}>{additionalMenuItemText}</span> {value}</React.Fragment>
            )}
            sx={{
                fontSize: "0.625rem",
                height: "2rem",
                marginLeft: "0.625rem",
                borderRadius: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "blue.light"
                },
                svg: {
                    color: "blue.main"
                }
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