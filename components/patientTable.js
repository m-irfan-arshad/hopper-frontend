import React, { useState } from "react";
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

function createData(
  time,
  patientName,
  dateOfBirth,
  proceduralist,
  procedureDate,
  location,
  caseID,
  confirmationNum,
  numOfAttachments
) {
  return {
    time,
    patientName,
    dateOfBirth,
    proceduralist,
    procedureDate,
    location,
    caseID,
    confirmationNum,
    numOfAttachments,
  };
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === "dateOfBirth" || orderBy === "time") {
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

const timeNow = moment().format("MM/DD/YYYY");
const yesterday = moment().subtract(1, "days").format("MM/DD/YYYY");
const tomorrow = moment().add(1, "days").format("MM/DD/YYYY");
const oneMonthFromNow = moment().add(1, "months").format("MM/DD/YYYY");

const rows = [
  createData(
    oneMonthFromNow,
    "adam",
    "02/01/1990",
    "Whitebeard",
    "02/10/2022",
    "Great Plains Hospital",
    2199,
    987,
    2
  ),
  createData(
    tomorrow,
    "bob",
    "05/01/1996",
    "Beerus",
    "02/20/2022",
    "Great Carolina Hospital",
    2890,
    123,
    0
  ),
  createData(
    yesterday,
    "cow",
    "02/25/1999",
    "Luffy",
    "02/22/2022",
    "Great Reef Hospital",
    2190,
    4,
    4
  ),
  createData(
    timeNow,
    "jon",
    "05/01/2000",
    "Don",
    "02/21/2022",
    "Cat Hospital",
    1190,
    56,
    1
  ),
  createData(
    yesterday,
    "igor",
    "06/07/1980",
    "Moria",
    "02/24/2022",
    "Zebra Hospital",
    2130,
    78,
    9
  ),
  createData(
    tomorrow,
    "ryan",
    "10/12/1970",
    "Bat",
    "03/05/2022",
    "Ireland Hospital",
    2140,
    12345678,
    7
  ),
  createData(
    yesterday,
    "zora",
    "12/12/1992",
    "Cube",
    "05/05/2022",
    "Hospital",
    2155,
    50,
    6
  ),
  createData(
    tomorrow,
    "sheik",
    "01/01/1970",
    "Mark",
    "06/05/2022",
    "Great Hospital",
    2111,
    456,
    10
  ),
  createData(
    timeNow,
    "faith",
    "02/12/1997",
    "Jorge",
    "07/05/2022",
    "Great Computer Hospital",
    1100,
    609,
    0
  ),
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

export default function PatientTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("time");
  const [selected, setSelected] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
                {rows
                  .slice()
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell>
                          <AcUnitIcon />
                        </TableCell>

                        <TableCell>{row.time}</TableCell>
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
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
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
