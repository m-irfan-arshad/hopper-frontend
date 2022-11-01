import React, { useState, useEffect, useRef, useCallback } from "react";
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface Props {
    onChange: (value: string) => void
    value: string
    debounceTime?: number
    placeholder?: string
    additionalStyles?: React.CSSProperties | object
}

export default function DebouncedInput(props: Props) {
    const {value: initialValue, debounceTime = 500, onChange, additionalStyles, placeholder} = props;
    const [value, setValue] = useState(initialValue);
  
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    const debounce = (func: Function) => {
      let timer: number | null;
      return function(this: void, ...args: any) {
        const context = this;
        if (timer) clearTimeout(timer);
        timer = window.setTimeout(() => {
          timer = null;
          func.apply(context, args);
        }, debounceTime);
      };
    };

    const memoizedDebounceFunction = useCallback(debounce((value: string) => onChange(value)), []);

    function handleChange(value: string) {     
        setValue(value);
        memoizedDebounceFunction(value);
      // useCallback(debounce(onChange(value)), []);
    }
  
    return (
        <TextField  
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{color: 'blue.dark'}}>
                        <Search />
                    </InputAdornment>
                )
            }} 
            placeholder={placeholder} 
            type="search" 
            variant="outlined" 
            value={value} 
            onChange={e => handleChange(e.target.value)}
            sx={additionalStyles}
        />
    )
  }