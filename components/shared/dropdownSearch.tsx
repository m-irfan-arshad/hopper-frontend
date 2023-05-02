import React from "react";
import {Autocomplete, TextField} from "@mui/material";

interface Option {
    [key: string]: string
    fhirResourceId?: any
}

interface Props {
    id?: string
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
    onChange: (value: any) => void
    labelProperties: string[]
    options: Option[]
    value?: Option | undefined
    label?: string
    multiple?: boolean
    error?: boolean
    onClick?: () => void
}

const helperTextProps = {
    style: { minHeight: "1.3rem", marginTop: "0.1rem", marginLeft: 0 }
};

export default function DropDownSearchComponent(props: Props) {
    const {id, value, disabled, placeholder, additionalStyles, onChange, options, labelProperties, label, multiple, error,  onClick, ...restParams} = props;

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
            value={value}
            data-testid='autocomplete'
            id={id}
            disableClearable
            isOptionEqualToValue={(option, optionValue) => getOptionLabel(option) === getOptionLabel(optionValue)}
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