import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook } from '../../utils/hooks';
import { Button, Box, Typography, Tabs, Tab, styled } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheetDialog";
import TopNavBar from "../../components/topNavBar";
import { Check, CircleOutlined } from '@mui/icons-material';

interface BookingSheetTabProps {
    label: string
    complete?: boolean
}

interface BookingSheetButtonProps {
    onClick: () => void
    children: string | React.ReactElement
    additionalStyles?: React.CSSProperties
}

export default function CaseHub() {
  const router = useRouter()
  
  const { data } = useGetCaseByIdHook(router.query.caseId as string);
  const [isDialogOpen, setDialogState] = useState(false);

  const StyledTab = styled((props: any) => {
        const { complete, ...other } = props;
        return <Tab {...other} />;      
    })(({ theme, complete }) => ({
        display: "flex",
        justifyContent: "flex-start",
        paddingLeft: 0,
        textTransform: "capitalize",
        minHeight: "40px",
        width: "fit-content",
        fontWeight: "400",
        fontStyle: complete ? "italic" : "normal",
        color: complete? theme.palette.success.dark : theme.palette.blue.main,
  }));

  const BookingSheetTab = (props: BookingSheetTabProps) => {
      const { label, complete } = props;
      return <StyledTab
                complete={complete} 
                label={label}
                icon={complete? <Check sx={{height: "1rem"}} /> : <CircleOutlined sx={{height: "1rem"}} /> }
                iconPosition="start"
            />
  }

  const BookingSheetButton = (props: BookingSheetButtonProps) => {
    const { onClick, children, additionalStyles } = props;
    return <Button 
            onClick={onClick}
            variant="text"
            sx={{
                display: "flex",
                justifyContent:"flex-start",
                fontSize: "1rem",
                fontWeight: "600",
                paddingLeft: 0,
                ...additionalStyles
            }}
          >
            {children}
        </Button>
}

  return (
    <React.Fragment>
        <TopNavBar /> 
        <Box sx={{display: "flex", flexDirection: "column", width: "25%", marginTop: "1rem", marginLeft: "3rem"}}>
            <BookingSheetDialog data={data} open={isDialogOpen} closeDialog={() => setDialogState(false)} />
            <BookingSheetButton
                additionalStyles={{ color:"blue.main" }}
                onClick={() => setDialogState(true)}
            >
                <Typography variant="overline" sx={{color: "blue.main"}}>
                    {`< Dashboard`}
                </Typography>
            </BookingSheetButton>
            <Typography variant="h4" >
                {`${data?.patients?.lastName}, ${data?.patients?.firstName}`}
            </Typography>
            <Typography variant="caption" >
                {`${data?.patients?.dateOfBirth} - ${data?.patients?.mrn} `}
            </Typography>
            <BookingSheetButton
                onClick={() => setDialogState(true)}
                additionalStyles={{ marginTop:"1rem", color:"black.main" }}
            >
                Booking Sheet
            </BookingSheetButton> 
            <Tabs orientation="vertical" > 
                <BookingSheetTab complete label="Patient" /> 
                <BookingSheetTab label="Financial"  />
                <BookingSheetTab complete label="Procedure" />
                <BookingSheetTab label="Scheduling" />
                <BookingSheetTab label="Implants & Products"  />
                <BookingSheetTab label="Clinical" />
            </Tabs>
        </Box>
        </React.Fragment>

    )
}