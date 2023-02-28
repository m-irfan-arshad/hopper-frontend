import React from "react";
import {MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import { caseFilterInterface } from "../../reference";


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
}

export default function MultiSelectDropDown(props: Props) {
    const {menuItems, title, selectId, additionalStyles, onChange, value} = props;

    const defaultStyles = {
        color: "black.main",
        height: "2.5rem",
        position: "relative",
        maxWidth: '25rem',
        marginRight: '.625rem',
        top: '.15rem',
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0000003B',
          },
        ".MuiSelect-select": {
            display: 'flex',
            alignItems: 'center',
        },
        ".MuiTypography-root": {
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
    };
    
    return (
        <Select
            value={value}
            id={selectId}
            data-testid={selectId}
            multiple
            renderValue={(value: any) => (
                <Typography variant="body2">{title} {value.map((filter: caseFilterInterface)  => filter.value).join(", ")}</Typography>
            )}
            sx={{
                ...defaultStyles,
                ...additionalStyles
            }}
            onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        >
            {
                menuItems.map((item, index) => (
                    //@ts-ignore - necessary to load object into value
                    <MenuItem key={index} value={item} sx={{fontSize: "0.825rem"}}>{item.value}</MenuItem>
                ))
            }
        </Select>
    );
}