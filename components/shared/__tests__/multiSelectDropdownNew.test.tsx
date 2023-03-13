import { render, fireEvent } from "@testing-library/react";
import MultiSelectDropdownNew from "../multiSelectDropdownNew";
import * as R from 'ramda';

describe("MultiSelectDropdownNew", () => {

    const props = {
        menuItems:  [{value: "First Item", id: "1"}, {value: "Second Item", id: "2"}],
        selectId: "selectId",
        onChange: jest.fn(),
        onDelete: jest.fn(),
        selectedOptions: [{value: "First Item", id: "1"}],
        placeholder: 'Document Type(s)',
        label: 'Document Type(s)',
    }

    beforeEach(() => {
        props.onChange.mockReset();
        props.onDelete.mockReset();
    });

    test("renders the dropdown with chips calls onDelete", async() => {
        const { getByTestId, getByRole } = render(
            <MultiSelectDropdownNew  {...props}/>
        ); 
       
        expect(getByTestId("selectId")).toBeInTheDocument();
        expect(getByTestId("CancelIcon")).toBeInTheDocument();
        
        fireEvent.click(getByTestId('CancelIcon'));
        
        expect(props.onDelete).toHaveBeenCalledTimes(1);

    });
    
    test("renders the dropdown and calls onChange", async() => {
        const newProps = R.clone(props);

        newProps.selectedOptions = [];

        const { getByTestId, getByLabelText, getByRole } = render(
            <MultiSelectDropdownNew  {...newProps}/>
        ); 
       
        expect(getByTestId("selectId")).toBeInTheDocument();
        const dropdown = getByLabelText('Document Type(s)');

        fireEvent.mouseDown(dropdown);
        fireEvent.click(getByRole("option", {name: "Second Item"}));

        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith([{value: "Second Item", id: "2"}]);

    });
});
