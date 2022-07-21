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
    paddingLeft: "10px",
    "& .MuiCardHeader-avatar": {
      margin: "0px"
    },
    "& .MuiButtonBase-root": {
      padding: 0,
    },
    borderBottom: expanded ? 1 : "none",
    borderColor: "blue.light", 
  };

  const linearProgressStyle = {
    height: "11px", 
    width: "130px", 
    marginLeft: "auto", 
    alignSelf: "center",
    borderRadius: "10px",
    "& .MuiLinearProgress-bar": {
      backgroundColor: calculateProgressBarColor(numberOfCompletedSteps)
    },
    backgroundColor: "blue.light"
  }

  return (
    <Box sx={{ marginTop: "15px" }}>
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
                sx={{ marginLeft: "10px", marginTop: "5px" }}
              >
                {row.dateOfBirth}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginTop: "5px", marginLeft: "5px" }}
              >
                {`- ${row.mrn}`}
              </Typography>
              { expanded ? 
                <Button 
                  variant="outlined"
                  sx={{
                    marginLeft: "auto", 
                    alignSelf: "center",
                    borderRadius: "10px",
                    backgroundColor: "gray.light",
                    borderColor: "blue.light"
                  }}
                >
                  <BallotIcon 
                    sx={{
                      marginLeft: "10px", 
                      height: "16px", 
                      width: "16px", 
                      color: "blue.main"
                      }}
                  />
                  <Typography variant="h1" sx={{ padding: "5px", color: "blue.main"}}>
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
                borderBottom: "1px dotted", 
                borderRight: "1px dotted", 
                borderColor: "blue.light",
                height: "50%", 
                width: "100%" 
              }}
            >
            <Box 
              sx={{ 
                display: "flex", 
                marginTop: "25px",  
                width: "100%",  
                marginLeft: "10px"
              }}
            > 
              <Typography 
                variant="h1"
                sx={{ 
                    display: "flex", 
                    marginRight: "40px",
                    width: "140px"
                }}
              >
              <BiotechIcon sx={{color: "blue.main", marginRight: "5px"}}/>
                {"Procedure Information"}
              </Typography>
              {caseCardProcedureInformation.map((name, index) => (
                  <Grid item key={index} sx={{width: "145px",  padding: "0 20px 0 20px"}}>
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
              sx={{ borderRight: "1px dotted", borderColor: "blue.light", height: "50%"}}
            >
              <Box 
                sx={{ 
                  display: "flex", 
                  width: "100%", 
                  marginTop: "25px", 
                  marginLeft: "10px"
                }}
              >
               <Typography 
                  variant="h1"
                  sx={{ 
                      display: "flex", 
                      width: "140px" ,
                      marginRight: "40px"
                  }}
                >
                 <ContentPasteIcon sx={{color: "blue.main", marginRight: "5px"}} />
                {"Case Identifiers"}
              </Typography>
            {caseCardCaseIdentifiers.map((name, index) => (
                  <Grid item key={index} sx={{width: "145px", padding: "0 20px 0 20px"}}>
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
                          height: "14px",
                          width: "14px",
                          marginRight: "5px",
                          color: "green.main"
                        }}
                      />

                      : <CircleOutlinedIcon
                          sx={{
                            height: "14px",
                            width: "14px",
                            marginRight: "5px",
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
