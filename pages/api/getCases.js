import moment from "moment";

function createData(
  caseID, //int
  firstName, //string
  lastName, //string
  dateOfBirth, //string
  procedureDate, //datetime
  procedureLocation, //string
  patientAddress, //string
  specialNeeds, //string
  mobilePhone,
  homePhone,
  allergies,
  surgeryLength,
  comments,
  admissionType,
  surgeryAssistance,
  procedures,
  notes,
  //confirmationNumber, //int
  proceduralist, //string
  //attachments, //array of JSON
  //caseProgress, //JSON
  //caseStatus, //string
  mrn, //integer
  steps //object
) {
  return {
    caseID,
    firstName,
    lastName,
    dateOfBirth,
    procedureDate,
    procedureLocation,
    patientAddress,
    specialNeeds,
    mobilePhone,
    homePhone,
    allergies,
    surgeryLength,
    comments,
    admissionType,
    surgeryAssistance,
    procedures,
    notes,
    //confirmationNumber,
    proceduralist,
    //attachments,
    //caseProgress,
    //caseStatus,
    mrn,
    steps,
  };
}

const fakeData = [
  createData(
    "12345",
    "Luke",
    "Skywalker",
    "02/01/1990",
    "2022-08-28T00:00:00Z",
    "Anch-To",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Medical Droid",
    "5678567890",
    [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "23456",
    "Darth",
    "Vader",
    "02/01/1982",
    "2022-08-28T00:00:00Z",
    "Death Star Medical Center",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Emperor Palpatine, MD",
    "5678567890",
    [
      { text: "Booking Sheet", status: false },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "67890",
    "Han",
    "Solo",
    "04/12/2000",
    "2022-08-28T22:15:01Z",
    "Millenium Falcon",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Lando",
    "5678567890",
    [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: true },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "29322",
    "Zoro",
    "Roronoa",
    "02/01/1982",
    "2022-08-21T00:00:00Z",
    "Luffy's ship",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Doctor Nami",
    "5678567890",
    [
      { text: "Booking Sheet", status: false },
      { text: "Insurance Verification", status: false },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: false },
      { text: "Tray(s) Delivery", status: false }
    ]
  ),
  createData(
    "30876",
    "Ace",
    "Portgas",
    "02/01/1993",
    "2022-08-21T00:00:00Z",
    "Whitebeard's ship",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Doctor Whitebeard",
    "5678567890",
    [
      { text: "Booking Sheet", status: false },
      { text: "Insurance Verification", status: false },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "10918",
    "Koby",
    "Helmeppo",
    "04/15/2002",
    "2022-08-21T00:00:00Z",
    "Marine's ship",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Doctor Garp",
    "5678567890",
    [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: false },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "10798",
    "Dwight",
    "Schrute",
    "04/15/1972",
    "2022-09-01T00:00:00Z",
    "IHOP off exit 42",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Dentist Crentist",
    "5678567890",
    [
      { text: "Booking Sheet", status: false },
      { text: "Insurance Verification", status: false },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: false },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "14998",
    "Jimbei",
    "Boss",
    "04/15/1972",
    "2022-09-01T00:00:00Z",
    "Fishman Island",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Doctor Hachi",
    "5678567890",
    [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "10919",
    "Boa",
    "Hancock",
    "04/15/1972",
    "2022-09-01T00:00:00Z",
    "Amazon Lily",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Doctor Love",
    "5678567890",
    [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
  createData(
    "10920",
    "Bon (Honorary Straw Hat)",
    "Clay",
    "04/15/1972",
    "2022-09-21T00:00:00Z",
    "Impel Down",
    "Grand Line",
    "Special Needs",
    "999-999-9999",
    "111-111-1111",
    "Apple Allergy",
    "1 hour",
    "Comment",
    "Inpatient",
    "Doctor Assist",
    "Foot Surgery",
    "Note",
    "Doctor Iva",
    "5678567890",
    [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  ),
];

export default function handler(req, res) {
  let filteredJSON = fakeData;

  if (req.query.dateRangeStart) {
    filteredJSON = filteredJSON.filter((data) =>
      moment(data.procedureDate)
        .utc()
        .isSameOrAfter(moment(req.query.dateRangeStart).utc(), "day")
    );
  }

  filteredJSON.sort(function(case1, case2) {
    return new Date(case1.procedureDate) - new Date(case2.procedureDate)
  })

  const dateFormattedFilteredJSON = filteredJSON.map(function(item) {
    item.procedureDate = moment(item.procedureDate).utc().format('M/DD/YYYY')
    return item;
  });


  res.status(200).json(dateFormattedFilteredJSON);
}
