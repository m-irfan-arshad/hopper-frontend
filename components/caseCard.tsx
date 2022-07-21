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
  ListItemText, 
  Button 
} from "@mui/material";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { 
  ArrowDropDownOutlined as ArrowDropDownOutlinedIcon,
  CircleOutlined as CircleOutlinedIcon,
  Biotech as BiotechIcon,
  ContentPaste as ContentPasteIcon,
  Ballot as BallotIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { caseCardProcedureInformation, caseCardCaseIdentifiers, Step, SingleCase } from "../reference";

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
    <Box sx={{ marginTop: "0.938rem" }}>
      <Card sx={{ border: 1, borderColor: "blue.light", boxShadow: "none"}}>
        <CardHeader
          avatar={
            <ExpandMore
              expand={expanded}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
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
              { expanded ? 
                <Button 
                  variant="outlined"
                  sx={{
                    marginLeft: "auto", 
                    alignSelf: "center",
                    borderRadius: "0.625rem",
                    backgroundColor: "gray.light",
                    borderColor: "blue.light"
                  }}
                >
                  <BallotIcon 
                    sx={{
                      marginLeft: "0.625rem", 
                      height: "1rem", 
                      width: "1rem", 
                      color: "blue.main"
                      }}
                  />
                  <Typography variant="h1" sx={{ padding: "0.313rem", color: "blue.main"}}>
                    View Case Summary
                  </Typography>
                </Button>

              : <LinearProgress 
                  variant="determinate" 
                  value={20 * numberOfCompletedSteps}
                  sx={linearProgressStyle} 
                />
                }
            </Box>
          }
          disableTypography
          sx={cardStyle}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              width: "100%",
              display: "flex",
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
              columns={5}
              sx={{ 
                borderBottom: "0.063rem dotted", 
                borderRight: "0.063rem dotted", 
                borderColor: "blue.light",
                height: "50%", 
                width: "100%" 
              }}
            >
            <Box 
              sx={{ 
                display: "flex", 
                marginTop: "1.563rem",  
                width: "100%",  
                marginLeft: "0.625rem"
              }}
            > 
              <Typography 
                variant="h1"
                sx={{ 
                    display: "flex", 
                    marginRight: "2.5rem",
                    width: "8.75rem"
                }}
              >
              <BiotechIcon sx={{color: "blue.main", marginRight: "0.313rem"}}/>
                {"Procedure Information"}
              </Typography>
              {caseCardProcedureInformation.map((name, index) => (
                  <Grid item key={index} sx={{width: "9.063rem",  padding: "0 1.25rem 0 1.25rem"}}>
                    <Typography>
                      {name.label}
                    </Typography>
                    <Typography>
                      {row[name.id] || "N/A"}
                    </Typography>
                  </Grid>
              ))}
               </Box>
            </Grid>
            <Grid
              container
              columns={5}
              sx={{ borderRight: "0.063rem dotted", borderColor: "blue.light", height: "50%"}}
            >
              <Box 
                sx={{ 
                  display: "flex", 
                  width: "100%", 
                  marginTop: "1.563rem", 
                  marginLeft: "0.625rem"
                }}
              >
               <Typography 
                  variant="h1"
                  sx={{ 
                      display: "flex", 
                      width: "8.75rem" ,
                      marginRight: "2.5rem"
                  }}
                >
                 <ContentPasteIcon sx={{color: "blue.main", marginRight: "0.313rem"}} />
                {"Case Identifiers"}
              </Typography>
            {caseCardCaseIdentifiers.map((name, index) => (
                  <Grid item key={index} sx={{width: "9.063rem", padding: "0 1.25rem 0 1.25rem"}}>
                    <Typography>
                      {name.label}
                    </Typography>
                    <Typography>
                      {row[name.id] || "N/A"}
                    </Typography>
                  </Grid>
              ))}
              </Box>
            </Grid>
            </Box>
            <List dense sx={{width: "20%"}}>
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
                    <Typography sx={{color: step.status ? "green.main" : "inherit"}}>
                      {step.text}
                    </Typography>
                  </ListItem>
                ))}
            </List>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
}
