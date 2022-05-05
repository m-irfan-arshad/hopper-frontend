import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { caseCardSubFields } from "../reference";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(270deg)" : "rotate(0deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

//  marginRight: "0px !important",

export default function CaseCard({ row }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Box sx={{ width: "95%", marginLeft: "70px", marginTop: "20px" }}>
      <Card sx={{ backgroundColor: "#A9A9A9" }}>
        <CardHeader
          avatar={
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ArrowDropDownOutlinedIcon />
            </ExpandMore>
          }
          title={`${row.firstName} ${row.lastName}`} //need to include DOB and patient name
          titleTypographyProps={{ fontSize: "16px" }}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Box sx={{ width: "100%", flexGrow: 1 }}>
              <Grid container columns={6}>
                {caseCardSubFields.map((name, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={1} key={index}>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {name.label}
                      </Typography>
                      <Typography sx={{ fontSize: "12px" }}>
                        {row[name.id] || "N/A"}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
}
