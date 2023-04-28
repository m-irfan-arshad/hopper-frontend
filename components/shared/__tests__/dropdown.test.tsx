import { render, fireEvent, within } from "@testing-library/react";
import Dropdown from "../dropdown";

describe("Dropdown", () => {

    const props = {
        menuItems:  [{value: "First Item", id: "1"}, {value: "Second Item", id: "2"}],
        selectId: "selectId",
        onChange: jest.fn(),
        value: "",
        placeholder: 'placeholder'
    }

    test("renders the dropdown and calls onChange", async() => {
        const { getByRole } = render(
            <Dropdown  {...props}/>
        ); 
       
        expect(getByRole("button", {name: "placeholder"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "placeholder"}));
        fireEvent.click(getByRole("option", {name: "Second Item"}));

        expect(props.onChange).toHaveBeenCalledTimes(1);
    });
});
