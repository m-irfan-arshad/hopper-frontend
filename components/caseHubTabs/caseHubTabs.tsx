import React, { useState } from "react";
import { useGetCaseHubTabItemsHook } from '../../utils/hooks';
import { Button, Box, Tabs, styled, useMediaQuery } from '@mui/material';
import DocumentTabItem from "../../components/caseHubTabs/tabItems/documentTabItem";
import CommentTabItem from "../../components/caseHubTabs/tabItems/commentTabItem";
import { defaultTheme } from "../../theme";
import moment from "moment";
import Tab, { TabProps } from "@mui/material/Tab";
import UploadDocumentDialog from "../../components/caseHubTabs/uploadDocumentDialog";
import NewCommentDialog from "../../components/newCommentDialog";

interface StyledCaseTabProps extends TabProps {
    count: number
}

interface Props {
    data: any
}

export default function CaseHubTabs(props: Props) {
    const { data } = props;
    const { comment } = data;

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
    const count = 2;

    const areTabsScrollable = useMediaQuery(defaultTheme.breakpoints.down('lg'));

    const [selectedTab, selectTab] = useState('Activity');
    const [isUploadDocumentDialogOpen, setUploadDocumentDialogState] = useState(false);
    const [isNewCommentDialogOpen, setNewCommentDialogState] = useState(false);  

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

    function renderTabContent() {
        let buttonName, onClick, data = [];

        if (selectedTab === "Documents") {
            buttonName = "+ Upload Document";
            onClick = () => setUploadDocumentDialogState(true);
            data = documentData;
        }

        if (selectedTab === "Comments") {
            buttonName = "+ New Comment";
            onClick = () => setNewCommentDialogState(true);
            data = comment;
        }

        return (
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
                onClick={onClick}
                >
                    {buttonName}
                </Button>
                <Box sx={{maxHeight: "70vh", overflowY: "scroll", width: "100%" }}>
                    {
                        data.map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                {selectedTab === 'Comments' &&  <CommentTabItem data={item} /> }
                                {selectedTab === "Documents" &&  <DocumentTabItem data={item}/>}
                            </React.Fragment>
                        ))
                    }
                </Box>
        </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            <UploadDocumentDialog open={isUploadDocumentDialogOpen} onBackClick={() => setUploadDocumentDialogState(false)} />
            <NewCommentDialog caseId={data?.caseId} open={isNewCommentDialogOpen} onBackClick={() => setNewCommentDialogState(false)} />
            <Tabs 
                sx={{
                    borderBottom: "0.063rem solid #D1E4ED",
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
                allowScrollButtonsMobile
                value={selectedTab} 
                onChange={(event, value) => selectTab(value)}
            >
                <StyledCaseTab value="Activity" count={count} /> 
                <StyledCaseTab value="Amendments" count={count} />
                <StyledCaseTab value="Documents" count={count} />
                <StyledCaseTab value="Comments" count={comment.length} />
            </Tabs>
            {renderTabContent()}
        </React.Fragment>
    )
}