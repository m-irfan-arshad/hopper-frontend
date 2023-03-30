import { render, fireEvent, within } from "@testing-library/react";
import DocumentTabItem from "../documentTabItem";
import moment from "moment";
import { mockSingleDocument } from "../../../../testReference";

describe("DocumentTabItem", () => {

    const props = {
        data: mockSingleDocument
    }

    test("renders the document tab item and opens the three dot menu", async() => {
        const { getByRole, queryByRole, getByText } = render(
            <DocumentTabItem  {...props}/>
        ); 
       
        expect(getByText("Test Note")).toBeInTheDocument();
        expect(getByText("H & P")).toBeInTheDocument();
        expect(queryByRole("option", {name: "Download"})).not.toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button"));

        expect(getByRole("option", {name: "Download"})).toBeInTheDocument();
        expect(getByRole("option", {name: "View"})).toBeInTheDocument();
        expect(getByRole("option", {name: "Delete"})).toBeInTheDocument();

    });
});
