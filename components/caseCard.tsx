import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { 
  Card, 
  CardHeader,
  Collapse, 
  Grid, 
  Box, 
  Typography, 
  LinearProgress, 
  List, ListItem, 
  Button,
  useMediaQuery
} from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { 
  ArrowDropDownOutlined as ArrowDropDownOutlinedIcon,
  CircleOutlined as CircleOutlinedIcon,
  Biotech as BiotechIcon,
  Assignment as AssignmentIcon,
  Ballot as BallotIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { caseCardProcedureInformation, caseCardCaseIdentifiers, Step, SingleCase } from "../reference";
import CaseSummaryDialog from "./caseSummaryDialog";
import { defaultTheme } from "../theme";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

interface CaseCardProps {
  row: SingleCase
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(270deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function calculateProgressBarColor(numberOfCompletedSteps: number) {
  if (numberOfCompletedSteps <= 1) {
    return "red.main";
  }
  if (numberOfCompletedSteps <= 4) {
    return "yellow.main";
  }
  return "green.main";
}


export default function CaseCard ({ row }: CaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDialogOpen, setDialogState] = useState(false);

  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm')); //use to move case summary button 
  const numberOfCompletedSteps: number = row.steps.reduce((acc: any, item: Step) => item.status + acc , 0);

  const cardStyle = {
    paddingLeft: "0.625rem",
    "& .MuiCardHeader-avatar": {
      margin: "0rem"
    },
    "& .MuiButtonBase-root": {
      padding: 0,
    },
    borderBottom: expanded ? 1 : "none",
    borderColor: "blue.light", 
  };

  const linearProgressStyle = {
    height: "0.688rem", 
    width: "8.125rem", 
    marginLeft: "auto", 
    alignSelf: "center",
    borderRadius: "0.625rem",
    "& .MuiLinearProgress-bar": {
      backgroundColor: calculateProgressBarColor(numberOfCompletedSteps)
    },
    backgroundColor: "blue.light"
  }

  return (
    <React.Fragment>
    <CaseSummaryDialog open={isDialogOpen} closeDialog={() => setDialogState(false)} row={row} />
    <Box sx={{ marginTop: "0.938rem" }}>
      <Card sx={{ border: 1, borderColor: "blue.light", boxShadow: "none"}}>
        <CardHeader
          avatar={
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              <ArrowDropDownOutlinedIcon sx={{ color: "black" }} />
            </ExpandMore>
          }
          title={
            <Box sx={{ display: "flex", alignItems: "center", color: "black.main" }}>
              <Typography variant="h2">{`${row.firstName} ${row.lastName}`}</Typography>
              <Typography
                variant="body2"
                sx={{ marginLeft: "0.625rem", marginTop: "0.313rem" }}
              >
                {row.dateOfBirth}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginTop: "0.313rem", marginLeft: "0.313rem" }}
              >
                {`- ${row.mrn}`}
              </Typography>
               <LinearProgress 
                  variant="determinate" 
                  value={20 * numberOfCompletedSteps}
                  sx={linearProgressStyle} 
                />  
            </Box>
          }
          disableTypography
          sx={cardStyle}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              width: "100%",
              display: "flex"
            }}
          >
             <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
            <Grid
              container        
              sx={{ 
                borderBottom: "0.063rem dotted", 
                borderRight: {xs: 0, sm:"0.063rem dotted"}, 
                borderColor:  {xs: "blue.light", sm: "blue.light"},
                height: "50%", 
              }}
            >
              <Grid item xs={12} sx={{marginTop: "0.625rem", marginBottom: {xs: "1.75rem", sm: 0}}}> 
                <Typography 
                  variant="h5"
                  sx={{ 
                      display: "flex", 
                      alignItems: "center",
                      marginLeft: "1.5rem",
                  }}
                >
                <BiotechIcon sx={{height: '1.25rem', width: "1.25rem", marginRight: "0.313rem"}}/>
                  {"Procedure Information"}
                </Typography>
              </Grid>
              {caseCardProcedureInformation.map((name, index) => (
                  <Grid item xs={6} sm={3} key={index} sx={{paddingLeft: "2rem", marginBottom: {xs: "1.75rem" ,sm: 0}}}> 
                    <Typography sx={{color: "gray.dark"}}> 
                      {name.label}
                    </Typography>
                    <Typography variant="h4" data-testid={name.id} sx={{}}> 
                      {row[name.id] || "N/A"}
                    </Typography>
                  </Grid>
              ))}
            </Grid>
            <Grid
              container
              sx={{ borderRight: {xs: 0, sm:"0.063rem dotted"}, borderColor: {xs: 'none', sm: "blue.light"}, height: "50%"}}
            >
              <Grid item xs={12} sx={{marginTop: "0.625rem", marginBottom: {xs: "1.75em", sm: 0}}}> 
                <Typography 
                  variant="h5"
                  sx={{ 
                      display: "flex", 
                      alignItems: "center",
                      marginLeft: "1.5rem",
                  }}
                >
                <AssignmentIcon sx={{ height: '1.25rem', width: "1.25rem", marginRight: "0.313rem"}} />
                  {"Case Identifiers"}
                </Typography>
              </Grid>   
            {caseCardCaseIdentifiers.map((name, index) => (
                  <Grid item xs={6} sm={3} key={index} sx={{paddingLeft: "2rem",  marginBottom: {xs: "1.75rem" ,sm: 0}}}> 
                  <Typography sx={{color: "gray.dark"}}>
                      {name.label}
                    </Typography>
                    <Typography variant="h4">
                      {row[name.id] || "N/A"}
                    </Typography>
                  </Grid>
              ))}
            </Grid>
            {isMobile 
              && <Button 
                  variant="outlined"
                  onClick={() => setDialogState(true)}
                  sx={{
                    backgroundColor: "blue.dark",
                    borderRadius: 0,
                    padding: 0,
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "blue.dark"
                    }
                  }}
                >
                  <BallotIcon 
                    sx={{
                      height: "1rem", 
                      width: "1rem", 
                      color: "white.main"
                      }}
                  />
                  <Typography variant="body1" sx={{ padding: "0.313rem", color: "white.main"}}>
                    Case Summary
                  </Typography>
                </Button>
              }
            </Box>
            {
            !isMobile 
            && <List dense sx={{width: "28%", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Typography variant="h5" sx={{alignSelf: "flex-start", paddingLeft: "1.1rem", marginBottom: "0.313rem"}}>
                 Progress
              </Typography>
                {row.steps.map((step, index) => (
                  <ListItem
                    key={index}
                  >
                    { step.status ?
                      <CheckCircleIcon
                        sx={{
                          height: "0.875rem",
                          width: "0.875rem",
                          marginRight: "0.313rem",
                          color: "green.main"
                        }}
                      />

                      : <CircleOutlinedIcon
                          sx={{
                            height: "0.875rem",
                            width: "0.875rem",
                            marginRight: "0.313rem",
                            color: "blue.light"
                          }}
                      />
                    }
                    <Typography variant={step.status? "h5" : "h4"} sx={{color: step.status ? "green.main" : "inherit"}}>
                      {step.text}
                    </Typography>
                  </ListItem>
                ))}
                <Button 
                  variant="outlined"
                  onClick={() => setDialogState(true)}
                  sx={{
                    backgroundColor: "blue.dark",
                    padding: 0,
                    width: "70%",
                    marginTop: "1rem",
                    maxWidth: "8.75rem",
                    marginBottom: "0.75rem",
                    "&:hover": {
                      backgroundColor: "blue.dark"
                    }
                  }}
                >
                  <BallotIcon 
                    sx={{
                      height: "1rem", 
                      width: "1rem", 
                      color: "white.main"
                      }}
                  />
                  <Typography variant="body1" sx={{ padding: "0.313rem", color: "white.main"}}>
                    Case Summary
                  </Typography>
                </Button>
            </List>
            }
          </Box>
        </Collapse>
      </Card>
    </Box>
    </React.Fragment>
  );
}