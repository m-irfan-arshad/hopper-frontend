import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseCard from "../caseCard";
import * as R from 'ramda';

describe("CaseCard", () => {
  const row = {
    caseID: "12345",
    firstName: "Captain",
    lastName: "Whitebeard",
    dateOfBirth: "02/01/1990",
    procedureDate: "2022-05-05T00:00:00Z",
    procedureLocation: "Whitebeard's ship",
    proceduralist: "Doctor Whitebeard",
    mrn: "5678567890",
    steps: [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ]
  };
  test("renders the caseCard and can expand it", async () => {
    const { getByText, queryByText, getByLabelText } = render(
      <CaseCard row={row} />
    );

    expect(getByText("Captain Whitebeard")).toBeInTheDocument();
    expect(getByText("02/01/1990")).toBeInTheDocument();

    expect(queryByText("Whitebeard's ship")).not.toBeInTheDocument();
    expect(queryByText("Doctor Whitebeard")).not.toBeInTheDocument();
    expect(queryByText("View Case Summary")).not.toBeInTheDocument();

    expect(getByLabelText("show more")).toBeInTheDocument();
    fireEvent.click(getByLabelText("show more"));

    expect(queryByText("Whitebeard's ship")).toBeInTheDocument();
    expect(queryByText("Doctor Whitebeard")).toBeInTheDocument();
    expect(queryByText("View Case Summary")).toBeInTheDocument();
  });

  test("renders progress bar with varied lengths/colors", () => {
    const rowClone = R.clone(row);
    rowClone.steps =  [
      { text: "Booking Sheet", status: false },
      { text: "Insurance Verification", status: false },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: false }
    ];

    const {container, rerender} = render(
      <CaseCard row={rowClone} />
    );

    expect(container.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #EF5350');

    const rowClone2 = R.clone(row);
    rowClone2.steps =  [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: true },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ];
       
    rerender(
      <CaseCard row={rowClone2} />
    ); 

    expect(container.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #66BB6A');
  });
});
