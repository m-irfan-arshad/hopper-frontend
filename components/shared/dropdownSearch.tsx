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
    label?: string
}

export default function DropDownSearchComponent(props: Props) {
    const {id, disabled, placeholder, additionalStyles, onChange, options, labelProperties, label, ...restParams} = props;

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
            isOptionEqualToValue={(option, value) => getOptionLabel(option) === getOptionLabel(value)}
            getOptionLabel={(option: Option) => getOptionLabel(option)}
            onChange={(_, data) => onChange(data)}
            options={options}
            disabled={disabled}
            sx={{
                ...additionalStyles,
                '.MuiTextField-root': {
                    width: '100%'
                },
            }}
            ListboxProps={{
                style: {
                    fontSize: ".875rem"
                }
            }}
            renderInput={(params) => <TextField {...params} label={label} InputLabelProps={{ shrink: true }} placeholder={placeholder}  />
        }
      />
    );    
}