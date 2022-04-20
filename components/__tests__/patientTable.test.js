import { render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PatientTable from "../patientTable";
import moment from "moment";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          time: "2022-04-20T19:14:35.749Z",
          patientName: "adam",
          dateOfBirth: "02/01/1990",
          proceduralist: "Whitebeard",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Great Plains Hospital",
          caseID: 2199,
          confirmationNum: 987,
          numOfAttachments: 2,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "bob",
          dateOfBirth: "05/01/1996",
          proceduralist: "Beerus",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Great Carolina Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "cat",
          dateOfBirth: "05/01/1986",
          proceduralist: "Crazy",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Great Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "dog",
          dateOfBirth: "05/01/1996",
          proceduralist: "Bat",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Carolina Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "scarecrow",
          dateOfBirth: "05/01/1996",
          proceduralist: "Mark",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "Zoolander",
          dateOfBirth: "05/01/1996",
          proceduralist: "Cube",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Zoolander Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
      ]),
  })
);

describe("PatientTable", () => {
  test("renders the patient table", async () => {
    const { getByText } = render(<PatientTable />);

    expect(getByText("Time")).toBeInTheDocument();
    expect(getByText("Patient Name")).toBeInTheDocument();
    expect(getByText("DOB")).toBeInTheDocument();
    expect(getByText("Proceduralist")).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText("adam")).toBeInTheDocument();
      expect(getByText("Whitebeard")).toBeInTheDocument();
      expect(getByText("bob")).toBeInTheDocument();
      expect(getByText("Beerus")).toBeInTheDocument();
    });
  });

  test("handles the page sort for time and alphabetically", async () => {
    const { queryByText } = render(<PatientTable />);

    expect(queryByText("Proceduralist")).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText("adam")).toBeInTheDocument();
      expect(queryByText("Whitebeard")).toBeInTheDocument();
      expect(queryByText("bob")).toBeInTheDocument();
      expect(queryByText("Beerus")).toBeInTheDocument();
    });

    fireEvent.click(queryByText("Proceduralist"));

    expect(queryByText("adam")).not.toBeInTheDocument();
    expect(queryByText("cat")).toBeInTheDocument();

    fireEvent.click(queryByText("DOB"));

    expect(queryByText("cat")).not.toBeInTheDocument();
    expect(queryByText("adam")).toBeInTheDocument();
  });
});
