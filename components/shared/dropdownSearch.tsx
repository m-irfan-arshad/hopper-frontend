import React from "react";
import {Autocomplete, TextField} from "@mui/material";

interface Option {
    [key: string]: string
    fhirResourceId: string
}

interface Props {
    id: string
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
    onChange: (value: any) => void
    labelProperty: string
    options: Option[]
}

export default function DropDownComponent(props: Props) {
    const {id, disabled, placeholder, additionalStyles, onChange, options, labelProperty, ...restParams} = props;

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
    
    return (
        <Autocomplete
            {...restParams}
            data-testid='autocomplete'
            id={id}
            disableClearable
            isOptionEqualToValue={(option, value) => option.fhirResourceId === value.fhirResourceId}
            getOptionLabel={(option: Option) => option[labelProperty] || ''}
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
}