import React, { useEffect, useRef } from "react";
import { Box, styled, Select, MenuItem, Typography, CircularProgress} from "@mui/material";
import { MoreVert } from '@mui/icons-material';
import DottedDivider from "../../shared/dottedDivider";
import moment from "moment";
import { document } from "@prisma/client";
import { useDownloadDocumentHook } from '../../../utils/hooks';

interface Props {
    data: document;
}

export default function DocumentTabItem(props: Props) {
    const {data} = props;
    const anchorTagRef = useRef<HTMLAnchorElement>(null);

    const StyledMenuItem = styled(MenuItem)({
        fontSize: ".75rem"
    });

    const StyledAnchorTag = styled('a')({
        textDecoration: 'none',
        color: 'inherit'
    });

    const { data: documentAttachment, isFetching, refetch } = useDownloadDocumentHook(data.storagePath);

    useEffect(() => {
        anchorTagRef.current?.click();
    }, [documentAttachment])

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
                    <StyledMenuItem onClick={() => !documentAttachment && refetch()} sx={{ display: "flex", justifyContent:"center"}}>  
                        { isFetching 
                            ?   <CircularProgress size={"1rem"}/>
                            :   <StyledAnchorTag ref={anchorTagRef} href={documentAttachment} download={data.storagePath.slice(37)}> 
                                    Download
                                </StyledAnchorTag> 
                        }
                    </StyledMenuItem>
                    <StyledMenuItem> Delete </StyledMenuItem>       
                </Select>  
            </Box>
            <DottedDivider />
        </Box>
      );
}