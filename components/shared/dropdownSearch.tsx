import React from "react";
import {Autocomplete, TextField} from "@mui/material";

interface Option {
    [key: string]: string
    fhirResourceId?: any
}

interface Props {
    id: string
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
    onChange: (value: any) => void
    labelProperties: string[]
    options: Option[]
    value?: any
}

export default function DropDownSearchComponent(props: Props) {
    const {id, disabled, placeholder, additionalStyles, onChange, options, labelProperties, ...restParams} = props;

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

    function getOptionLabel(option: Option) {
        const labelArray = labelProperties.map((p) => {
            return option[p]
        });
        
        return (labelArray.toString().split(',')).join(' ');
    }
    
    return (
        <Autocomplete
            {...restParams}
            data-testid='autocomplete'
            id={id}
            disableClearable
            isOptionEqualToValue={(option, value) => option.fhirResourceId === value.fhirResourceId}
            getOptionLabel={(option: Option) => getOptionLabel(option)}
            onChange={(_, data) => onChange(data)}
            options={options}
            disabled={disabled}
            sx={{
                ...defaultStyles,
                ...additionalStyles,
                '.MuiTextField-root': {
                    width: '100%'
                }
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