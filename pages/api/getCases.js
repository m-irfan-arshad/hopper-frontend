import moment from "moment";
import * as R from "ramda";

function createData(
  caseID, //int
  firstName, //string
  lastName, //string
  dateOfBirth, //string
  procedureDate, //datetime
  procedureLocation, //string
  //confirmationNumber, //int
  proceduralist, //string
  //attachments, //array of JSON
  //caseProgress, //JSON
  //caseStatus, //string
  mrn //integer
) {
  return {
    caseID,
    firstName,
    lastName,
    dateOfBirth,
    procedureDate,
    procedureLocation,
    //confirmationNumber,
    proceduralist,
    //attachments,
    //caseProgress,
    //caseStatus,
    mrn,
  };
}

const fakeData = [
  createData(
    12345,
    "Captain",
    "Whitebeard",
    "02/01/1990",
    "2022-05-05T00:00:00Z",
    "Whitebeard's ship",
    //123,
    "Doctor Whitebeard",
    // [
    //   {
    //     name: "first Whitebeard attachment",
    //     id: "WhitebeardRandomID123",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    //"complete",
    5678567890
  ),
  createData(
    23456,
    "Blackbeard",
    "Teach",
    "02/01/1982",
    "2022-05-29T00:00:00Z",
    "Blackbeard's ship",
    //234,
    "Doctor Moria",
    // [
    //   {
    //     name: "first Blackbeard attachment",
    //     id: "BlackbeardRandomID123",
    //   },
    // ],
    // {
    //   step1: false,
    //   step2: false,
    // },
    // "incomplete",
    5678567890
  ),
  createData(
    67890,
    "Luffy",
    "Monkey",
    "04/12/2000",
    "2022-05-29T22:15:01Z",
    "Luffy's ship",
    //567,
    "Doctor Chopper",
    // [
    //   {
    //     name: "first Luffy attachment",
    //     id: "randomID-1934",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: true,
    // },
    //"canceled",
    5678567890
  ),
  createData(
    29322,
    "Zoro",
    "Roronoa",
    "02/01/1982",
    "2022-05-17T00:00:00Z",
    "Luffy's ship",
    //190,
    "Doctor Nami",
    // [
    //   {
    //     name: "first Zoro attachment",
    //     id: "randomID09381",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    //"closed",
    5678567890
  ),
  createData(
    30876,
    "Ace",
    "Portgas",
    "02/01/1993",
    "2022-05-17T00:00:00Z",
    "Whitebeard's ship",
    //101,
    "Doctor Whitebeard",
    // [
    //   {
    //     name: "first Ace attachment",
    //     id: "randomID0331",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    // "alert",
    5678567890
  ),
  createData(
    10918,
    "Koby",
    "Helmeppo",
    "04/15/2002",
    "2022-05-17T00:00:00Z",
    "Marine's ship",
    // 490,
    "Doctor Garp",
    // [
    //   {
    //     name: "first Koby attachment",
    //     id: "randomID09389098",
    //   },
    //   {
    //     name: "second Koby attachment",
    //     id: "randomIDSUPER123",
    //   },
    //   {
    //     name: "third Koby attachment",
    //     id: "randomIDKOBY",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    //"pending override",
    5678567890
  ),
  createData(
    10798,
    "Franky",
    "SUPER",
    "04/15/1972",
    "2022-05-17T00:00:00Z",
    "Luffy's ship",
    //744,
    "Doctor Vegapunk",
    // [
    //   {
    //     name: "first Franky attachment",
    //     id: "randomIDSUPER",
    //   },
    //   {
    //     name: "second Franky attachment",
    //     id: "randomIDSUPER2",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    // "complete",
    5678567890
  ),
  createData(
    14998,
    "Jimbei",
    "Boss",
    "04/15/1972",
    "2022-06-01T00:00:00Z",
    "Fishman Island",
    //744,
    "Doctor Hachi",
    // [
    //   {
    //     name: "first test attachment",
    //     id: "randomIDTest",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    // "complete",
    5678567890
  ),
  createData(
    10919,
    "Boa",
    "Hancock",
    "04/15/1972",
    "2022-06-17T00:00:00Z",
    "Amazon Lily",
    //744,
    "Doctor Love",
    // [
    //   {
    //     name: "first test attachment",
    //     id: "randomIDTest",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    // "complete",
    5678567890
  ),
  createData(
    10919,
    "Bon (Honoray Straw Hat)",
    "Clay",
    "04/15/1972",
    "2022-06-15T00:00:00Z",
    "Impel Down",
    //744,
    "Doctor Iva",
    // [
    //   {
    //     name: "first test attachment",
    //     id: "randomIDTest",
    //   },
    // ],
    // {
    //   step1: true,
    //   step2: false,
    // },
    // "complete",
    5678567890
  ),
];

function transformCases(cases) {
  let transformedObj = {};

    cases.map(function(patientCase){
      const procedureDateFormatted = moment(patientCase.procedureDate).utc().format('MMMM DD, YYYY');
        return transformedObj[procedureDateFormatted] 
        ? transformedObj[procedureDateFormatted].push(patientCase) 
        : transformedObj[procedureDateFormatted] = [patientCase];
    });

    return transformedObj;
}

export default function handler(req, res) {
  let filteredJSON = fakeData;

  if (req.query.dateRangeStart) {
    filteredJSON = filteredJSON.filter((data) =>
      moment(data.procedureDate)
        .utc()
        .isSameOrAfter(moment(req.query.dateRangeStart).utc(), "day")
    );
  }

  if (req.query.dateRangeEnd) {
    filteredJSON = filteredJSON.filter((data) =>
      moment(data.procedureDate)
        .utc()
        .isSameOrBefore(moment(req.query.dateRangeEnd).utc(), "day")
    );
  }

  if (req.query.procedureDate) {
    filteredJSON = filteredJSON.filter(
      (data) =>
        moment(data.procedureDate).utc().format("MM-DD-YYYY") ===
        req.query.procedureDate
    );
  }

  if (req.query.procedureLocation) {
    filteredJSON = filteredJSON.filter((data) =>
      R.toUpper(data.procedureLocation).includes(
        R.toUpper(req.query.procedureLocation)
      )
    );
  }

  if (req.query.proceduralist) {
    filteredJSON = filteredJSON = filteredJSON.filter((data) =>
      R.toUpper(data.proceduralist).includes(R.toUpper(req.query.proceduralist))
    );
  }

  res.status(200).json(transformCases(filteredJSON));
}
