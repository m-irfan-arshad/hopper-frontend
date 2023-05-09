import React from "react";
import { DateRange as DateRangeIcon } from "@mui/icons-material";
import { 
    TextField, 
    InputLabel,
    styled,
    TextFieldProps,
    Grid,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Controller } from "react-hook-form";
import DropDownSearchComponent from "../components/shared/dropdownSearch";
import { useGetDropdownOptionsHook } from "./hooks"
import { useFormContext, useWatch } from "react-hook-form";
import * as R from 'ramda';
import { BookingSheetConfig } from "../reference";
import { checkFieldForErrors, isFieldVisible } from "./helpers";

interface InputControllerProps {
    id: any,
    title?: string,
    placeholder: string,
    multiline?: boolean,
    maxLength?: number,
    size: number,
    config?: BookingSheetConfig,
    minRows?: number,
    type?: string
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
    config?: BookingSheetConfig,
    onChange?: any
}

interface RadioControllerProps {
    id: any,
    title?: string,
    size: number,
    config?: BookingSheetConfig,
    options: Array<{title: string, value: any}>,
    onChange?: any
}

interface CheckboxControllerProps {
    id: any,
    title?: string,
    size: number,
    config?: BookingSheetConfig,
    onChange?: any
}

interface ConfigWrapperProps {
    children: any, 
    id: string, 
    size: number,
    config?: BookingSheetConfig,
    styles?: object
}

const helperTextProps = {
    style: { 
        minHeight: "1.3rem",
        marginTop: "0.1rem",
        marginLeft: 0
    },
    component: 'div'
};

export function ConfigWrapper(props: ConfigWrapperProps) {
    const {children, id, size, config, styles} = props;
    const isVisible = !config || isFieldVisible(config, id)
    if (!isVisible) return <></>;
    return(
        <Grid item xs={size} sx={styles ? styles : {}}>
            {children}
        </Grid>
      )
}

const sharedProps = {
    FormHelperTextProps: helperTextProps, 
    InputLabelProps: { shrink: true },
    sx: {
        svg: { 
            height: "1rem",
            width: "1rem"
        },
        width: "100%",
    }
}
  
export function InputController(props: InputControllerProps) {
    const { control, trigger, formState: {errors} } = useFormContext();
    const {id, title, placeholder, multiline, maxLength, size, config, minRows, type} = props;
    const currentValue = maxLength ? useWatch({name: id}) : null
    const numCharacters = currentValue ? currentValue.length : 0;
    const numberOrTextProps = type === "number" ? {
        type: "number", 
        InputProps: {style: {height: "2rem"}, inputProps: {min: 1}},
        sx: {marginLeft: "0.5rem", width: "4.5rem", height: "2rem"}
    } : {
        maxRows: 6, 
    };
    const hasError = checkFieldForErrors(id, errors);
    const helperText = <Box sx={{display: "flex", justifyContent: "space-between"}}>
        <Box>{hasError ? "Required" : ""}</Box>
        <Box>{maxLength ? `${numCharacters}/${maxLength}` : null}</Box>
    </Box>
    
    return <ConfigWrapper id={id} size={size} config={config}><Controller
        name={id}
        control={control}
        render={({ field }) => (
            <TextField 
                {...field}
                {...sharedProps} 
                onClick={()=>trigger(id, { shouldFocus: true })}
                error={hasError}
                inputProps={{ maxLength: maxLength }}
                helperText={helperText}
                id={id} 
                variant="outlined" 
                label={title} 
                autoComplete='off' 
                minRows={minRows}
                multiline={multiline}
                placeholder={placeholder} 
                {...numberOrTextProps}
            />
        )}
      /></ConfigWrapper>
}

export function DateController(props: DateControllerProps) {
    const { control, trigger, formState: {errors} } = useFormContext();
    const {id, title, placeholder, withTime, size, config} = props;
    const hasError = checkFieldForErrors(id, errors);
    const renderInput = ({inputProps, ...restParams}: TextFieldProps) => (
        <TextField 
            {...sharedProps}
            InputLabelProps={{ shrink: true }} 
            error={hasError}
            onClick={()=>trigger(id, { shouldFocus: true })}
            helperText={hasError ? "Required" : " "}
            id={id}
            autoComplete='off'
            inputProps={{
                ...inputProps, 
                placeholder: placeholder,
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
                    {...field}
                    label={title}
                    components={{ OpenPickerIcon: DateRangeIcon }}
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={renderInput}
                /> :  <DesktopDatePicker
                    {...field}
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
                const onChangeFunc = props.onChange ? props.onChange : field.onChange;
                return <DropDownSearchComponent
                        {...field}
                        label={title}
                        labelProperties={labelProperties}
                        id={id}
                        multiple={multiple}
                        options={dropdownData}
                        onChange={onChangeFunc}
                        disabled={isDisabled} 
                        placeholder={placeholder} 
                        additionalStyles={additionalStyles}
                        error={checkFieldForErrors(id, errors)}
                        onClick={()=>trigger(id, { shouldFocus: true })}
                    />
                }}
        /></ConfigWrapper>
}

export function RadioGroupController(props: RadioControllerProps) {
    const { control, trigger, formState: {errors} } = useFormContext();
    const {id, title, size, config, options} = props;

    return <ConfigWrapper id={id} size={size} config={config}><Controller
        name={id}
        control={control}
        render={({ field }) => {
            const onChangeFunc = props.onChange ? props.onChange : field.onChange;
            return <FormControl>
                <FormLabel>{title}</FormLabel>
                <RadioGroup row id={id} {...field} onChange={onChangeFunc}>
                    {options.map((option, index) => <FormControlLabel key={index} control={<Radio />} label={option.title} value={option.value} />)}
                </RadioGroup>
            </FormControl>
        }}
      /></ConfigWrapper>
}

export function CheckboxController(props: CheckboxControllerProps) {
    const { control, trigger, formState: {errors} } = useFormContext();
    const {id, title, size, config} = props;

    return (
        <ConfigWrapper id={id} size={size} config={config} styles={{marginBottom: '1.3rem'}}><Controller
        name={id}
        control={control}
        render={({ field }) => {
            const onChangeFunc = props.onChange ? props.onChange : field.onChange;
            return (<Box sx={{display: 'flex', alignItems: 'center'}}>
                <FormLabel>{title}</FormLabel>
                <Checkbox
                    {...field}
                    checked={field.value}
                    id={id}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={onChangeFunc}
                />
            </Box>
        )}}
      /></ConfigWrapper>
    )
}