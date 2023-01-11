import { render, fireEvent, waitFor } from "@testing-library/react";
import moment from "moment";
import CaseNavBar from "../caseNavBar";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData } from "../../testReference";
import { 
    useCreateCaseHook, 
    useGetLocationsHook, 
    useGetProcedureUnitsHook,
    useGetServiceLinesHook,
    useGetProvidersHook
} from '../../utils/hooks';
jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() })
    }));
    
jest.mock("../../utils/hooks");

describe("CaseNavBar", () => {
    const mockedUseGetLocationsHook = useGetLocationsHook as jest.Mock<any>; 
    mockedUseGetLocationsHook.mockImplementation(() => ({ isLoading: false, data: mockLocationData }));

    const mockedUseCreateCaseHook = useCreateCaseHook as jest.Mock<any>; 
    mockedUseCreateCaseHook.mockImplementation(() => ({ mutate: jest.fn() }));

    const mockedUseGetProcedureUnitsHook = useGetProcedureUnitsHook as jest.Mock<any>; 
    mockedUseGetProcedureUnitsHook.mockImplementation(() => ({ isLoading: false, data: mockProcedureUnitData }));

    const mockedUseGetServiceLinesHook = useGetServiceLinesHook as jest.Mock<any>; 
    mockedUseGetServiceLinesHook.mockImplementation(() => ({ isLoading: false, data: mockServiceLineData }));

    const mockedUseGetProvidersHook = useGetProvidersHook as jest.Mock<any>; 
    mockedUseGetProvidersHook.mockImplementation(() => ({ isLoading: false, data: mockProviderData }));

    const props = {
        onDateFilterChange: jest.fn(),
        onCaseFilterChange:  jest.fn(),
        caseFilterValue: [{"value": 'All Steps', "id": "all"}],
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

    test("renders the caseNavBar", async() => {
        const { getByRole } = render(
            <CaseNavBar  {...props}/>
        ); 
       
        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
        expect(getByRole("textbox", {name: "Date Range End"})).toBeInTheDocument();
        expect(getByRole("button", {name: "Step: All Steps"})).toBeInTheDocument();
    });

    test("open create case dialog and close it", async () => {
        const { getByRole, queryByRole } = render(
            <CaseNavBar  {...props}/>
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
