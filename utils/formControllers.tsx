import React from "react";
import { DateRange as DateRangeIcon } from "@mui/icons-material";
import { 
    TextField, 
    InputLabel,
    styled,
    TextFieldProps
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Controller } from "react-hook-form";
import DropDownSearchComponent from "../components/shared/dropdownSearch";
import { useGenericQueryHook } from "./hooks"
import { useFormContext, useWatch } from "react-hook-form";

interface InputControllerProps {
    id: any,
    title?: string,
    placeholder?: string
    multiline?: boolean
    maxLength? : number
    minRows?: number
}

interface DateControllerProps {
    id: any,
    title?: string,
    placeholder: string,
    withTime?: boolean
}

interface DropDownSearchOption {
    [key: string]: string
    fhirResourceId?: any
}

interface DropDownSearchControllerProps {
    id: any,
    title?: string,
    disabled?: boolean,
    placeholder: string,
    additionalStyles?: React.CSSProperties | object,
    options?: DropDownSearchOption[],
    labelProperties: string[],
    queryKey?: string, 
    params?: Array<{field: string, value: string}>, 
    dependency?: string
}
  
export function InputController(props: InputControllerProps) {
    const { control } = useFormContext();
    const {id, title, placeholder, multiline, maxLength, minRows} = props;

    const currentValue = maxLength ? useWatch({name: id}) : null
    const numCharacters = currentValue ? currentValue.length : 0

    return <Controller
        name={id}
        control={control}
        render={({ field }) => (
            <React.Fragment>
                <TextField 
                    InputLabelProps={{ shrink: true }} 
                    inputProps={{ maxLength: maxLength ? maxLength : null}}
                    helperText={maxLength ? `${numCharacters}/${maxLength}` : null}
                    {...field} 
                    multiline={multiline}
                    id={id} 
                    variant="outlined" 
                    label={title} 
                    autoComplete='off' 
                    placeholder={placeholder}
                    minRows={minRows} 
                    maxRows={6}
                    sx={{
                        width: '100%',
                        ".MuiFormHelperText-root": {
                            textAlign: "right",
                            marginRight: 0,
                            marginTop: "0.625rem",
                            fontStyle: "italic"
                          }
                    }} 
                    />
            </React.Fragment>
        )}
      />
}

export function DateController(props: DateControllerProps) {
    const { control } = useFormContext();
    const {id, title, placeholder, withTime} = props;
    const renderInput = ({inputProps, ...restParams}: TextFieldProps) => (
        <TextField 
            InputLabelProps={{ shrink: true }} 
            id={id}
            autoComplete='off'
            inputProps={{
                ...inputProps, 
                placeholder: placeholder,
            }} 
            sx={{
                svg: { 
                    height: "1rem",
                    width: "1rem"
                },
                width: "100%"
            }} 
            {...restParams} 
        />
    )

    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                {withTime ? <DateTimePicker
                    label={title}
                    components={{ OpenPickerIcon: DateRangeIcon }}
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={renderInput}
                /> :  <DesktopDatePicker
                    label={title}
                    components={{ OpenPickerIcon: DateRangeIcon }}
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={renderInput}
                />}
            </React.Fragment>
        )}
    />
}

export function DropDownSearchController(props: DropDownSearchControllerProps) {
    const { control, getValues } = useFormContext();
    const {id, title, disabled, placeholder, options, labelProperties, additionalStyles, queryKey, params, dependency} = props;
    const paramString = params ?  '?' + params?.map(p => `${p.field}=${getValues(p.value)}`).join('&') : ''
    const isDisabled = dependency ? !getValues(dependency) : disabled;
    
    const { data: dropdownData = [] } = (queryKey && !isDisabled) ? useGenericQueryHook({queryKey: queryKey, paramString: paramString, dependency: dependency ? getValues(dependency) : undefined}) : {data: options}

    return <Controller
            name={id}
            control={control}
            render={({ field }) => {
                return (<React.Fragment>
                        <DropDownSearchComponent
                            label={title}
                            value={field.value}
                            labelProperties={labelProperties}
                            id={id}
                            options={dropdownData}
                            onChange={field.onChange}
                            disabled={isDisabled} 
                            placeholder={placeholder} 
                            additionalStyles={{...additionalStyles}}
                        />
                    </React.Fragment>)
            }}
        />
}