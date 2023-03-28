import React, {useState, useRef} from "react";
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
import { useCreateDocumentHook } from "../../utils/hooks";
import { useUser } from '@auth0/nextjs-auth0';

interface Props {
    onBackClick: () => void,
    open: boolean
}

interface DocTypeOptions {
    id: string,
    value: string
}

export default function UploadDocumentDialog(props: Props) {
  const {mutate} = useCreateDocumentHook()
  const { user } = useUser();

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
  const [signitureDate, setSignitureDate] = useState(moment());
  const [notes, setNotes] = useState("");
  const [selectedDocTypes, setSelectedDocTypes] = useState<DocTypeOptions[]>([]);
  const [docTypeOptions, setDocTypeOptions] = useState(docTypeDropdownOptions);

  const shouldShowSignatureDate = selectedDocTypes.some(item => item.id === 'h&p');

  function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
        setSignitureDate(moment());
        setDocTypeOptions(docTypeDropdownOptions);
    }
  }

  function handleBackClick() {
    onBackClick();
    setFile(null);
    setSignitureDate(moment());
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
    let reader = new FileReader();
    const caseId = parseInt(window.location.href.split('/').at(-1) as string);
    if (file) {
        reader.readAsDataURL(file)
        reader.onload = () => {
            mutate({
                content: reader.result,
                fileName: file.name,
                docTypes: selectedDocTypes.map(option => option.id),
                user: user?.name,
                caseId: caseId,
                notes: notes,
                ...(shouldShowSignatureDate && {signitureDate: signitureDate})
            })
        }
    } else {
        console.warn("No file selected")
    }
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
            
                    { !file 
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
                        <input hidden accept="image/*" type="file" onChange={handleDocumentChange} />
                        <FileUploadIcon sx={{color: "white.main", height: "1.125rem", width: "1.125rem"}} />
                        <Typography variant="smallButton" sx={{color: "white.main", marginLeft: "0.313rem"}} >
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
                                    value={signitureDate}
                                    onChange={(newValue: moment.Moment | null) => {
                                        if (newValue && newValue.isValid()) {
                                            setSignitureDate(newValue);
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
                
                { file
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
