import moment from "moment";

function createData(
  caseID, //int
  firstName, //string
  lastName, //string
  dateOfBirth, //string
  procedureDate, //datetime
  procedureLocation, //string
  confirmationNumber, //int
  proceduralist, //string
  attachments, //array of JSON
  caseProgress, //JSON
  caseStatus //string
) {
  return {
    caseID,
    firstName,
    lastName,
    dateOfBirth,
    procedureDate,
    procedureLocation,
    confirmationNumber,
    proceduralist,
    attachments,
    caseProgress,
    caseStatus
  };
}

const fakeData = [
  createData(
    12345,
    "Captain",
    "Whitebeard",
    "02/01/1990",
    "2022-05-03T22:15:01Z",
    "Whitebeard's ship",
    123,
    "Doctor Whitebeard",
    [
      {
        name: 'first Whitebeard attachment',
        id: 'WhitebeardRandomID123'
      }
    ],
    {
      step1: true,
      step2: false
    },
    "complete"
  ),
  createData(
    23456,
    "Blackbeard",
    "Teach",
    "02/01/1982",
    "2022-04-29T00:00:00Z",
    "Blackbeard's ship",
    234,
    "Doctor Blackbeard",
    [
      {
        name: 'first Blackbeard attachment',
        id: 'BlackbeardRandomID123'
      }
    ],
    {
      step1: false,
      step2: false
    },
    "incomplete"
  ),
  createData(
    67890,
    "Luffy",
    "Monkey",
    "04/12/2000",
    "2022-04-29T22:15:01Z",
    "Luffy's ship",
    567,
    "Doctor Chopper",
    [
      {
        name: 'first Luffy attachment',
        id: 'randomID-1934'
      }
    ],
    {
      step1: true,
      step2: true
    },
    "canceled"
  ),
  createData(
    29322,
    "Zoro",
    "Roronoa",
    "02/01/1982",
    "2022-04-29T00:00:00Z",
    "Luffy's ship",
    190,
    "Doctor Chopper",
    [
      {
        name: 'first Zoro attachment',
        id: 'randomID09381'
      }
    ],
    {
      step1: true,
      step2: false
    },
    "closed"
  ),
  createData(
    30876,
    "Ace",
    "Portgas",
    "02/01/1993",
    "2022-04-29T00:00:00Z",
    "Whitebeard's ship",
    101,
    "Doctor Whitebeard",
    [
      {
        name: 'first Ace attachment',
        id: 'randomID0331'
      }
    ],
    {
      step1: true,
      step2: false
    },
    "alert"
  ),
  createData(
    10998,
    "Koby",
    "Marine",
    "04/15/2002",
    "2022-04-29T00:00:00Z",
    "Marine's ship",
    490,
    "Doctor Marine",
    [
      {
        name: 'first Koby attachment',
        id: 'randomID09389098'
      },
      {
        name: 'second Koby attachment',
        id: 'randomIDSUPER123'
      },
      {
        name: 'third Koby attachment',
        id: 'randomIDKOBY'
      }
    ],
    {
      step1: true,
      step2: false
    },
    "pending override"
  ),
  createData(
    10998,
    "Franky",
    "SUPER",
    "04/15/1972",
    "2022-04-29T00:00:00Z",
    "Luffy's ship",
    744,
    "Doctor Chopper",
    [
      {
        name: 'first Franky attachment',
        id: 'randomIDSUPER'
      },
      {
        name: 'second Franky attachment',
        id: 'randomIDSUPER2'
      }
    ],
    {
      step1: true,
      step2: false
    },
    "complete"
  ),
  createData(
    10998,
    "Test",
    "Patient",
    "04/15/1972",
    "2022-04-20T00:00:00Z",
    "Fishman Island",
    744,
    "Doctor Fish",
    [
      {
        name: 'first test attachment',
        id: 'randomIDTest'
      },
    ],
    {
      step1: true,
      step2: false
    },
    "complete"
  ),
];

export default function handler(req, res) {
  const responseJSON = fakeData.filter((data) => moment(data.procedureDate).utc().format('MM-DD-YYYY') === req.query.date)
  res.status(200).json(responseJSON);
}
