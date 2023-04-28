import { render, fireEvent, waitFor } from "@testing-library/react";
import moment from "moment";
import CaseNavBar from "../caseNavBar";
import { FormWrapper, mockUseGetDropdownOptionsHook } from "../../testReference";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() })
    }));
    
jest.mock("../../utils/hooks", () => ({
    useCreateCaseHook: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
    useGetDropdownOptionsHook: jest.fn().mockImplementation((queryKey) => mockUseGetDropdownOptionsHook(queryKey))
}));

describe("CaseNavBar", () => {
    const props = {
        onDateFilterChange: jest.fn(),
        onWorkQueueChange:  jest.fn(),
        workQueue: 'workQueue',
        dateFilterValue: 'This month',
        search: jest.fn(),
        searchBarValue: "",
        dateRangePickerProps: {
            dateRangeStart: moment().utc().startOf('day'),
            dateRangeEnd:  moment().utc().add(7).endOf('day'),
            setDateRangeStart: jest.fn(),
            setDateRangeEnd: jest.fn()
        }
    }

    test("renders the caseNavBar and interacts with work queue dropdown", async() => {
        const { getByRole, getByTestId } = render(
            <CaseNavBar  {...props}/>
        ); 
       
        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
        expect(getByRole("textbox", {name: "Date Range End"})).toBeInTheDocument();
        expect(getByTestId('work-queue-select')).toBeInTheDocument();
    });

    test("open create case dialog and close it", async () => {
        const { getByRole, queryByRole } = render(
            <FormWrapper>
            <CaseNavBar  {...props}/>
            </FormWrapper>
        );

        expect(getByRole("button", {name: "Create Case"})).toBeInTheDocument();
        fireEvent.click(getByRole("button", {name: "Create Case"}));

        expect(getByRole("button", {name: "Cancel"})).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "Cancel"}));

        await waitFor(() => {
            expect(queryByRole("button", {name: "Cancel"})).not.toBeInTheDocument();
        });
    });
});
