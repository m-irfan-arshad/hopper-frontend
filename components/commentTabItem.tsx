import React from "react";
import { Box, styled, IconButton, Select, MenuItem, Typography} from "@mui/material";
import { MoreVert } from '@mui/icons-material';
import DottedDivider from "./shared/dottedDivider";
import moment from "moment";

interface Props {
    data: any;
}

export default function CommentTabItem(props: Props) {

    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{display: "flex", justifyContent: "space-between", paddingBottom: "1rem", paddingTop: "1rem"}}> 
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
                    <Typography sx={{fontSize: "0.625rem", lineHeight: '1', whiteSpace: 'pre-line'}}>
                       {props.data.commentText}
                    </Typography>
                    <Typography sx={{ marginTop: "0.625rem", fontSize: "0.75rem", fontStyle: "italic" }}>
                        {`${props.data.userName} - ${moment(props.data.createTime).format('hh:mma, MM/DD/YYYY')}`}
                    </Typography>
                </Box>
            </Box>
            <DottedDivider />
        </Box>
      );
}