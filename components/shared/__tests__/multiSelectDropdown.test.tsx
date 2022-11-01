import { render, fireEvent, within } from "@testing-library/react";
import MultiSelectDropdown from "../multiSelectDropdown";

describe("MultiSelectDropdown", () => {

    const props = {
        menuItems:  [{value: "First Item", id: "1"}, {value: "Second Item", id: "2"}],
        title: "Title:",
        selectId: "selectId",
        onChange: jest.fn(),
        value: [{value: "First Item", id: "1"}]
    }

    test("renders the dropdown and calls onChange", async() => {
        const { getByRole } = render(
            <MultiSelectDropdown  {...props}/>
        ); 
       
        expect(getByRole("button", {name: "Title: First Item"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Title: First Item"}));
        fireEvent.click(getByRole("option", {name: "Second Item"}));

        expect(props.onChange).toHaveBeenCalledTimes(1);
        expect(props.onChange).toHaveBeenCalledWith([{value: "First Item", id: "1"}, {value: "Second Item", id: "2"}]);
    });
});
