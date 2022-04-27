import { render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StaticDatePicker from "../staticDatePicker";
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
          proceduralist: "Bat",
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

describe("StaticDatePicker", () => {
  test("renders the datepicker table", () => {
    const { getByText } = render(<StaticDatePicker />);

    expect(getByText(moment().month())).toBeInTheDocument();
    expect(getByText(moment().year())).toBeInTheDocument();
  });

  test("handles changing the date", async () => {
    const { queryByText } = render(<StaticDatePicker />);
    const yesterdayString = `${moment().subtract(1, "days").date()}`;

    await waitFor(() => {
      expect(queryByText("Adam")).toBeInTheDocument();
      expect(queryByText("Whitebeard")).toBeInTheDocument();
      expect(queryByText("Bob")).toBeInTheDocument();
      expect(queryByText("Beerus")).toBeInTheDocument();
    });

    expect(queryByText(yesterdayString)).toBeInTheDocument();

    fireEvent.click(queryByText(yesterdayString));

    expect(queryByText("Adam")).not.toBeInTheDocument();
    expect(queryByText("Cat")).not.toBeInTheDocument();
    expect(queryByText("Bob")).not.toBeInTheDocument();
    expect(queryByText("Beerus")).not.toBeInTheDocument();
  });
});
