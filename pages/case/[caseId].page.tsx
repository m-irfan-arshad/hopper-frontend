import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook } from '../../utils/hooks';
import { Button, Box, Typography, Tabs, Tab, styled, useMediaQuery } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheet/bookingSheetDialog";
import TopNavBar from "../../components/topNavBar";
import { Assignment, Check, CircleOutlined, Bolt, ContentCopy, ChatBubbleOutline } from '@mui/icons-material';
import CaseSummaryContent from "../../components/caseSummaryContent";
import Link from 'next/link';
import { defaultTheme } from "../../theme";

interface BookingSheetTabProps {
    label: string
    complete?: boolean
}

interface BookingSheetButtonProps {
    onClick?: () => void
    children: string | React.ReactElement
    additionalStyles?: React.CSSProperties
}

interface SectionHeaderProps {
    title: string;
    icon: React.ReactNode;
    canViewAll?: boolean
}

export default function CaseHub() {
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
  const router = useRouter()
  
  const { data } = useGetCaseByIdHook(router.query.caseId as string);
  const [isDialogOpen, setDialogState] = useState(false);
  const [tab, selectTab] = useState('Patient');

  function handleSelectTab(selectedTab: string) {
    setDialogState(true);
    selectTab(selectedTab)
  }

  const StyledTab = styled((props: any) => {
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

  const SectionHeader = (props: SectionHeaderProps) => {
    const {title, icon, canViewAll} = props;
    return (
        <Box 
            sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                borderBottom: "0.063rem solid", 
                borderColor: "gray.main",  
                marginTop: "3.5rem",
                marginRight: isMobile ? "1.75rem" : 0
            }}
        >
            <Typography 
                variant="subtitle2" 
                sx={{
                    display: "flex", 
                    alignItems: "center"
                }}>                
                {icon}
                {title} 
            </Typography> 
            {
            canViewAll 
                && <Button sx={{color: "blue.main", fontSize: "0.625rem"}}>
                    View All
                </Button>
            }
        </Box>
    )
  }

  const BookingSheetTab = (props: BookingSheetTabProps) => {
      const { label, complete } = props;
      return <StyledTab
                complete={complete} 
                label={label}
                value={label}
                icon={complete? <Check sx={{height: "1rem"}} /> : <CircleOutlined sx={{height: "1rem"}} /> }
                iconPosition="start"
                onClick={() => handleSelectTab(label)}
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
        <Box sx={{backgroundColor: "gray.light", minHeight: "100vh" }}>
            <TopNavBar />
            <Box sx={{display: "flex", justifyContent: "center", paddingLeft: "1rem"}}>
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
                            initiallySelectedTab={tab} 
                            data={data} 
                            open={isDialogOpen} 
                            closeDialog={() => setDialogState(false)} 
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
                            {data?.patients ? `${data?.patients?.lastName}, ${data?.patients?.firstName}` : 'N/A'}
                        </Typography>
                        <Typography variant="caption" >
                            {data?.patients ? `${data?.patients?.dateOfBirth} - ${data?.patients?.mrn}` : 'N/A'}
                        </Typography>
                        <BookingSheetButton
                            onClick={() => handleSelectTab('Patient')}
                            additionalStyles={{ marginTop:"1rem", color:"black.main" }}
                        >
                            Booking Sheet
                        </BookingSheetButton> 
                        <Tabs orientation="vertical" value={false} > 
                            <BookingSheetTab complete label="Patient"  /> 
                            <BookingSheetTab label="Financial" />
                            <BookingSheetTab complete label="Procedure" />
                            <BookingSheetTab label="Scheduling"  />
                            <BookingSheetTab label="Implants & Products"  />
                            <BookingSheetTab label="Clinical" />
                        </Tabs>
                    </Box>
                    <Box 
                        sx={{
                            backgroundColor: "white.main", 
                            borderRadius:"0.625rem", 
                            padding: "1.5rem", 
                            paddingTop: 0, 
                            marginTop: "3rem", 
                            boxShadow: "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem",
                            marginRight: "1.75rem",
                            marginLeft:"1.75rem"
                        }}>
                        <Box sx={{minWidth: isMobile ? 0 :  "34.375rem"}}>
                            {data && <CaseSummaryContent row={data} /> }
                        </Box>
                    </Box>
                    <Box sx={{marginLeft: "1.75rem", flexGrow: 2, paddingRight: "1rem"}}>
                        <SectionHeader 
                            canViewAll 
                            title="Activity" 
                            icon={< Bolt sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} 
                        />
                        <SectionHeader 
                            title="Case Amendments" 
                            icon={< Assignment sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} 
                        />
                        <SectionHeader 
                            title="Documents" 
                            icon={< ContentCopy sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} 
                        />
                        <SectionHeader 
                            canViewAll 
                            title="Comments" 
                            icon={< ChatBubbleOutline sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} 
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    </React.Fragment>
    )
}