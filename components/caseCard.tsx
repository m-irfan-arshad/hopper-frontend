import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import * as R from 'ramda';
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
  useMediaQuery,
} from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { 
  ArrowDropDownOutlined as ArrowDropDownOutlinedIcon,
  CircleOutlined as CircleOutlinedIcon,
  Biotech as BiotechIcon,
  Assignment as AssignmentIcon,
  Ballot as BallotIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { caseCardProcedureInformation, caseCardCaseIdentifiers, Step, SingleCase, caseStepMappings } from "../reference";
import CaseSummaryDialog from "./caseSummaryDialog";
import { defaultTheme } from "../theme";
import moment from "moment";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

interface CaseCardProps {
  row: SingleCase
}

interface HeaderCellProps {
  title: string;
  icon: React.ReactNode;
}

interface InfoCellProps {
  name: {
    label: string;
    id: string;
  }
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

  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
  const numberOfCompletedSteps: number = Object.keys(row.steps).reduce((acc: any, key: string) => row.steps[key] === "Complete" ? 1 + acc : 0 + acc , 0);
  const threatOfCancellation = moment(row.procedureDate, 'MM/DD/YYYY').diff(moment(), 'hours') <= 24;
  console.log("threatOfCancellation: ", moment(row.procedureDate, 'MM/DD/YYYY').diff(moment.now(), 'hours'))

  const cardStyle = {
    paddingLeft: "0.625rem",
    "& .MuiCardHeader-avatar": {
      margin: "0rem"
    },
    "& .MuiButtonBase-root": {
      padding: 0,
    },
    borderBottom: expanded ? 1 : "none",
    borderColor: "gray.main", 
  };

  const linearProgressStyle = {
    height: "0.688rem", 
    width: "8.125rem", 
    marginLeft: "auto", 
    alignSelf: "center",
    borderRadius: "0.625rem",
    "& .MuiLinearProgress-bar": {
      backgroundColor: calculateProgressBarColor(numberOfCompletedSteps),
      borderRadius: "0.625rem"
    },
    backgroundColor: "gray.main"
  }

  const HeaderCell = (props: HeaderCellProps) => {
    const { title, icon } = props;
    return (
    <Grid item xs={12} sx={{marginTop: "0.625rem", marginBottom: {xs: "1.75rem", sm: "0.75rem"}}}> 
      <Typography 
        variant="subtitle2"
        sx={{ 
            display: "flex", 
            alignItems: "center",
            marginLeft: "1.5rem",
        }}
      > 
        {icon}
        {title}
      </Typography>
    </Grid>)
  }

  const InfoCell = (props: InfoCellProps) => {
    const { name } = props;
    return (
    <Grid item xs={6} sm={3} sx={{paddingLeft: "2rem", marginBottom: {xs: "1.75rem", sm: "1.5rem"}}}> 
      <Typography variant="caption" sx={{ marginBottom: "0.125rem"}}> 
        {name.label}
      </Typography>
      <Typography variant="body2" data-testid={name.id}> 
        {calculateInfoCellValue(props)}
      </Typography>
    </Grid>)
  }

  const CaseSummaryButton = () => {
    return (<Button 
      variant="contained"
      size="small"
      onClick={() => setDialogState(true)}
      sx={{marginTop: "0.75rem"}}
    >
      <BallotIcon 
        sx={{
          height: "1rem", 
          width: "1rem", 
          marginRight: "0.438rem"
        }}
      />
        Case Summary
    </Button>)
  }

  function calculateInfoCellValue(props: InfoCellProps) {
    const { name } = props;
    if (row[name.id]) {
      return row[name.id];
    } else if (R.path(['patients', name.id], row)) {
      return R.path(['patients', name.id], row);
    } else {
      return 'N/A'
    }
  } 

  return (
    <React.Fragment>
    <CaseSummaryDialog open={isDialogOpen} closeDialog={() => setDialogState(false)} row={row} />
    <Box sx={{ marginTop: "0.938rem" }}>
      <Card sx={{ border: 1, borderColor: "gray.main", boxShadow: "none"}}>
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
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography sx={{marginLeft: "0.438rem"}} variant="subtitle1">{`${row.patients?.lastName}, ${row.patients?.firstName}`}</Typography>
              <Typography
                variant="caption"
                sx={{ marginLeft: "0.625rem", marginTop: "0.313rem" }}
              >
                {row.patients?.dateOfBirth}
              </Typography>
              <Typography
                variant="caption"
                sx={{ marginTop: "0.313rem", marginLeft: "0.313rem" }}
              >
                {`- ${row.patients?.mrn}`}
              </Typography>

              {threatOfCancellation && <NotificationImportantIcon color="error" fontSize="small" sx={{position: "relative", top: "0.313rem", left: "0.626rem"}}/>}
              
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
                borderColor:  {xs: "gray.main", sm: "gray.main"},
                height: "50%", 
              }}
            >
              <HeaderCell title={"Procedure Information"} icon={<BiotechIcon sx={{height: '1.25rem', width: "1.25rem", marginRight: "0.313rem"}}/>} />
                {
                  caseCardProcedureInformation.map((name, index) => (
                      <InfoCell name={name} key={index}/>
                  ))
                }
            </Grid>
            <Grid
              container
              sx={{ borderRight: {xs: 0, sm:"0.063rem dotted"}, borderColor: {xs: 'none', sm: "gray.main"}, height: "50%"}}
            >
              <HeaderCell title={"Case Identifiers"} icon={<AssignmentIcon sx={{ height: '1.25rem', width: "1.25rem", marginRight: "0.313rem"}} />} />
              {
                caseCardCaseIdentifiers.map((name, index) => (
                    <InfoCell name={name} key={index} />
                ))
              }
            </Grid>
            {isMobile && <CaseSummaryButton />}
            
            </Box>
            {!isMobile 
            && <List dense sx={{width: "28%", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Typography variant="subtitle2" sx={{alignSelf: "flex-start", paddingLeft: "1.1rem", marginBottom: "0.313rem"}}>
                 Progress
              </Typography>
                {Object.keys(row.steps).map((key, index) => (
                  <ListItem
                    key={index}
                  >
                    { row.steps[key] === "Complete" ?
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
                            color: "gray.main"
                          }}
                      />
                    }
                    <Typography variant={row.steps[key] === "Complete"  ? "subtitle2" : "body2"} sx={{color: row.steps[key] === "Complete"  ? "green.main" : "inherit"}}>
                      {caseStepMappings[key as keyof typeof caseStepMappings]}
                    </Typography>
                  </ListItem>
                ))}
                <CaseSummaryButton />
            </List>
            }
          </Box>
        </Collapse>
      </Card>
    </Box>
    </React.Fragment>
  );
}