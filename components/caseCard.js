import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
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

const cardStyle = {
  paddingLeft: "10px",
  "& .MuiCardHeader-avatar": {
    margin: "0px",
  },
  "& .MuiButtonBase-root": {
    padding: 0,
  },
};

export default function CaseCard({ row }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ width: "95%", marginLeft: "70px", marginTop: "20px" }}>
      <Card sx={{ backgroundColor: "#D3D3D3" }}>
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
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              {`${row.firstName} ${row.lastName}`}
              <Typography
                sx={{
                  marginLeft: "10px",
                  fontStyle: "italic",
                  fontSize: "14px",
                }}
              >
                {row.dateOfBirth}
              </Typography>
            </Box>
          }
          titleTypographyProps={{ fontSize: "16px" }}
          sx={cardStyle}
        />

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              width: "100%",
              flexGrow: 1,
              backgroundColor: "#A9A9A9",
              paddingTop: "15px",
              paddingBottom: "15px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <Grid
              container
              columns={6}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {caseCardSubFields.map((name, index) => (
                <React.Fragment key={index}>
                  <Grid item key={index}>
                    <Typography
                      sx={{ fontSize: "12px", fontWeight: "600"}}
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
        </Collapse>
      </Card>
    </Box>
  );
}
