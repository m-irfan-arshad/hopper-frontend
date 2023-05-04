import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useGetBookingSheetConfigHook, useGetCaseByIdHook } from '../../utils/hooks';
import { Button, Box, Typography, Tabs, styled, useMediaQuery, Tab, CircularProgress } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheet/bookingSheetDialog";
import TopNavBar from "../../components/topNavBar";
import { Check, CircleOutlined } from '@mui/icons-material';
import CaseSummaryContent from "../../components/caseSummaryContent";
import CaseHubTabs from "../../components/caseHubTabs/caseHubTabs";
import Link from 'next/link';
import { defaultTheme } from "../../theme";
import { formatDate, isTabComplete } from "../../utils/helpers";
import { defaultBookingSheetConfig } from "../../reference";
import * as R from 'ramda';

interface BookingSheetTabProps {
    label: string
    complete?: boolean
}

interface BookingSheetButtonProps {
    onClick?: () => void
    children: string | React.ReactElement
    additionalStyles?: React.CSSProperties
}

export default function CaseHub() {
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetCaseByIdHook(router.query.caseId as string);
  const [isBookingSheetDialogOpen, setBookingSheetDialogState] = useState(false);
  const [bookingSheetTab, selectBookingSheetTab] = useState('Patient');
  const [bookingSheetConfig, setBookingSheetConfig] = useState(defaultBookingSheetConfig)
  const { data: orgConfigData = {}, isLoading: isConfigLoading } = useGetBookingSheetConfigHook();


  function handleselectBookingSheetTab(selectedTab: string) {
    setBookingSheetDialogState(true);
    selectBookingSheetTab(selectedTab)
  }

  useEffect(() => {
    if(!R.isEmpty(orgConfigData)){
        setBookingSheetConfig(R.mergeDeepRight(defaultBookingSheetConfig, orgConfigData));
    }
}, [orgConfigData]);

  const StyledBookingSheetTab = styled((props: any) => {
      const { complete, ...other } = props;
      return <Tab {...other} />;      
  })(({ theme, complete }) => ({
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 0,
      textTransform: "capitalize",
      minHeight: "2.5rem",
      width: "fit-content",
      fontWeight:  complete? "400" : "500",
      fontStyle: complete ? "italic" : "normal",
      color: complete? theme.palette.success.dark : theme.palette.blue.main
  }));

  const BookingSheetTab = (props: BookingSheetTabProps) => {
      const { label, complete } = props;
      return <StyledBookingSheetTab
                complete={complete} 
                label={label}
                value={label}
                icon={complete? <Check sx={{height: "1rem"}} /> : <CircleOutlined sx={{height: "1rem"}} /> }
                iconPosition="start"
                onClick={() => handleselectBookingSheetTab(label)}
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
                width: "fit-content",
                paddingLeft: 0,
                "&:hover": {backgroundColor: "transparent"},
                ...additionalStyles
            }}
          >
            {children}
        </Button>
}

  return (
    <React.Fragment>
        <Box sx={{backgroundColor: "gray.light", height: "100vh" }}>
            <TopNavBar />
            { !(isLoading || isConfigLoading)
            &&
                <Box sx={{display: "flex", justifyContent: "center", marginLeft: "1rem"}}>
                    <Box 
                        sx={{ 
                            display: "flex", 
                            flexDirection: isMobile ? "column" : "row", 
                            maxWidth: "90rem", 
                            width: "100%", 
                            justifyContent: "center"
                        }}>
                        <Box sx={{display: "flex", flexDirection: "column", marginTop: "1rem", flexGrow: 1,  marginLeft: isMobile ? "1.75rem" : 0}}>
                            <BookingSheetDialog 
                                initiallySelectedTab={bookingSheetTab} 
                                data={data} 
                                bookingSheetConfig={bookingSheetConfig}
                                open={isBookingSheetDialogOpen} 
                                closeDialog={() => setBookingSheetDialogState(false)} 
                            />
                            <Link href={`/`} passHref>
                                <BookingSheetButton
                                    additionalStyles={{ color: "blue.main" }}
                                >
                                    <Typography variant="overline" sx={{color: "blue.main"}}>
                                        {`< Dashboard`}
                                    </Typography>
                                </BookingSheetButton>
                            </Link>
                            <Typography variant="h4" >
                                {data?.patient ? `${data?.patient?.lastName}, ${data?.patient?.firstName}` : 'N/A'}
                            </Typography>
                            <Typography variant="caption" >
                                {data?.patient ? `${formatDate(data?.patient?.dateOfBirth)} - ${data?.patient?.mrn}` : 'N/A'}
                            </Typography>
                            <BookingSheetButton
                                onClick={() => handleselectBookingSheetTab('Patient')}
                                additionalStyles={{ marginTop:"1rem", color:"black.main" }}
                            >
                                Booking Sheet
                            </BookingSheetButton> 
                            <Tabs orientation="vertical" value={false} > 
                                <BookingSheetTab complete={isTabComplete(data.patient, bookingSheetConfig.patient)} label="Patient"  /> 
                                <BookingSheetTab complete={isTabComplete(data.financial, bookingSheetConfig.financial)} label="Financial" />
                                <BookingSheetTab complete={isTabComplete(data.procedureTab, bookingSheetConfig.procedureTab)} label="Procedure" />
                                <BookingSheetTab complete={isTabComplete(data.scheduling, bookingSheetConfig.scheduling)} label="Scheduling"  />
                                <BookingSheetTab complete={isTabComplete(data.productTab, bookingSheetConfig.productTab)} label="Products"  />
                                <BookingSheetTab complete={isTabComplete(data.clinical, bookingSheetConfig.clinical)} label="Clinical" />
                            </Tabs>
                        </Box>
                        <Box 
                            sx={{
                                backgroundColor: "white.main", 
                                borderRadius:"0.625rem", 
                                padding: "1.5rem", 
                                paddingTop: 0, 
                                flexGrow: 2,
                                height: "fit-content",
                                marginTop: "3rem", 
                                boxShadow: "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem",
                                marginRight: "1.75rem",
                                marginLeft:"1.75rem"
                            }}>
                            <Box>
                                 <CaseSummaryContent row={data} />
                            </Box>
                        </Box>
                        <Box 
                        sx={{
                            display: "flex", 
                            flexDirection: "column", 
                            alignItems: "flex-end", 
                            marginLeft: "1.75rem", 
                            maxWidth: "28.75rem",
                            marginTop: "2rem",
                            marginRight: "1rem",
                            overflowX: "hidden",
                            flexBasis: "100%"
                        }}
                        >
                            <CaseHubTabs data={data} isFetchingCase={isFetching} /> 
                        </Box>
                    </Box>
                </Box>
            }
            { isLoading 
            && <Box sx={{display: "flex", justifyContent: "center", height: "100vh", alignItems: "center"}}>
                    <CircularProgress sx={{display: "flex", justifyContent: "center"}} /> 
                </Box>
            }
        </Box>
    </React.Fragment>
    )
}
