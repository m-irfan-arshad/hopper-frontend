import { render, fireEvent, within, waitFor } from "@testing-library/react";
import DropDownSearchComponent from "../dropdownSearch";

describe("DropdownSearch", () => {
    const options = [
        { firstName: 'Shawshank', lastName: 'Julio', fhirResourceId: '1994' },
        { firstName: 'Godfather', lastName: 'John', fhirResourceId: '1972' },
    ];

    const props = {
        id: "patient.firstName",
        disabled: false,
        placeholder: 'placeholder',
        additionalStyles: {},
        onChange: jest.fn(),
        labelProperties: ['firstName'],
        options: options
    }

    test("renders the dropdownSearch component and calls onChange", async() => {
        const { getByRole, getByText, getByTestId } = render(
            <DropDownSearchComponent  {...props}/>
        ); 

        const input = within(getByTestId('autocomplete')).getByRole('combobox');
        fireEvent.change(input, { target: { value: 'Shaw' } })

        await waitFor(() => {
            expect(getByText('Shawshank')).toBeInTheDocument();
        })

        fireEvent.click(getByText("Shawshank"));

        expect(getByRole("combobox")).toHaveValue("Shawshank");
    });
});
