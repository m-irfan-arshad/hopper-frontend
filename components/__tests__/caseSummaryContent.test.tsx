import { render } from "@testing-library/react";
import CaseSummaryContent from "../caseSummaryContent";
import {mockSingleCase} from "../../testReference";

describe("CaseSummaryContent", () => {
    const props = {
        row: mockSingleCase
    }

    test("renders the CaseSummaryContent", () => {
        const { getByRole, getByText } = render(
            <CaseSummaryContent {...props}  />
        );  
        expect(getByRole("heading", {name: "Procedure Information"})).toBeInTheDocument();
        expect(getByRole("heading", {name: "Scheduling"})).toBeInTheDocument();
        expect(getByRole("heading", {name: "Procedure Details"})).toBeInTheDocument();

        expect(getByText('Site')).toBeInTheDocument();
        expect(getByText("Medtel Hospital")).toBeInTheDocument();

    });
});
