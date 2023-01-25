import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook } from '../../utils/hooks';
import { Button, Box, Typography, Tabs, Tab, styled } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheetDialog";
import TopNavBar from "../../components/topNavBar";
import { Assignment, Check, CircleOutlined, Bolt, ContentCopy, ChatBubbleOutline } from '@mui/icons-material';
import CaseSummaryContent from "../../components/caseSummaryContent";
import Link from 'next/link';

interface BookingSheetTabProps {
    label: string
    complete?: boolean
    //onClick: (value: string) => void
}

interface BookingSheetButtonProps {
    onClick: () => void
    children: string | React.ReactElement
    additionalStyles?: React.CSSProperties
}

interface SectionHeaderProps {
    title: string;
    icon: React.ReactNode;
    canViewAll?: boolean
}

export default function CaseHub() {
  const router = useRouter()
  
  const { data, isFetching, isLoading } = useGetCaseByIdHook(router.query.caseId as string);
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
        minHeight: "40px",
        width: "fit-content",
        fontWeight:  complete? "400" : "500",
        fontStyle: complete ? "italic" : "normal",
        color: complete? theme.palette.success.dark : theme.palette.blue.main
  }));

  const SectionHeader = (props: SectionHeaderProps) => {
    const {title, icon, canViewAll} = props;
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", borderBottom: "0.063rem solid", borderColor: "gray.main",  marginTop: "3.5rem"}}>
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
                && <Button sx={{color: "blue.main", fontSize: "10px"}}>
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
            <Box sx={{ display: "flex"}}>
                <Box sx={{display: "flex", flexDirection: "column", marginRight: "6rem", marginTop: "1rem", marginLeft: "3rem"}}>
                    <BookingSheetDialog initiallySelectedTab={tab} data={data} open={isDialogOpen} closeDialog={() => setDialogState(false)} />
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
                        {`${data?.patients?.lastName}, ${data?.patients?.firstName}`}
                    </Typography>
                    <Typography variant="caption" >
                        {`${data?.patients?.dateOfBirth} - ${data?.patients?.mrn} `}
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
                        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px"
                    }}>
                    {!isFetching && !isLoading && <CaseSummaryContent row={data} />}
                </Box>
                <Box sx={{marginLeft: "3.5rem", flexGrow: 1, marginRight: "3.5rem"}}>
                    <SectionHeader canViewAll title="Activity" icon={< Bolt sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} />
                    <SectionHeader title="Case Amendments" icon={< Assignment sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} />
                    <SectionHeader title="Documents" icon={< ContentCopy sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} />
                    <SectionHeader canViewAll title="Comments" icon={< ChatBubbleOutline sx={{marginRight: "0.5rem", color: "orange.main", height: '1rem', width: "1rem"}} />} />
                </Box>
            </Box>
        </Box>
    </React.Fragment>
    )
}