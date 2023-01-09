import React from "react";
import {Autocomplete, TextField} from "@mui/material";

interface Option {
    label: string
    id: number
}

interface Props {
    id: string
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
    onChange: (value: any) => void
    options: Option[]
}

export default function DropDownComponent(props: Props) {
    const {id, disabled, placeholder, additionalStyles, onChange, options, ...restParams} = props;

    const defaultStyles = {
        "& .MuiOutlinedInput-root": {
            paddingY: 0,
            height: "40px",
        },
        "& .MuiInputBase-formControl": {
            fontSize: "0.688rem"
        },
        '& .MuiAutocomplete-input, & .MuiInputLabel-root': {
            fontSize: ".688rem",
        },
        marginTop: "0.313rem"        
    }

    function isOptionEqualToValue(option: Option, value: Option) {
        return option.id === value.id; 
    }
    
    return (
        <Autocomplete
            {...restParams}
            data-testid='autocomplete'
            id={id}
            disableClearable
            isOptionEqualToValue={(option, value) => isOptionEqualToValue(option, value)}
            onChange={(_, data) => onChange(data)}
            options={options}
            disabled={disabled}
            sx={{
                ...defaultStyles,
                ...additionalStyles
            }}
            ListboxProps={{
                style: {
                    fontSize: ".688rem"
                }
            }}
            renderInput={(params) => <TextField {...params} placeholder={placeholder}  />
        }
      />
    );

    //TODO: filter options alphabetically in the API
    
}