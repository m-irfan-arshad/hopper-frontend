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
    multiple?: boolean
    error?: any
    onClick?: any
}

const helperTextProps = {
    style: { minHeight: "1.3rem" }
};

export default function DropDownSearchComponent(props: Props) {
    const {id, disabled, placeholder, additionalStyles, onChange, options, labelProperties, label, multiple, error,  onClick, ...restParams} = props;

    function getOptionLabel(option: Option) {
        const labelArray = labelProperties.map((p) => {
            return option[p]
        });
        if (labelArray.toString().replace(',', '') === '') return ''; //if empty list, set to placeholder

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
            multiple={multiple}
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
            renderInput={(params) => <TextField 
                {...params} label={label} 
                InputLabelProps={{ shrink: true }} 
                placeholder={placeholder} 
                error={error} 
                helperText={error ? "Required" : " "} 
                onClick={onClick}
                FormHelperTextProps={helperTextProps}
                />
        }
      />
    );    
}