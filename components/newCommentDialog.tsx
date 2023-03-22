import React, {useEffect} from "react";
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Box,
    Typography,
} from '@mui/material';
import { useForm, FormProvider } from "react-hook-form";
import {InputController} from '../utils/formControllers'
import { useCreateCommentHook } from '../utils/hooks';
import { useUser } from '@auth0/nextjs-auth0';

interface Props {
    onBackClick: () => void,
    open: boolean
    caseId: number
}

export default function NewCommentDialog(props: Props) {

    const {mutate} = useCreateCommentHook();
    const { user } = useUser();
    const { open, onBackClick, caseId } = props;

    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            commentText: '',
            userName: '',
            caseId: 0
        }
    });
    
    const { handleSubmit, watch, setValue, resetField } = form;
    
    const currentComment = watch('commentText');

    const onSubmit = async (data: any) => {
        console.log('data',data);
        await mutate(data);
        onBackClick();
        resetField('commentText');
    };

    function handleBackClick() {
        resetField('commentText');
        onBackClick();
    }

    useEffect(() => {
        setValue('userName', user?.name as string, {shouldDirty: true});
    }, [user, setValue]);

    useEffect(() => {
        setValue('caseId', caseId, {shouldDirty: true});
    }, [caseId, setValue]);

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
                    <InputController minRows={4} maxLength={300} multiline id="commentText"/>
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
                            onClick={handleSubmit(onSubmit)}
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
