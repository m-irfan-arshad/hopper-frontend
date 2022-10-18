import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface Props {
    onChange: (value: string) => void
    value: string
    debounce?: number
}

export default function DebouncedInput(props: Props) {
    const {value: initialValue, debounce = 500, onChange} = props;
    const [value, setValue] = useState(initialValue)
  
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
                <InputAdornment position="start">
                <Search />
                </InputAdornment>
            )}} 
            placeholder="Search" 
            type="search" 
            variant="outlined" 
            value={value} 
            onChange={e => setValue(e.target.value)} 
        />
    )
  }