import React from "react";
import {
    MenuItem, 
    Select, 
    SelectChangeEvent, 
    Chip, 
    styled, 
    Paper, 
    InputLabel, 
    FormControl
} from "@mui/material";

interface MenuItem {
    value: string
    id: string
}

interface Props {
    menuItems: MenuItem[]
    selectId: string
    onChange: (value: any) => void
    onDelete: (value: any) => void,
    selectedOptions: any,
    placeholder?: string
    additionalStyles?: React.CSSProperties
    label: string
}

export default function MultiSelectDropDown(props: Props) {
    const {menuItems, selectId, onChange, selectedOptions, onDelete, additionalStyles, label} = props;

    const defaultStyles = {   
        width: "100%",
    };

    const ListItem = styled('li')(({ theme }) => ({
        marginRight: "0.5rem",
    }));
    
    return (
        <FormControl
          variant="outlined"
          sx={{   
            ...defaultStyles,
            ...additionalStyles
          }}
        >
            <InputLabel id="label">{label}</InputLabel>
            <Select
                value={selectedOptions}
                labelId="label"
                id={selectId}
                label={label}
                data-testid={selectId}
                multiple
                renderValue={() => (
                    <Paper
                        sx={{
                            display: 'flex',
                            boxShadow: 0,
                            listStyle: 'none',
                            
                        }}
                        component="ul"
                    >
                        {
                            selectedOptions.map((data: MenuItem) => {
                                return (
                                    <ListItem key={data.id}>
                                        <Chip
                                            label={data.value}
                                            onDelete={() => onDelete(data)}
                                            onMouseDown={(event) => {
                                                event.stopPropagation();
                                            }}
                                        />
                                    </ListItem>
                                );
                            })
                        }
                </Paper>

                )}
                onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
            >
                {
                    menuItems.map((item, index) => (
                        //@ts-ignore - necessary to load object into value
                        <MenuItem key={index} value={item} sx={{fontSize: "0.825rem"}}>{item.value}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
}