import { render, fireEvent, waitFor } from "@testing-library/react";
import DebouncedInput from "../debouncedInput";

describe("DebouncedInput", () => {
    const props = {
        onChange: jest.fn(),
        value: 'initialValue',
        debounce: 500,
        placeholder: 'Search'
    };

    test("renders the initial debounced input and calls on change", async() => {
        const { getByPlaceholderText } = render(
            <DebouncedInput {...props}  />
        );  

        await waitFor(() => {
            expect(getByPlaceholderText("Search")).toBeInTheDocument();
            expect(getByPlaceholderText("Search")).toHaveValue('initialValue');
        });

        fireEvent.change(getByPlaceholderText("Search") , {target: { value: 'google it'}});

        await waitFor(() => {
            expect(getByPlaceholderText("Search")).toHaveValue('google it');
        });

    });
});
