import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { caseCardProcedureInformation, caseCardCaseIdentifiers, Step } from "../reference";
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import BiotechIcon from '@mui/icons-material/Biotech';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Button from '@mui/material/Button';
import BallotIcon from '@mui/icons-material/Ballot';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

interface CaseCardProps {
  row: {
    [key: string]: any,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    procedureDate: string,
    procedureLocation: string,
    proceduralist: string,
    mrn: string,
    steps: Step[]
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
  if (numberOfCompletedSteps < 2) {
    return "#EF5350";
  }
  if (numberOfCompletedSteps < 5) {
    return "#FFA726";
  }
  return "#66BB6A";
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
    borderBottom: expanded ? "1px solid #D8E4F4" : "none"
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
    backgroundColor: "#D8E4F4"
  }

  return (
    <Box sx={{ marginTop: "15px" }}>
      <Card sx={{ border: "1px solid #D8E4F4", boxShadow: "none"}}>
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
            <Box sx={{ display: "flex", color: "black.main" }}>
              {`${row.firstName} ${row.lastName}`}
              <Typography
                sx={{
                  marginLeft: "10px",
                  fontStyle: "italic",
                  fontSize: "12px",
                  marginTop: "5px"
                }}
              >
                {row.dateOfBirth}
              </Typography>
              <Typography
                sx={{
                  fontStyle: "italic",
                  fontSize: "12px",
                  marginTop: "5px",
                  marginLeft: "5px"
                }}
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
                    backgroundColor: "#F1F5F9",
                    borderColor: "#D8E4F4"
                  }}
                >
                  <BallotIcon 
                    sx={{
                      marginLeft: "10px", 
                      height: "16px", 
                      width: "16px", 
                      color: "#42A5F5"
                      }}
                  />
                  <Typography 
                    sx={{
                      padding: "5px", 
                      fontSize: "10px", 
                      color: "#42A5F5"
                    }}
                  >
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
          titleTypographyProps={{ fontSize: "16px" }}
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
                borderBottom: "1px dotted #D8E4F4", 
                borderRight: "1px dotted #D8E4F4", 
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
                sx={{ 
                    fontSize: "10px", 
                    display: "flex", 
                    fontWeight: "600",  
                    marginRight: "40px",
                }}
              >
              <BiotechIcon sx={{color: "#42A5F5", marginRight: "5px"}}/>
                {"Procedure Information"}
              </Typography>
              {caseCardProcedureInformation.map((name, index) => (
                  <Grid item key={index} sx={{width: "145px",  padding: "0 20px 0 20px"}}>
                    <Typography
                      sx={{ fontSize: "10px"}}
                    >
                      {name.label}
                    </Typography>
                    <Typography sx={{ fontSize: "10px"}}>
                      {row[name.id] || "N/A"}
                    </Typography>
                  </Grid>
              ))}
               </Box>
            </Grid>
            <Grid
              container
              columns={5}
              sx={{ borderRight: "1px dotted #D8E4F4", height: "50%"}}
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
                  sx={{ 
                      fontSize: "10px", 
                      display: "flex", 
                      fontWeight: "600",  
                      width: "140px" ,
                      marginRight: "40px"
                  }}
                >
                 <ContentPasteIcon sx={{color: "#42A5F5", marginRight: "5px"}} />
                {"Case Identifiers"}
              </Typography>
            {caseCardCaseIdentifiers.map((name, index) => (
                  <Grid item key={index} sx={{width: "145px", padding: "0 20px 0 20px"}}>
                    <Typography
                      sx={{ fontSize: "10px",}}
                    >
                      {name.label}
                    </Typography>
                    <Typography sx={{ fontSize: "10px"}}>
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
                          color: "#66BB6A"
                        }}
                      />

                      : <CircleOutlinedIcon
                          sx={{
                            height: "14px",
                            width: "14px",
                            marginRight: "5px",
                            color: "#D8E4F4"
                          }}
                      />
                    }
                    <ListItemText
                      primary={step.text}
                      primaryTypographyProps={{fontSize: "10px", color: step.status ? "#66BB6A" : "inherit"}}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        </Collapse>
      </Card>
    </Box>
  );
}
