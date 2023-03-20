import React, { useState } from "react";
import { useRouter } from 'next/router'
import { useGetCaseByIdHook, useGenericQueryHook } from '../../utils/hooks';
import { Button, Box, Typography, Tabs, styled, useMediaQuery } from '@mui/material';
import BookingSheetDialog from "../../components/bookingSheet/bookingSheetDialog";
import TopNavBar from "../../components/topNavBar";
import UploadDocumentDialog from "../../components/uploadDocumentDialog";
import NewCommentDialog from "../../components/newCommentDialog";
import { Check, CircleOutlined } from '@mui/icons-material';
import CaseSummaryContent from "../../components/caseSummaryContent";
import DocumentTabItem from "../../components/documentTabItem";
import CommentTabItem from "../../components/commentTabItem";
import Link from 'next/link';
import { defaultTheme } from "../../theme";
import moment from "moment";
import { formatDate } from "../../utils/helpers";
import Tab, { TabProps } from "@mui/material/Tab";

interface BookingSheetTabProps {
    label: string
    complete?: boolean
}

interface BookingSheetButtonProps {
    onClick?: () => void
    children: string | React.ReactElement
    additionalStyles?: React.CSSProperties
}

interface StyledCaseTabProps extends TabProps {
    count: number
}

export default function CaseHub() {
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
  const areTabsScrollable = useMediaQuery(defaultTheme.breakpoints.down('lg'));
  const router = useRouter();
  
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

  const count = documentData.length;

  const { data } = useGetCaseByIdHook(router.query.caseId as string);
  const { data: comments = [] } = useGenericQueryHook({queryKey: 'getComments'});  
  const [isBookingSheetDialogOpen, setBookingSheetDialogState] = useState(false);
  const [bookingSheetTab, selectBookingSheetTab] = useState('Patient');
  const [caseTab, selectCaseTab] = useState('Activity');
  const [isUploadDocumentDialogOpen, setUploadDocumentDialogState] = useState(false);
  const [isNewCommentDialogOpen, setNewCommentDialogState] = useState(false);

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

  const StyledCaseTab = styled((props: StyledCaseTabProps) => {
    const { value, count, ...other } = props;
    return <Tab
            value={value}
            label={
                <Box sx={{display: "flex"}}>
                    {value}   
                    <span>({count})</span>
                </Box>
            }
            {...other}
        />
  })(({}) => ({
    display: "flex",
    justifyContent: "flex-end",
    textTransform: "capitalize",
    fontSize: "0.75rem",
    paddingBottom: "0.5rem",
    fontWeight:  "700",
    "& span": {
        fontWeight: "400",
        marginLeft: "0.188rem"
    }
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
            <UploadDocumentDialog open={isUploadDocumentDialogOpen} onBackClick={() => setUploadDocumentDialogState(false)} />
            <NewCommentDialog open={isNewCommentDialogOpen} onBackClick={() => setNewCommentDialogState(false)} />
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
                            flexGrow: 2,
                            height: "fit-content",
                            marginTop: "3rem", 
                            boxShadow: "rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem",
                            marginRight: "1.75rem",
                            marginLeft:"1.75rem"
                        }}>
                        <Box>
                            {data && <CaseSummaryContent row={data} /> }
                        </Box>
                    </Box>
                    <Box 
                      sx={{
                        display: "flex", 
                        flexDirection: "column", 
                        alignItems: "flex-end", 
                        marginLeft: "1.75rem", 
                        maxWidth: "28.125rem",
                        //height: "85vh",
                        marginTop: "2rem",
                        marginRight: "1rem",
                        overflowX: "hidden",
                        //flexBasis: "100%"
                      }}
                    >
                            <Tabs 
                                sx={{
                                    borderBottom: "0.063rem solid #D1E4ED",
                                    //position: "fixed",
                                    overflow: "hidden",
                                    width: "100%",
                                    "& .MuiTabs-indicator": {
                                        backgroundColor: "orange.main"
                                    },
                                    "& .MuiTab-root.Mui-selected": {
                                        color: "orange.main",
                                        justifyContent: "flex-end"
                                    }
                                }}
                                variant={areTabsScrollable ? "scrollable" : "standard"}
                                value={caseTab} 
                                onChange={(event, value) => selectCaseTab(value)}
                            >
                                <StyledCaseTab value="Activity" count={count} /> 
                                <StyledCaseTab value="Amendments" count={count} />
                                <StyledCaseTab value="Documents" count={count} />
                                <StyledCaseTab value="Comments" count={comments.length} />
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
                                    {/* <Box sx={{maxHeight: "80vh"}}> */}
                                        {
                                            documentData.map((data, index) => (
                                                <React.Fragment key={index}> 
                                                    <DocumentTabItem data={data} /> 
                                                </React.Fragment> 
                                            ))
                                        }
                                    {/* </Box> */}
                                </React.Fragment>
                            }
                            {caseTab === "Comments" && 
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
                                    onClick={() => setNewCommentDialogState(true)}
                                    >
                                        + New Comment
                                    </Button>
                                    <Box sx={{maxHeight: "70vh", overflowY: "scroll" }}>
                                    {
                                        comments.map((data: any, index: number) => (
                                            <CommentTabItem key={index} data={data} /> 
                                        ))
                                    }
                                    </Box>
                                </React.Fragment>
                            }
                    </Box>
                </Box>
            </Box>
        </Box>
    </React.Fragment>
    )
}