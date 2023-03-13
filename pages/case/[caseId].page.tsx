import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook } from '../../utils/hooks';
import { Button, Box, Typography, Tabs, Tab, styled, useMediaQuery } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheet/bookingSheetDialog";
import TopNavBar from "../../components/topNavBar";
import UploadDocumentDialog from "../../components/uploadDocumentDialog";
import { Assignment, Check, CircleOutlined, Bolt, ContentCopy, ChatBubbleOutline } from '@mui/icons-material';
import CaseSummaryContent from "../../components/caseSummaryContent";
import DocumentTabItem from "../../components/documentTabItem";
import Link from 'next/link';
import { defaultTheme } from "../../theme";
import moment from "moment";
import { formatDate } from "../../utils/helpers";

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
  
  const documentData = [
    {
        createTime: moment().subtract(1, 'days'),
        updateTime: moment(),
        description: 'Lorem ipsum sdgsdgdasgasg',
        firstName: 'Daphney',
        lastName: 'Johnson',
        fileTypes: ['Other']
    },
    {
        createTime: moment().subtract(2, 'days'),
        updateTime: moment(),
        description: 'Lorem ipsum sdgsdgdasgasg',
        firstName: 'Daphney',
        lastName: 'Johnson',
        fileTypes: ['H&P', 'License']
    },
  ];

  const { data } = useGetCaseByIdHook(router.query.caseId as string);
  const [isBookingSheetDialogOpen, setBookingSheetDialogState] = useState(false);
  const [bookingSheetTab, selectBookingSheetTab] = useState('Patient');
  const [caseTab, selectCaseTab] = useState('Activity');
  const [isUploadDocumentDialogOpen, setUploadDocumentDialogState] = useState(false);

  const count = documentData.length;

  function handleselectBookingSheetTab(selectedTab: string) {
    setBookingSheetDialogState(true);
    selectBookingSheetTab(selectedTab)
  }

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

  const StyledCaseTab = styled(Tab)({
    display: "flex",
    justifyContent: "flex-end",
    textTransform: "capitalize",
    fontSize: "0.75rem",
    paddingBottom: "0.5rem",
    height: "fit-content",
    fontWeight:  "600",
  });

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
        <Box sx={{backgroundColor: "gray.light", minHeight: "100vh" }}>
            <TopNavBar />
            <UploadDocumentDialog open={isUploadDocumentDialogOpen} onBackClick={() => setUploadDocumentDialogState(false)} />
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
                            initiallySelectedTab={bookingSheetTab} 
                            data={data} 
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
                            {data?.patients ? `${data?.patients?.lastName}, ${data?.patients?.firstName}` : 'N/A'}
                        </Typography>
                        <Typography variant="caption" >
                            {data?.patients ? `${formatDate(data?.patients?.dateOfBirth)} - ${data?.patients?.mrn}` : 'N/A'}
                        </Typography>
                        <BookingSheetButton
                            onClick={() => handleselectBookingSheetTab('Patient')}
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
                    <Box 
                      sx={{
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end", 
                        marginLeft: "1.75rem", 
                        flexGrow: 2, 
                        paddingRight: "1rem"
                      }}
                    >
                        <Tabs 
                            sx={{
                                borderBottom: "0.063rem solid #D1E4ED", 
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "orange.main"
                                },
                                "& .MuiTab-root.Mui-selected": {
                                    color: "orange.main"
                                }
                            }} 
                            value={caseTab} 
                            onChange={(event, value) => selectCaseTab(value)}
                        >
                            <StyledCaseTab label={`Activity (${count})`} value="Activity" /> 
                            <StyledCaseTab label={`Amendments (${count})`} value="Amendments"   />
                            <StyledCaseTab label={`Documents (${count})`} value="Documents"  />
                            <StyledCaseTab label={`Comments (${count})`} value="Comments" />
                        </Tabs>
                        {caseTab === "Documents" && 
                            <React.Fragment>
                                <Button 
                                  sx={{
                                    color: "blue.dark", 
                                    fontSize: "0.625rem", 
                                    fontWeight: "700", 
                                    marginTop: "1rem", 
                                    marginBottom: "1rem", 
                                    padding: 0, 
                                    '&:hover': {
                                      backgroundColor: 'transparent'
                                    }
                                  }}
                                  onClick={() => setUploadDocumentDialogState(true)}
                                >
                                    + Upload Document
                                </Button>
                                {
                                    documentData.map((data, index) => (
                                        <React.Fragment key={index}> 
                                            <DocumentTabItem data={data} /> 
                                        </React.Fragment> 
                                    ))
                                }
                            </React.Fragment>
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    </React.Fragment>
    )
}