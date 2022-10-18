import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface Props {
    onChange: (value: string) => void
    value: string
    debounce?: number
    placeholder?: string
    additionalStyles?: React.CSSProperties | object
}

export default function DebouncedInput(props: Props) {
    const {value: initialValue, debounce = 500, onChange, additionalStyles, placeholder} = props;
    const [value, setValue] = useState(initialValue);
  
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value])
  
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
            onChange={e => setValue(e.target.value)}
            sx={additionalStyles}
        />
    )
  }