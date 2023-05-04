import { render, fireEvent } from "@testing-library/react";
import BookingSheetDialog from "../bookingSheetDialog";
import { mockSingleCase } from "../../../testReference";
import { PagesTestWrapper } from "../../../testReference";


jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() })
}));

jest.mock("../../../utils/hooks", () => ({
    useGetCaseByIdHook: jest.fn().mockImplementation(() => ({ data: mockSingleCase })),
    useUpdateCaseHook: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
    useGetDropdownOptionsHook: jest.fn().mockImplementation(() => ({ data: [] })),
}));

describe("BookingSheetDialog", () => {
    const props = {
        closeDialog: jest.fn(),
        open: true,
        initiallySelectedTab: "Patient",
        data: mockSingleCase,
        bookingSheetConfig: {}
    };

    test("renders and closes the bookingSheetDialog", () => {
        const { getByRole } = render(
            <PagesTestWrapper>
                <BookingSheetDialog {...props}  />
            </PagesTestWrapper>
        );  
        expect(getByRole("tab", {name: "Patient"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Financial"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Procedure"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Scheduling"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Products"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Clinical"})).toBeInTheDocument();
        expect(getByRole("button", {name: ""})).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: ""}));
        expect(props.closeDialog).toHaveBeenCalledTimes(1);
    });

    test("changes tab of the bookingSheetDialog", () => {
        const { getByRole } = render(
            <PagesTestWrapper>
                <BookingSheetDialog {...props}  />
            </PagesTestWrapper>

        );  
        expect(getByRole("tab", {name: "Patient"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Financial"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Procedure"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Scheduling"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Products"})).toBeInTheDocument();
        expect(getByRole("tab", {name: "Clinical"})).toBeInTheDocument();
        expect(getByRole("button", {name: ""})).toBeInTheDocument();
        
        fireEvent.click(getByRole("tab", {name: "Financial"}));
        expect(getByRole("tab", {name: "Financial"}).getAttribute("aria-selected")).toBeTruthy();
    });
});
