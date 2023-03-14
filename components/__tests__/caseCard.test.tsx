import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseCard from "../caseCard";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../theme";
import * as R from 'ramda';
import { mockSingleCase } from "../../testReference";
import moment from 'moment'


jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
  QueryClient: jest.fn()
  }));
  
describe("CaseCard", () => {
  test("renders the caseCard and can expand it", async () => {
    const { getByText, queryByText, getByTestId } = render(
        <CaseCard row={mockSingleCase} />
    );

    expect(getByText("Whitebeard, Captain")).toBeInTheDocument();
    expect(getByText("02/01/1990")).toBeInTheDocument();

    // expect(queryByText("Whitebeard's ship")).not.toBeInTheDocument();
    // expect(queryByText("Doctor Whitebeard")).not.toBeInTheDocument();
    expect(queryByText("Case Summary")).not.toBeInTheDocument();

    expect(getByTestId("ArrowDropDownOutlinedIcon")).toBeInTheDocument();
    fireEvent.click(getByTestId("ArrowDropDownOutlinedIcon"));

    // expect(queryByText("Whitebeard's ship")).toBeInTheDocument();
    // expect(queryByText("Doctor Whitebeard")).toBeInTheDocument();
    expect(queryByText("Case Summary")).toBeInTheDocument();
  });

  test("renders progress bar with varied lengths/colors", () => {
    const {container} = render(
      <ThemeProvider theme={defaultTheme}>
        <CaseCard row={mockSingleCase} />
      </ThemeProvider>
    );

    // expect(container.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #EF5350');

    const rowClone = R.clone(mockSingleCase);
    rowClone.financial[0].priorAuthorization = "Incomplete"
    rowClone.vendorConfirmation = "Complete"

    const {container: containerClone} = render(
      <ThemeProvider theme={defaultTheme}>
        <CaseCard row={rowClone} />
      </ThemeProvider>
    );

   expect(containerClone.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #FFA726');

    const rowClone2 = R.clone(mockSingleCase);
    rowClone2.financial[0].priorAuthorization = "Complete"
    rowClone2.vendorConfirmation = "Complete"

    const {container: containerClone2} = render(
      <ThemeProvider theme={defaultTheme}>
        <CaseCard row={rowClone2} />
      </ThemeProvider>
    );

    expect(containerClone2.querySelector(".MuiLinearProgress-bar")).toHaveStyle('background-color: #66BB6A');
  });
  
  test("opens the case summary modal and closes it", async() => {
    Date.now = jest.fn().mockReturnValue(new Date('2022-10-20'));

    const { getByRole, getByTestId, queryByRole } = render(
      <CaseCard row={mockSingleCase} />
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
      <CaseCard row={mockSingleCase} />
    );

    expect(getByTestId("ArrowDropDownOutlinedIcon")).toBeInTheDocument();
    fireEvent.click(getByTestId("ArrowDropDownOutlinedIcon"));

    expect(queryByRole("heading", {name: "Booking Sheet"})).not.toBeInTheDocument();
    expect(queryByRole("button", {name: "View Full Case"})).not.toBeInTheDocument();
    expect(getByRole("button", {name: "Case Summary"})).toBeInTheDocument();

    fireEvent.click(getByRole("button", {name: "Case Summary"}));

    expect(getByRole("button", {name: "View Full Case"})).toBeInTheDocument();
  });

  test("renders threat of cancellation when appointment is 24 hours away or less and not all steps completed", async () => {
    const rowClone3 = {...mockSingleCase, vendorConfirmation: "Incomplete"}
    rowClone3.scheduling.procedureDate = moment('2022-10-20').toDate() 
    rowClone3.financial[0].priorAuthorization = "Complete"
    const { getByTestId } = render(
      <CaseCard row={rowClone3} />
    );

    expect(getByTestId("NotificationImportantIcon")).toBeInTheDocument();
  });

  test("does not render threat of cancellation when appointment is more than 24 hours away", async () => {
    const rowClone = {...mockSingleCase}
    rowClone.scheduling.procedureDate = moment('2022-10-22').toDate() 
    const { queryByTestId } = render(
      <CaseCard row={rowClone} />
    );

    expect(queryByTestId("NotificationImportantIcon")).toBeNull();
  });

  test("does not render threat of cancellation when all steps completed", async () => {
    const rowClone4 = {...mockSingleCase, vendorConfirmation: "Complete"}
    rowClone4.financial[0].priorAuthorization = "Complete"
    rowClone4.scheduling.procedureDate = moment().toDate() 
    const { queryByTestId } = render(
      <CaseCard row={rowClone4} />
    );

    expect(queryByTestId("NotificationImportantIcon")).toBeNull();
  });
});
