import React, { useEffect } from "react";
import { Box, styled, IconButton, Select, MenuItem, Typography} from "@mui/material";
import { AttachEmail, MoreVert } from '@mui/icons-material';
import DottedDivider from "../../shared/dottedDivider";
import moment from "moment";
import { document } from "@prisma/client";
import { useDownloadDocumentHook } from '../../../utils/hooks';

interface Props {
    data: document;
}

export default function DocumentTabItem(props: Props) {
    const {data} = props;

    const StyledMenuItem = styled(MenuItem)({
        fontSize: ".75rem"
    });

    const StyledAnchorTag = styled('a')({
        textDecoration: 'none',
        color: 'inherit'
    });

    /* TODO: 
        1. Only call download hook when you actually try to download the object instead of when you go to documents page and download all documents
        2. unit tests
    */

    const { data: documentAttachment } = useDownloadDocumentHook(data.storagePath);

    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{display: "flex", justifyContent: "space-between", paddingBottom: "1rem", paddingTop: "1rem"}}> 
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
                    <Typography sx={{fontSize: "0.75rem", fontWeight: "500", textTransform: 'capitalize'}}>
                        {data.docTypes?.join(", ")} 
                    </Typography>
                    <Typography sx={{fontSize: "0.625rem"}}>
                        {data.notes}
                    </Typography>
                    <Typography sx={{ marginTop: "0.5rem", fontSize: "0.75rem", fontStyle: "italic" }}>
                        {`${data.user} - ${moment(data.createTime).format('hh:mma, MM/DD/YYYY')}`}
                    </Typography>
                </Box>
                <Select    
                    sx={{ 
                        height:'1.5rem', 
                        width: '1.5rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        }
                    }}
                    IconComponent={(props) =>  <MoreVert {...props} /> }
                >
                    <StyledMenuItem> View </StyledMenuItem>
                    <StyledMenuItem> 
                        <StyledAnchorTag href={documentAttachment} download={data.storagePath.slice(37)}>
                            Download
                        </StyledAnchorTag> 
                    </StyledMenuItem>
                    <StyledMenuItem> Delete </StyledMenuItem>       
                </Select>  
            </Box>
            <DottedDivider />
        </Box>
      );
}