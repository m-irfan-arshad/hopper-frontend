import { render, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PatientTable from "../patientTable";
import moment from "moment";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          firstName: "Adam",
          lastName: "Vampire",
          dateOfBirth: "02/01/1990",
          proceduralist: "Whitebeard",
          procedureDate: moment().format("MM-DD-YYYY"),
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
          procedureDate: moment().format("MM-DD-YYYY"),
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
          procedureDate: moment().format("MM-DD-YYYY"),
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
          firstName: "Zoolander",
          lastName: "Vampire",
          dateOfBirth: "05/01/1996",
          proceduralist: "Beerus",
          procedureDate: moment().format("MM-DD-YYYY"),
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
          lastName: "Fiddlesticks",
          dateOfBirth: "05/01/1996",
          proceduralist: "Mark",
          procedureDate: moment().format("MM-DD-YYYY"),
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
          firstName: "Zeus",
          lastName: "Vampire",
          dateOfBirth: "05/01/1996",
          proceduralist: "Cube",
          procedureDate: moment().format("MM-DD-YYYY"),
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
  procedureDate: moment().utc().format("MM-DD-YYYY"),
  proceduralist: "",
  procedureLocation: "",
};

describe("PatientTable", () => {
  test("renders the patient table", async () => {
    const { getByText } = render(<PatientTable {...props} />);

    expect(getByText("Patient Name")).toBeInTheDocument();
    expect(getByText("DOB")).toBeInTheDocument();
    expect(getByText("Proceduralist")).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText("Adam Vampire")).toBeInTheDocument();
      expect(getByText("Whitebeard")).toBeInTheDocument();
      expect(getByText("Bob Builder")).toBeInTheDocument();
      expect(getByText("Beerus")).toBeInTheDocument();
    });
  });

  test("handles the page sort for time and alphabetically", async () => {
    const { queryByText, queryAllByText } = render(<PatientTable {...props} />);

    expect(queryByText("Proceduralist")).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText("Adam Vampire")).toBeInTheDocument();
      expect(queryByText("Whitebeard")).toBeInTheDocument();
      expect(queryByText("Bob Builder")).toBeInTheDocument();
      expect(queryByText("Beerus")).toBeInTheDocument();
    });

    fireEvent.click(queryByText("Proceduralist"));

    expect(queryByText("Whitebeard")).not.toBeInTheDocument();
    expect(queryAllByText("Beerus")[1]).toBeInTheDocument();

    fireEvent.click(queryByText("Proceduralist"));

    expect(queryByText("Beerus")).toBeInTheDocument();
    expect(queryByText("Whitebeard")).toBeInTheDocument();

    fireEvent.click(queryByText("DOB"));

    expect(queryByText("Cat Dog")).not.toBeInTheDocument();
    expect(queryByText("Adam Vampire")).toBeInTheDocument();
    expect(queryByText("Zoolander Vampire")).toBeInTheDocument();

    fireEvent.click(queryByText("Patient Name"));

    expect(queryByText("Zoolander Vampire")).not.toBeInTheDocument();
    expect(queryByText("Adam Vampire")).toBeInTheDocument();
  });

  test("handles which page u are on", async () => {
    const { queryByText, getByLabelText, container } = render(
      <PatientTable {...props} />
    );

    expect(getByLabelText("Go to next page")).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByText("Adam Vampire")).toBeInTheDocument();
    });

    expect(queryByText("Zoolander Vampire")).not.toBeInTheDocument();

    fireEvent.click(getByLabelText("Go to next page"));

    expect(queryByText("Zoolander Vampire")).toBeInTheDocument();
    expect(
      container.querySelector(".MuiSelect-nativeInput")
    ).toBeInTheDocument();
  });
});
