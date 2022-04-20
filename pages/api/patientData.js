import moment from "moment";

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

const timeNow = moment();
const oneHourBefore = moment().subtract(1, "hour");
const oneHourLater = moment().add(1, "hour");
const threeHoursLater = moment().add(3, "hour");

const fakeData = [
  createData(
    threeHoursLater,
    "adam",
    "02/01/1990",
    "Whitebeard",
    "04/28/2022",
    "Great Plains Hospital",
    2199,
    987,
    2
  ),
  createData(
    oneHourBefore,
    "bob",
    "05/01/1996",
    "Beerus",
    "04/20/2022",
    "Great Carolina Hospital",
    2890,
    123,
    0
  ),
  createData(
    oneHourLater,
    "cow",
    "02/25/1999",
    "Luffy",
    "04/28/2022",
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
    "04/28/2022",
    "Cat Hospital",
    1190,
    56,
    1
  ),
  createData(
    oneHourLater,
    "igor",
    "06/07/1980",
    "Moria",
    "04/28/2022",
    "Zebra Hospital",
    2130,
    78,
    9
  ),
  createData(
    oneHourBefore,
    "ryan",
    "10/12/1970",
    "Bat",
    "04/20/2022",
    "Ireland Hospital",
    2140,
    12345678,
    7
  ),
  createData(
    oneHourLater,
    "zora",
    "12/12/1992",
    "Cube",
    "04/20/2022",
    "Hospital",
    2155,
    50,
    6
  ),
  createData(
    oneHourBefore,
    "sheik",
    "01/01/1970",
    "Mark",
    "04/20/2022",
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
    "04/20/2022",
    "Great Computer Hospital",
    1100,
    609,
    0
  ),
  createData(
    timeNow,
    "new",
    "02/12/1997",
    "Newbury",
    "04/28/2022",
    "Newest Hospital",
    1100,
    609,
    0
  ),
  createData(
    oneHourLater,
    "eleven",
    "02/12/1956",
    "Buggy",
    "04/28/2022",
    "Clown Hospital",
    1100,
    609,
    0
  ),
];

export default function handler(req, res) {
  res.status(200).json(fakeData);
}
