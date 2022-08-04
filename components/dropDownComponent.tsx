import React from "react";
import {MenuItem, styled, Select} from "@mui/material";

interface MenuItems {
    value: string
    id: string
}

interface Props {
    fullWidth?: boolean
    menuItems: MenuItems[]
    additionalMenuItemText: string
}

/* 
    formcontrol is used to manage context such as filled/focused/error/required for forms... 
    specifically used for the following components -> FormLabel, FormHelperText Input InputLabel
    since we don't really use those here formcontrol is not providing us with anything 
*/

const StyledMenuItem = styled(MenuItem)({
    fontSize: "0.688rem"
})

export default function DropDownComponent(props: Props) {
   
    return (
        <Select
            renderValue={(value) => (
                <React.Fragment><span style={{fontWeight: "700"}}>{props.additionalMenuItemText}</span> {value}</React.Fragment>
            )}
            defaultValue={props.menuItems[0].value}
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
                props.menuItems.map((item, index) => (
                    <StyledMenuItem key={index} value={item.value}>{item.value}</StyledMenuItem>
                ))
            }
        </Select>
    );
}