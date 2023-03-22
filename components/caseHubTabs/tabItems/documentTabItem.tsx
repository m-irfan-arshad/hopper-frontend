import React from "react";
import { Box, styled, IconButton, Select, MenuItem, Typography} from "@mui/material";
import { MoreVert } from '@mui/icons-material';
import DottedDivider from "../../shared/dottedDivider";
import moment from "moment";

interface Props {
    data: any;
}

export default function DocumentTabItem(props: Props) {

    const StyledMenuItem = styled(MenuItem)({
        fontSize: ".75rem" 
    });

    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{display: "flex", justifyContent: "space-between", paddingBottom: "1rem", paddingTop: "1rem"}}> 
                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
                    <Typography sx={{fontSize: "0.75rem", fontWeight: "500", textTransform: 'capitalize'}}>
                        {props.data.fileTypes.join(", ")} 
                    </Typography>
                    <Typography sx={{fontSize: "0.625rem"}}>
                        {props.data.description}
                    </Typography>
                    <Typography sx={{ marginTop: "0.5rem", fontSize: "0.75rem", fontStyle: "italic" }}>
                        {`${props.data.firstName} ${props.data.lastName} - ${moment(props.data.createTime).format('hh:mma, MM/DD/YYYY')}`}
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
                    <StyledMenuItem> Download </StyledMenuItem>
                    <StyledMenuItem> Delete </StyledMenuItem>       
                </Select>  
            </Box>
            <DottedDivider />
        </Box>
      );
}