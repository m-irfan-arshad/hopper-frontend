import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import moment from "moment";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function descendingComparator(a, b, orderBy) {
  if (orderBy === "dateOfBirth") {
    if (moment(a[orderBy]).unix() - moment(b[orderBy]).unix() > 0) {
      return 1;
    }
    if (moment(b[orderBy]).unix() - moment(a[orderBy]).unix() > 0) {
      return -1;
    }
    return 0;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "time",
    label: "Time",
  },
  {
    id: "patientName",
    label: "Patient Name",
  },
  {
    id: "dateOfBirth",
    label: "DOB",
  },
  {
    id: "proceduralist",
    label: "Proceduralist",
  },
  {
    id: "procedureDate",
    label: "Procedure Date",
  },
  {
    id: "location",
    label: "Location",
  },
  {
    id: "caseID",
    label: "Medtel Case ID",
  },
  {
    id: "confirmationNum",
    label: "Confirmation #",
  },
  {
    id: "numOfAttachments",
    label: "# of Attachments",
  },
];

function SortableTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <AcUnitIcon />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function PatientTable(props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("patientName");
  const [rows, setRows] = useState([]);

  const fetchPatientData = async () => {
    const response = await fetch("/api/patientData");
    const rows = await response.json();
    setRows(rows);
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const styles = {
    container: {
      width: {
        xs: "200px",
        sm: "300px",
        md: "400px",
        lg: "600px",
        xl: "800px",
      },
      marginTop: "20px",
    },
  };

  //custom breakpoints
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 300, //if at least 300px and less than the next md (etc.)
        md: 600,
        lg: 900,
        xl: 1200,
      },
    },
  });

  const filteredRows = rows.length
    ? rows.filter(
        (row) => row.procedureDate === moment(props.date).format("MM/DD/YYYY")
      )
    : rows;

  const sortedRows = rows.length
    ? filteredRows
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : rows;

  return (
    <Box sx={{ marginLeft: "100px" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <ThemeProvider theme={theme}>
          <TableContainer sx={styles.container}>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <SortableTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {sortedRows.map((row) => {
                  return (
                    <TableRow tabIndex={-1} key={row.name}>
                      <TableCell>
                        <AcUnitIcon />
                      </TableCell>

                      <TableCell>
                        {moment(row.time).format("hh:MM A")}
                      </TableCell>
                      <TableCell>{row.patientName}</TableCell>
                      <TableCell>{row.dateOfBirth}</TableCell>
                      <TableCell>{row.proceduralist}</TableCell>
                      <TableCell>{row.procedureDate}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.caseID}</TableCell>
                      <TableCell>{row.confirmationNum}</TableCell>
                      <TableCell>{row.numOfAttachments}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ThemeProvider>
      </Paper>
    </Box>
  );
}
