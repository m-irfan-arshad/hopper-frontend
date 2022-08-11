import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseNavBar from "../caseNavBar";

describe("CaseNavBar", () => {

    test("renders the caseNavBar", async() => {
        const { getByRole, getByText } = render(
            <CaseNavBar  />
        );  
        expect(getByRole("button", {name: "Time: This month"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Step: All Steps"})).toBeInTheDocument();
        expect(getByText("Show Completed Cases")).toBeInTheDocument();
    });

    test("open create case dialog and close it", async () => {
        const { getByRole, queryByRole } = render(
            <CaseNavBar  />
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
