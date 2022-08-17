import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseCard from "../caseCard";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../theme";
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
    const { getByText, queryByText, getByTestId } = render(
      <CaseCard row={row} />
    );

    expect(getByText("Captain Whitebeard")).toBeInTheDocument();
    expect(getByText("02/01/1990")).toBeInTheDocument();

    expect(queryByText("Whitebeard's ship")).not.toBeInTheDocument();
    expect(queryByText("Doctor Whitebeard")).not.toBeInTheDocument();
    expect(queryByText("Case Summary")).not.toBeInTheDocument();

    expect(getByTestId("ArrowDropDownOutlinedIcon")).toBeInTheDocument();
    fireEvent.click(getByTestId("ArrowDropDownOutlinedIcon"));

    expect(queryByText("Whitebeard's ship")).toBeInTheDocument();
    expect(queryByText("Doctor Whitebeard")).toBeInTheDocument();
    expect(queryByText("Case Summary")).toBeInTheDocument();
  });

  test("renders progress bar with varied lengths/colors", () => {
    const {container} = render(
      <ThemeProvider theme={defaultTheme}>
        <CaseCard row={row} />
      </ThemeProvider>
    );

   expect(container.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #FFA726');

    const rowClone = R.clone(row);
    rowClone.steps =  [
      { text: "Booking Sheet", status: false },
      { text: "Insurance Verification", status: false },
      { text: "PAT Chart", status: false },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: false }
    ];

    const {container: containerClone} = render(
      <ThemeProvider theme={defaultTheme}>
        <CaseCard row={rowClone} />
      </ThemeProvider>
    );

    expect(containerClone.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #EF5350');

    const rowClone2 = R.clone(row);
    rowClone2.steps =  [
      { text: "Booking Sheet", status: true },
      { text: "Insurance Verification", status: true },
      { text: "PAT Chart", status: true },
      { text: "Vendor Confirmation", status: true },
      { text: "Tray(s) Delivery", status: true }
    ];
       
    const {container: containerClone2} = render(
      <ThemeProvider theme={defaultTheme}>
        <CaseCard row={rowClone2} />
      </ThemeProvider>
    );

    expect(containerClone2.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #66BB6A');
  });
  
  test("opens the case summary modal and closes it", async() => {
    const { getByRole, getByTestId, queryByRole } = render(
      <CaseCard row={row} />
    );

    expect(getByTestId("ArrowDropDownOutlinedIcon")).toBeInTheDocument();
    fireEvent.click(getByTestId("ArrowDropDownOutlinedIcon"));

    expect(getByRole("button", {name: "Case Summary"})).toBeInTheDocument();
    
    fireEvent.click(getByRole("button", {name: "Case Summary"}));

    expect(getByRole("button", {name: "Cancel"})).toBeInTheDocument();
    expect(getByRole("button", {name: "View Full Case"})).toBeInTheDocument();

    fireEvent.click(getByRole("button", {name: "Cancel"}));

    await waitFor(() => {
      expect(queryByRole("button", {name: "Cancel"})).not.toBeInTheDocument();
      expect(queryByRole("button", {name: "View Full Case"})).not.toBeInTheDocument();
    });
  });

  test("renders and interacts with mobile view of caseCard", () => { 
    //sets viewport to mobile version   
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { getByRole, queryByRole, getByTestId } = render(
      <CaseCard row={row} />
    );

    expect(getByTestId("ArrowDropDownOutlinedIcon")).toBeInTheDocument();
    fireEvent.click(getByTestId("ArrowDropDownOutlinedIcon"));

    expect(queryByRole("heading", {name: "Booking Sheet"})).not.toBeInTheDocument();
    expect(queryByRole("button", {name: "View Full Case"})).not.toBeInTheDocument();
    expect(getByRole("button", {name: "Case Summary"})).toBeInTheDocument();

    fireEvent.click(getByRole("button", {name: "Case Summary"}));

    expect(getByRole("button", {name: "View Full Case"})).toBeInTheDocument();
  });
});
