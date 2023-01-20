import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook } from '../../utils/hooks';
import { Button } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheetDialog";

export default function CaseHub() {
  const router = useRouter()

  console.log('router test',router);
  
  const { data } = useGetCaseByIdHook(router.query.caseId as string);
  const [isDialogOpen, setDialogState] = useState(false);

  return (
    <React.Fragment>
        <BookingSheetDialog data={data} open={isDialogOpen} closeDialog={() => setDialogState(false)} />
        <Button
            size="small"
            variant="contained"
            color="success"
            onClick={() => setDialogState(true)}
        >
            Booking Sheet
        </Button> 
        </React.Fragment>

    )
}