import React, {ChangeEvent, useState, useEffect} from "react";
import { 
    Button, 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    styled,
    Box,
    Typography
} from '@mui/material';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import Image from 'next/image';
import logo from '../medtelLogo.svg';
import { defaultTheme } from "../theme";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { fontWeight } from "@mui/system";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from "moment";
import MultiSelectDropdownNew from "./shared/multiSelectDropdownNew";

/* TODO:
    1. Write tests
    2. Make PR/review code and cleanup
*/


interface Props {
    onBackClick: () => void,
    open: boolean
}

interface Chip {
    id: string,
    value: string
}

export interface caseFilterInterface {
    value: string,
    id: string
  } 

export default function UploadDocumentDialog(props: Props) {

  const docTypeDropdownOptions = [
    {
        value: "H & P",
        id: "h&p"
    },
    {
        value: "License",
        id: "License"
    },
  ];

  const { open, onBackClick } = props;

  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState(moment());
  const [selectedDocTypes, setSelectedDocTypes] = useState<Chip[]>([]);
  const [docTypeOptions, setDocTypeOptions] = useState(docTypeDropdownOptions);

  const shouldShowSignatureDate = selectedDocTypes.some(item => item.id === 'h&p');

  function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
        setDate(moment());
        setSelectedDocTypes([]);
        setDocTypeOptions(docTypeDropdownOptions);
    }
  }

  function handleBackClick() {
    onBackClick();
    setFile(null);
    setDate(moment());
    setSelectedDocTypes([]);
    setDocTypeOptions(docTypeDropdownOptions);
  }

  function handleDocTypeChange(values: any) {
    setSelectedDocTypes(values);
   
    values.map((value: any) => {
        if (docTypeOptions.includes(value)) {
            setDocTypeOptions(docTypeOptions.filter((option) => option.id !== value.id))
        }
    });
  }

  function handleChipOnDelete(chipToDelete: any) {
    setSelectedDocTypes(selectedDocTypes.filter((chip) => chip.id !== chipToDelete.id));
    setDocTypeOptions(currentDocOptions => [...currentDocOptions, chipToDelete]);
  }

  return (
      <Dialog fullWidth open={open} maxWidth="sm" sx={{"& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DialogContent sx={{ paddingX: 0, marginX: "15px",  borderBottom: "0.063rem solid", borderColor: "gray.main"}} >
                    <Button 
                        onClick={handleBackClick}
                        sx={{
                            color: "blue.dark",
                            padding: 0,
                            minWidth: 0,
                            "&:hover": {
                                backgroundColor: "transparent"
                            }
                        }}
                    >
                        <Typography variant="smallButton">
                            {'< Back'}
                        </Typography>
                    </Button>
                    <Typography variant="h5" sx={{marginBottom: "20px", marginTop: "30px", color: "gray.dark"}}>
                        Upload Document
                    </Typography>
            
                    { !file 
                    && <Button 
                        component="label"
                        sx={{
                            boxShadow: "0px 2px 2px 0px #00000024, 0px 1px 5px 0px #0000001F, 0px 3px 1px -2px #00000033",
                            fontSize: "10px",
                            backgroundColor: "blue.dark",
                            "&:hover": {
                                backgroundColor: "blue.dark"
                            }
                        }}
                    >
                        <input hidden accept="image/*" type="file" onChange={handleDocumentChange} />
                        <FileUploadIcon sx={{color: "white.main", height: "18px", width: "18px"}} />
                        <Typography variant="smallButton" sx={{color: "white.main", marginLeft: "5px"}} >
                            Select File
                        </Typography>
                    </Button>
                    }
                    { file 
                    && <React.Fragment>
                        <Box>
                            <Typography variant="smallButton">
                            {file.name}
                            </Typography>
                            <Button 
                                component="label"
                                sx={{
                                    fontSize: "10px",
                                    backgroundColor: "transparent",
                                    minWidth: 0,
                                    padding: 0,
                                    "&:hover": {
                                        backgroundColor: "transparent"
                                    }
                                }}
                            >
                                <input hidden accept="image/*" type="file" onChange={handleDocumentChange} />
                                <Typography variant="smallButton" sx={{color: "blue.dark", marginLeft: "20px",}} >
                                    Choose File
                                </Typography>
                            </Button>
                        </Box>
                        <MultiSelectDropdownNew
                            label="Document Type(s)"
                            menuItems={docTypeOptions}
                            selectId="doc-types"
                            onChange={(value) => handleDocTypeChange(value)}
                            onDelete={(chipToDelete) => handleChipOnDelete(chipToDelete)}
                            additionalStyles={{marginTop: "40px"}}
                            selectedOptions={selectedDocTypes}
                        />
                        <Typography variant="caption" sx={{marginLeft: "14px", color: "black.light"}}>
                                Select multiple document types if the file contains more than one
                        </Typography>
                        <TextField  
                            inputProps={{
                                style: {
                                    padding: 0,
                                    fontSize: "1rem",
                                    
                                }
                            }}
                            label="Document Notes" 
                            variant="outlined"
                            multiline
                            minRows={5.5}
                            sx={{ width: "100%", marginTop: "40px" }} 
                        />
                        {
                           shouldShowSignatureDate
                            && <DatePicker
                                    value={date}
                                    onChange={(newValue: moment.Moment | null) => {
                                        if (newValue && newValue.isValid()) {
                                            setDate(newValue);
                                        }
                                    }}
                                    label="Signature Date"
                                    renderInput={(params: any) => <TextField {...params} sx={{
                                        width: "100%",
                                        marginTop: "40px",
                                        marginBottom: "30px"
                                    }} 
                                    />}
                                />
                        }
                    </React.Fragment>
                    }
                </DialogContent>
                
                { file
                && <DialogActions 
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        paddingX: 0,
                        marginX: "15px",
                        minHeight: "5rem",
                        paddingY: "10px"
                    }}>
                        <Button 
                            variant="contained" 
                            disabled={selectedDocTypes.length === 0}
                            sx={{
                                boxShadow: "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)",
                                borderRadius: "4px",
                                backgroundColor: "success.light",
                            }}
                        >
                            <Typography variant="largeButton">
                                Save
                            </Typography>
                        </Button>
                </DialogActions>
                }
            </LocalizationProvider>
        </Box>
      </Dialog>
  );
}
