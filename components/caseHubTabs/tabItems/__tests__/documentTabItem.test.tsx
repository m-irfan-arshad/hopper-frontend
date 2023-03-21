import { render, fireEvent, within } from "@testing-library/react";
import DocumentTabItem from "../documentTabItem";
import moment from "moment";

describe("DocumentTabItem", () => {

    const props = {
        data: {
            createTime: moment().subtract(1, 'days'),
            updateTime: moment(),
            description: 'Lorem ipsum sdgsdgdasgasg',
            firstName: 'Daphney',
            lastName: 'Johnson',
            fileTypes: ['Other']
        }
    }

    test("renders the document tab item and opens the three dot menu", async() => {
        const { getByRole, queryByRole, getByText } = render(
            <DocumentTabItem  {...props}/>
        ); 
       
        expect(getByText("Lorem ipsum sdgsdgdasgasg")).toBeInTheDocument();
        expect(getByText("Other")).toBeInTheDocument();
        expect(queryByRole("option", {name: "Download"})).not.toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button"));

        expect(getByRole("option", {name: "Download"})).toBeInTheDocument();
        expect(getByRole("option", {name: "View"})).toBeInTheDocument();
        expect(getByRole("option", {name: "Delete"})).toBeInTheDocument();

    });
});
