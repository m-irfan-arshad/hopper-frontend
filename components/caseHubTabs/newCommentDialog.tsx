import React, {useEffect} from "react";
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Box,
    Typography,
} from '@mui/material';
import { useForm, FormProvider} from "react-hook-form";
import {InputController} from '../../utils/formControllers'
import { useUser } from '@auth0/nextjs-auth0';

interface Props {
    onBackClick: () => void,
    open: boolean
    caseId: number
    onSubmit: (data: any) => void
}

export default function NewCommentDialog(props: Props) {

    const { user } = useUser();
    const { open, onBackClick, caseId, onSubmit } = props;

    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            commentText: '',
            userName: '',
            caseId: caseId
        }
    });
    
    const { handleSubmit, watch, setValue, resetField } = form;
    
    const currentComment = watch('commentText');

    function handleOnSubmit(data: any) {
        onSubmit(data);
        onBackClick();
        resetField('commentText');
    }

    function handleBackClick() {
        resetField('commentText');
        onBackClick();
    }

    useEffect(() => {
        setValue('userName', user?.name as string, {shouldDirty: true});
    }, [user, setValue]);


    return (
        <Dialog fullWidth open={open} maxWidth="sm" sx={{"& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <DialogContent sx={{ paddingX: 0, marginX: "1rem",  borderBottom: "0.063rem solid", borderColor: "gray.main"}} >
                <FormProvider {...form} >
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
                    <Typography variant="h5" sx={{ marginTop: "1.875rem", color: "gray.dark", marginBottom: "0.313rem"}}>
                        Add Case Comment
                    </Typography>
                    <InputController minRows={4} maxLength={300} size={12} placeholder="" multiline id="commentText"/>
                    </FormProvider>
                </DialogContent>    
                <DialogActions 
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
                            onClick={handleSubmit(handleOnSubmit)}
                            disabled={currentComment.length === 0}
                            sx={{
                                borderRadius: "0.25rem",
                                backgroundColor: "success.light",
                                boxShadow: "0 .063rem .125rem #00000080"
                            }}
                        >
                            <Typography variant="largeButton">
                                Save
                            </Typography>
                        </Button>
                </DialogActions>      
            </Box>
        </Dialog>
    );
}
