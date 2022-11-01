import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseNavBar from "../caseNavBar";

describe("CaseNavBar", () => {

    const props = {
        onDateFilterChange: jest.fn(),
        onCaseFilterChange:  jest.fn(),
        caseFilterValue: [{"value": 'All Steps', "id": "all"}],
        dateFilterValue: 'This month',
        search: jest.fn(),
        searchBarValue: ""
    }

    test("renders the caseNavBar", async() => {
        const { getByRole, getByText } = render(
            <CaseNavBar  {...props}/>
        ); 
       
        expect(getByRole("button", {name: "Date Range: This month"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Step: All Steps"})).toBeInTheDocument();
        expect(getByText("Show Completed Cases")).toBeInTheDocument();
    });

    test("open create case dialog and close it", async () => {
        const { getByRole, queryByRole } = render(
            <CaseNavBar  {...props}/>
        );

        expect(getByRole("button", {name: "Create Case"})).toBeInTheDocument();
        fireEvent.click(getByRole("button", {name: "Create Case"}));

        expect(getByRole("button", {name: "Cancel"})).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "Cancel"}));

        await waitFor(() => {
            expect(queryByRole("button", {name: "Cancel"})).not.toBeInTheDocument();
        });
    });
});
