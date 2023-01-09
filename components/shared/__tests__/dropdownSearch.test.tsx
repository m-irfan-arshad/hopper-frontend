import { render, fireEvent, within, waitFor } from "@testing-library/react";
import DropDownSearchComponent from "../dropdownSearch";

describe("DropdownSearch", () => {

   
  const options = [
    { label: 'Shawshank Redemption', id: 1994 },
    { label: 'Godfather', id: 1972 },
    { label: 'Godfather: Part II',  id: 1974 },
    { label: 'The Dark Knight', id: 2008 },
    { label: '12 Angry Men',  id: 1957 }
];

    const props = {
        id: "patient.firstName",
        disabled: false,
        placeholder: 'placeholder',
        additionalStyles: {},
        onChange: jest.fn(),
        options: options
    }

    test("renders the dropdownSearch component and calls onChange", async() => {
        const { getByRole, getByText, getByTestId } = render(
            <DropDownSearchComponent  {...props}/>
        ); 

        const input = within(getByTestId('autocomplete')).getByRole('combobox');
        fireEvent.change(input, { target: { value: 'Redemption' } })

        await waitFor(() => {
            expect(getByText('Shawshank Redemption')).toBeInTheDocument();
        })

        fireEvent.click(getByText("Shawshank Redemption"));

        expect(getByRole("combobox")).toHaveValue("Shawshank Redemption");
    });
});
