import React from "react";
import { DateRange as DateRangeIcon } from "@mui/icons-material";
import { 
    TextField, 
    InputLabel,
    styled
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Controller } from "react-hook-form";
import DropDownSearchComponent from "../components/shared/dropdownSearch";


interface InputControllerProps {
    id: any,
    title?: string,
    placeholder: string
    control: any
}

interface DateControllerProps {
    id: any,
    title?: string,
    placeholder: string
    control: any
}

interface DropDownSearchOption {
    [key: string]: string
    fhirResourceId?: any
}

interface DropDownSearchControllerProps {
    id: any,
    title?: string,
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
    options: DropDownSearchOption[]
    labelProperties: string[]
    control: any
}
  

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "0.688rem"
    },
    marginTop: "0.313rem"
});

export function InputController(props: InputControllerProps) {
    const {id, title, placeholder, control} = props;
    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                <InputLabel htmlFor={id} variant="standard">{title}</InputLabel>
                <StyledTextField {...field} id={id} variant="outlined" autoComplete='off' placeholder={placeholder} sx={{width: '100%'}} />
            </React.Fragment>
        )}
      />
}

export function DateController(props: DateControllerProps) {
    const {id, title, placeholder, control} = props;
    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                <InputLabel htmlFor={id} variant="standard">{title}</InputLabel>
                <DesktopDatePicker
                    components={{ OpenPickerIcon: DateRangeIcon }}
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={({inputProps, ...restParams}) => (
                        <StyledTextField 
                            id={id}
                            autoComplete='off'
                            inputProps={{
                                ...inputProps, 
                                placeholder: placeholder,
                            }} 
                            sx={{
                                svg: { 
                                    height: "0.75rem",
                                    width: "0.75rem"
                                },
                                width: "100%"
                            }} 
                            {...restParams} 
                        />
                    )}
                />
            </React.Fragment>
        )}
    />
}

export function DropDownSearchController(props: DropDownSearchControllerProps) {
    const {id, title, disabled, placeholder, options, labelProperties, additionalStyles, control} = props;

    return <Controller
            name={id}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <React.Fragment>
                    <InputLabel htmlFor={id} variant="standard" >{title}</InputLabel>
                    <DropDownSearchComponent 
                        {...field}
                        labelProperties={labelProperties}
                        id={id}
                        options={options}
                        onChange={field.onChange}
                        disabled={disabled} 
                        placeholder={placeholder} 
                        additionalStyles={{...additionalStyles}}
                    />
                </React.Fragment>
            )}
        />
}