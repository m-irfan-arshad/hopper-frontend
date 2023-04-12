import React, {useState} from "react";
import { 
    Button, 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Box,
    Typography,
    styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from "moment";
import MultiSelectDropdownNew from "../shared/multiSelectDropdownNew";
import {DropDownSearchController} from '../../utils/formControllers'

import { useUser } from '@auth0/nextjs-auth0';
import { docTypeDropdownOptions } from "../../reference";

interface Props {
    onBackClick: () => void,
    open: boolean
    onSubmit: (data: any) => void
}

interface DocTypeOptions {
    id: string,
    value: string
}

export default function UploadDocumentDialog(props: Props) {
  const { user } = useUser();

  const { open, onBackClick, onSubmit } = props;

  const [fileContent, setFileContent] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null)
  const [signatureDate, setSignatureDate] = useState(moment());
  const [notes, setNotes] = useState("");
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocTypeOptions[]>([]);
  const [docTypeOptions, setDocTypeOptions] = useState(docTypeDropdownOptions);

  const shouldShowSignatureDate = selectedDocTypes.some(item => item.id === 'h&p');

  function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function(){
            setFileContent(reader.result)
        };
        reader.readAsDataURL(file)
        setFileName(file.name)
        setSelectedDocTypes([]);
        setSignatureDate(moment());
        setDocTypeOptions(docTypeDropdownOptions);
    }
  }

  function handleBackClick() {
    onBackClick();
    setFileContent(null);
    setFileName(null);
    setSignatureDate(moment());
    setSelectedDocTypes([]);
    setDocTypeOptions(docTypeDropdownOptions);
  }

  function handleDocTypeChange(documentTypes: any) {
    setSelectedDocTypes(documentTypes);
   
    documentTypes.map((documentType: DocTypeOptions) => {
        if (docTypeOptions.includes(documentType)) {
            setDocTypeOptions(docTypeOptions.filter((option) => option.id !== documentType.id))
        }
    });
  }

  async function uploadDocument() {
    const caseId = parseInt(window.location.href.split('/').at(-1) as string);
    onSubmit({
        content: fileContent,
        fileName: fileName,
        docTypes: selectedDocTypes.map(option => option.id),
        user: user?.name,
        caseId: caseId,
        notes: notes,
        ...(shouldShowSignatureDate && {signatureDate: signatureDate})
    })
        
    handleBackClick()
  }

  function handleChipOnDelete(chipToDelete: any) {
    setSelectedDocTypes(selectedDocTypes.filter((chip) => chip.id !== chipToDelete.id));
    setDocTypeOptions(currentDocOptions => [...currentDocOptions, chipToDelete]);
  }

  return (
      <Dialog fullWidth open={open} maxWidth="sm" sx={{"& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <DialogContent sx={{ paddingX: 0, marginX: "1rem",  borderBottom: "0.063rem solid", borderColor: "gray.main"}} >
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
                    <Typography variant="h5" sx={{marginBottom: "1.25rem", marginTop: "1.875rem", color: "gray.dark"}}>
                        Upload Document
                    </Typography>
            
                    { !fileName 
                    && <Button 
                        component="label"
                        sx={{
                            fontSize: "0.625rem",
                            backgroundColor: "blue.dark",
                            boxShadow: "0 .063rem .125rem #00000080",
                            "&:hover": {
                                backgroundColor: "blue.dark"
                            }
                        }}
                    >
                        <input hidden type="file" onChange={handleDocumentChange} />
                        <FileUploadIcon sx={{color: "white.main", height: "1.125rem", width: "1.125rem"}} />
                        <Typography variant="smallButton" sx={{color: "white.main", marginLeft: "0.313rem"}} >
                            Select File
                        </Typography>
                    </Button>
                    }
                    { fileName
                    && <React.Fragment>
                        <Box>
                            <Typography variant="smallButton">
                                {fileName}
                            </Typography>
                            <Button 
                                component="label"
                                sx={{
                                    fontSize: "0.625rem",
                                    backgroundColor: "transparent",
                                    minWidth: 0,
                                    padding: 0,
                                    "&:hover": {
                                        backgroundColor: "transparent"
                                    }
                                }}
                            >
                                <input hidden accept="image/*" type="file" onChange={handleDocumentChange} />
                                <Typography variant="smallButton" sx={{color: "blue.dark", marginLeft: "1.25rem"}} >
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
                            additionalStyles={{marginTop: "2.5rem"}}
                            selectedOptions={selectedDocTypes}
                        />
                        <Typography variant="caption" sx={{marginLeft: "0.875ren", color: "black.light"}}>
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
                            sx={{ width: "100%", marginTop: "2.5rem" }} 
                            onChange={(event) => setNotes(event.target.value)}
                        />
                        {
                           shouldShowSignatureDate
                            && <DatePicker
                                    value={signatureDate}
                                    onChange={(newValue: moment.Moment | null) => {
                                        if (newValue && newValue.isValid()) {
                                            setSignatureDate(newValue);
                                        }
                                    }}
                                    label="Signature Date"
                                    renderInput={(params: any) => <TextField {...params} sx={{
                                        width: "100%",
                                        marginTop: "2.5rem",
                                        marginBottom: "1.875rem"
                                    }} 
                                    />}
                                />
                        }
                    </React.Fragment>
                    }
                </DialogContent>
                
                { fileName
                && <DialogActions 
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        paddingX: 0,
                        marginX: "0.938rem",
                        minHeight: "5rem",
                        paddingY: "0.625rem"
                    }}>
                        <Button 
                            variant="contained" 
                            disabled={selectedDocTypes.length === 0}
                            sx={{
                                borderRadius: "0.25rem",
                                backgroundColor: "success.light",
                                boxShadow: "0 .063rem .125rem #00000080"
                            }}
                            onClick={uploadDocument}
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
