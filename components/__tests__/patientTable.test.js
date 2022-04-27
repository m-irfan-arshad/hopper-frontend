import { render, waitFor, fireEvent, getByTestId } from "@testing-library/react";
import "@testing-library/jest-dom";
import PatientTable from "../patientTable";
import moment from "moment";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          time: "2022-04-20T19:14:35.749Z",
          patientName: "Adam",
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
          patientName: "Bob",
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
          patientName: "Cat",
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
          patientName: "Dog",
          dateOfBirth: "05/01/1996",
          proceduralist: "Crazy",
          procedureDate: moment().format("MM/DD/YYYY"),
          location: "Carolina Hospital",
          caseID: 2890,
          confirmationNum: 123,
          numOfAttachments: 0,
        },
        {
          time: "2022-04-20T15:14:35.749Z",
          patientName: "Scarecrow",
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
      expect(getByText("Adam")).toBeInTheDocument();
      expect(getByText("Whitebeard")).toBeInTheDocument();
      expect(getByText("Bob")).toBeInTheDocument();
      expect(getByText("Beerus")).toBeInTheDocument();
    });
  });

  test("handles the page sort for time and alphabetically", async () => {
    const { queryByText } = render(<PatientTable />);

    expect(queryByText("Proceduralist")).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText("Adam")).toBeInTheDocument();
      expect(queryByText("Whitebeard")).toBeInTheDocument();
      expect(queryByText("Bob")).toBeInTheDocument();
      expect(queryByText("Beerus")).toBeInTheDocument();
    });

    fireEvent.click(queryByText("Proceduralist"));

    expect(queryByText("Whitebeard")).not.toBeInTheDocument();
    expect(queryByText("Beerus")).toBeInTheDocument();

    fireEvent.click(queryByText("Proceduralist"));

    expect(queryByText("Beerus")).not.toBeInTheDocument();
    expect(queryByText("Whitebeard")).toBeInTheDocument();

    fireEvent.click(queryByText("DOB"));

    expect(queryByText("Cat")).not.toBeInTheDocument();
    expect(queryByText("Adam")).toBeInTheDocument();
  });

  test("handles which page u are on", async () => {
    const { queryByText, getByLabelText, container, getByDisplayValue } = render(<PatientTable />);

    expect(getByLabelText("Go to next page")).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText("Adam")).toBeInTheDocument();
    });

    expect(queryByText("Zoolander")).not.toBeInTheDocument();

    fireEvent.click(getByLabelText("Go to next page"));

    expect(queryByText("Zoolander")).toBeInTheDocument();
  });
});
