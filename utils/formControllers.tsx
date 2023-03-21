import React from "react";
import { DateRange as DateRangeIcon } from "@mui/icons-material";
import { 
    TextField, 
    InputLabel,
    styled,
    TextFieldProps,
    Grid,
    Typography
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Controller } from "react-hook-form";
import DropDownSearchComponent from "../components/shared/dropdownSearch";
import { useGetDropdownOptionsHook } from "./hooks"
import { useFormContext, useWatch } from "react-hook-form";
import * as R from 'ramda';
import { BookingSheetConfig } from "../reference";
import { checkFieldForErrors, getPathFromId, isFieldVisible } from "./helpers";
import { blue } from "@mui/material/colors";

interface InputControllerProps {
    id: any,
    title?: string,
    placeholder: string,
    multiline?: boolean,
    maxLength?: number,
    size: number,
    config?: BookingSheetConfig
}

interface DateControllerProps {
    id: any,
    title?: string,
    placeholder: string,
    withTime?: boolean,
    size: number,
    config?: BookingSheetConfig
}

interface DropDownSearchOption {
    [key: string]: string
    fhirResourceId?: any
}

interface DropDownSearchControllerProps {
    id: any,
    title: string,
    disabled?: boolean,
    placeholder: string,
    additionalStyles?: React.CSSProperties | object,
    options?: DropDownSearchOption[],
    labelProperties: string[],
    queryKey?: string, 
    params?: Array<{field: string, value: string}>, 
    dependency?: string,
    multiple?: boolean,
    size: number,
    config?: BookingSheetConfig
}

interface ConfigWrapperProps {
    children: any, 
    id: string, 
    size: number,
    config?: BookingSheetConfig
}

const helperTextProps = {
    style: { 
        minHeight: "1.3rem",
        marginTop: "0.1rem",
        marginLeft: 0
    },
    component: 'div'
};

function ConfigWrapper(props: ConfigWrapperProps) {
    const {children, id, size, config} = props;
    const isVisible = isFieldVisible(config, id)
    if (!isVisible) return <></>;
    return(
        <Grid item xs={size}>
            {children}
        </Grid>
      )
}
  
export function InputController(props: InputControllerProps) {
    const { control, trigger, formState: {errors} } = useFormContext();
    const {id, title, placeholder, multiline, maxLength, size, config} = props;
    const currentValue = maxLength ? useWatch({name: id}) : null
    const numCharacters = currentValue ? currentValue.length : 0
    const hasError = checkFieldForErrors(id, errors);
    const helperText = <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>{hasError ? "Required" : ""}</div>
        <div>{maxLength ? `${numCharacters}/${maxLength}` : null}</div>
    </div>
    
    return <ConfigWrapper id={id} size={size} config={config}><Controller
        name={id}
        control={control}
        render={({ field }) => (
            <React.Fragment>
                <TextField 
                    {...field} 
                    onClick={()=>trigger(id, { shouldFocus: true })}
                    error={hasError}
                    InputLabelProps={{ shrink: true }} 
                    inputProps={{ maxLength: maxLength }}
                    helperText={helperText}
                    FormHelperTextProps={helperTextProps}
                    id={id} 
                    variant="outlined" 
                    label={title} 
                    autoComplete='off' 
                    placeholder={placeholder} 
                    multiline={multiline} 
                    maxRows={6}
                    sx={{width: "100%"}}
                />
            </React.Fragment>
        )}
      /></ConfigWrapper>
}

export function DateController(props: DateControllerProps) {
    const { control, trigger, formState: {errors} } = useFormContext();
    const {id, title, placeholder, withTime, size, config} = props;
    const hasError = checkFieldForErrors(id, errors);
    const renderInput = ({inputProps, ...restParams}: TextFieldProps) => (
        <TextField 
            InputLabelProps={{ shrink: true }} 
            error={hasError}
            onClick={()=>trigger(id, { shouldFocus: true })}
            helperText={hasError ? "Required" : " "}
            FormHelperTextProps={helperTextProps}
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
                width: "100%",
            }} 
            {...restParams} 
        />
    )

    return <ConfigWrapper id={id} size={size} config={config}><Controller
        name={id}
        control={control}
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
    /></ConfigWrapper>
}

export function DropDownSearchController(props: DropDownSearchControllerProps) {
    const { control, getValues, trigger, formState: {errors} } = useFormContext();
    const {id, title, disabled, placeholder, options, labelProperties, additionalStyles, queryKey, params, dependency, multiple, size, config} = props;
    const paramString = params ?  '&' + params?.map(p => `${p.field}=${getValues(p.value)}`).join('&') : ''
    const isDisabled = dependency ? !getValues(dependency) : disabled;
    
    const { data: dropdownData = [] } = (queryKey && !isDisabled) ? useGetDropdownOptionsHook({queryKey: queryKey, paramString: paramString, dependency: dependency ? getValues(dependency) : undefined}) : {data: options}

    return <ConfigWrapper id={id} size={size} config={config}><Controller
            name={id}
            control={control}
            render={({ field }) => {
                return <DropDownSearchComponent
                        label={title}
                        value={field.value}
                        labelProperties={labelProperties}
                        id={id}
                        multiple={multiple}
                        options={dropdownData}
                        onChange={field.onChange}
                        disabled={isDisabled} 
                        placeholder={(!R.isNil(field.value) && !R.isEmpty(field.value)) ? "" : placeholder} 
                        additionalStyles={additionalStyles}
                        error={checkFieldForErrors(id, errors)}
                        onClick={()=>trigger(id, { shouldFocus: true })}
                    />
                }}
        /></ConfigWrapper>
}