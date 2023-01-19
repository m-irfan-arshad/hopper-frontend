import React from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook } from '../../utils/hooks';
import { Button } from '@mui/material';

export default function CaseHub() {
  const router = useRouter()
  
  const { data } = useGetCaseByIdHook(router.query.caseId as string);

  return (
        <Button
            size="small"
            variant="contained"
            color="success"
        >
            Booking Sheet
        </Button>  
    )
}