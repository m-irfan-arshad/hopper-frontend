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
      backgroundColor: calculateProgressBarColor(numberOfCompletedSteps),
      borderRadius: "0.625rem"
    },
    backgroundColor: "blue.light"
  }

  const HeaderCell = (props: HeaderCellProps) => {
    const { title, icon } = props;
    return (
    <Grid item xs={12} sx={{marginTop: "0.625rem", marginBottom: {xs: "1.75rem", sm: 0}}}> 
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
    <Grid item xs={6} sm={3} sx={{paddingLeft: "2rem", marginBottom: {xs: "1.75rem", sm: 0}}}> 
      <Typography variant="caption" sx={{ marginBottom: "0.125rem"}}> 
        {name.label}
      </Typography>
      <Typography variant="body2" data-testid={name.id}> 
        {row[name.id] || "N/A"}
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
            <Box sx={{ display: "flex", alignItems: "baseline" }}>
              <Typography sx={{marginLeft: "0.438rem"}} variant="subtitle1">{`${row.lastName}, ${row.firstName}`}</Typography>
              <Typography
                variant="caption"
                sx={{ marginLeft: "0.625rem", marginTop: "0.313rem" }}
              >
                {row.dateOfBirth}
              </Typography>
              <Typography
                variant="caption"
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
              <HeaderCell title={"Procedure Information"} icon={<BiotechIcon sx={{height: '1.25rem', width: "1.25rem", marginRight: "0.313rem"}}/>} />
                {
                  caseCardProcedureInformation.map((name, index) => (
                      <InfoCell name={name} key={index}/>
                  ))
                }
            </Grid>
            <Grid
              container
              sx={{ borderRight: {xs: 0, sm:"0.063rem dotted"}, borderColor: {xs: 'none', sm: "blue.light"}, height: "50%"}}
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
                    <Typography variant={step.status ? "subtitle2" : "body2"} sx={{color: step.status ? "green.main" : "inherit"}}>
                      {step.text}
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