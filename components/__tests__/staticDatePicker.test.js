import { render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StaticDatePicker from "../staticDatePicker";
import moment from "moment";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          firstName: "Adam",
          lastName: "Crazy",
          dateOfBirth: "02/01/1990",
          proceduralist: "Whitebeard",
          procedureDate: moment().format("MM/DD/YYYY"),
          procedureLocation: "Great Plains Hospital",
          caseID: 2199,
          confirmationNumber: 987,
          attachments: [
            {
              name: "attach",
              id: "id",
            },
          ],
          caseProgress: {
            step1: false,
          },
          caseStatus: "complete",
        },
        {
          firstName: "Bob",
          lastName: "Builder",
          dateOfBirth: "05/01/1996",
          proceduralist: "Beerus",
          procedureDate: moment().format("MM/DD/YYYY"),
          procedureLocation: "Great Carolina Hospital",
          caseID: 2890,
          confirmationNumber: 123,
          attachments: [
            {
              name: "attach",
              id: "id",
            },
          ],
          caseProgress: {
            step1: false,
          },
          caseStatus: "complete",
        },
        {
          firstName: "Cat",
          lastName: "Dog",
          dateOfBirth: "05/01/1986",
          proceduralist: "Crazy",
          procedureDate: moment().format("MM/DD/YYYY"),
          procedureLocation: "Great Hospital",
          caseID: 2890,
          confirmationNumber: 123,
          attachments: [
            {
              name: "attach",
              id: "id",
            },
          ],
          caseProgress: {
            step1: false,
          },
          caseStatus: "complete",
        },
        {
          firstName: "Dog",
          lastName: "Bird",
          dateOfBirth: "05/01/1996",
          proceduralist: "Bat",
          procedureDate: moment().format("MM/DD/YYYY"),
          procedureLocation: "Carolina Hospital",
          caseID: 2890,
          confirmationNumber: 123,
          attachments: [
            {
              name: "attach",
              id: "id",
            },
          ],
          caseProgress: {
            step1: false,
          },
          caseStatus: "complete",
        },
        {
          firstName: "Scarecrow",
          lastName: "fiddlesticks",
          dateOfBirth: "05/01/1996",
          proceduralist: "Mark",
          procedureDate: moment().format("MM/DD/YYYY"),
          procedureLocation: "Hospital",
          caseID: 2890,
          confirmationNumber: 123,
          attachments: [
            {
              name: "attach",
              id: "id",
            },
          ],
          caseProgress: {
            step1: false,
          },
          caseStatus: "complete",
        },
        {
          firstName: "Zoolander",
          lastName: "Vampire",
          dateOfBirth: "05/01/1996",
          proceduralist: "Cube",
          procedureDate: moment().format("MM/DD/YYYY"),
          procedureLocation: "Zoolander Hospital",
          caseID: 2890,
          confirmationNumber: 123,
          attachments: [
            {
              name: "attach",
              id: "id",
            },
          ],
          caseProgress: {
            step1: false,
          },
          caseStatus: "complete",
        },
      ]),
  })
);

const props = {
  setProcedureDate: jest.fn(),
};

beforeEach(() => {
  props.setProcedureDate.mockClear();
});

describe("StaticDatePicker", () => {
  test("renders the datepicker table", () => {
    const { getByText } = render(<StaticDatePicker />);

    expect(getByText(moment().month())).toBeInTheDocument();
    expect(getByText(moment().year())).toBeInTheDocument();
  });

  test("handles changing the date", async () => {
    const { queryByText } = render(<StaticDatePicker {...props} />);
    const yesterdayString = `${moment().subtract(1, "days").date()}`;

    expect(props.setProcedureDate).toHaveBeenCalledTimes(0);

    expect(queryByText(yesterdayString)).toBeInTheDocument();

    fireEvent.click(queryByText(yesterdayString));

    expect(props.setProcedureDate).toHaveBeenCalledTimes(1);
  });
});
