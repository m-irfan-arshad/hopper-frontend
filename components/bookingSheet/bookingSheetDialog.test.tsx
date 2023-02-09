import { render, fireEvent } from "@testing-library/react";
import BookingSheetDialog from "./bookingSheetDialog";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe("BookingSheetDialog", () => {
    const queryClient = new QueryClient();

    const props = {
        closeDialog: jest.fn(),
        open: true,
        initiallySelectedTab: "Patient",
        data: {
            patients: {
                firstName: 'Bob',
                lastName: 'Marley'
            }
        }
    };

    test("renders and closes the bookingSheetDialog", () => {
        const { getByRole } = render(
            <QueryClientProvider client={queryClient}>
                <BookingSheetDialog {...props}  />
            </QueryClientProvider>
        );  
        expect(getByRole("tab", {name: "Patient"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Financial"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Procedure"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Scheduling"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Implants & Products"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Clinical"})).toBeInTheDocument();
        expect(getByRole("button", {name: ""})).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: ""}));
        expect(props.closeDialog).toHaveBeenCalledTimes(1);
    });

    test("changes tab of the bookingSheetDialog", () => {
        const { getByRole } = render(
            <QueryClientProvider client={queryClient}>
                <BookingSheetDialog {...props}  />
            </QueryClientProvider>

        );  
        expect(getByRole("tab", {name: "Patient"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Financial"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Procedure"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Scheduling"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Implants & Products"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Clinical"})).toBeInTheDocument();
        expect(getByRole("button", {name: ""})).toBeInTheDocument();
        
        fireEvent.click(getByRole("tab", {name: "Financial"}));
        expect(getByRole("tab", {name: "Financial"}).getAttribute("aria-selected")).toBeTruthy();
    });
});
