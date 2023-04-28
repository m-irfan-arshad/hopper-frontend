import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import moment from "moment";
import Dashboard from "../dashboard";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData, mockCaseData } from "../../testReference";
import { CaseFilterContext } from "../../pages/_app.page";

jest.mock("../../utils/hooks", () => ({
    useGetCasesHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: {cases: mockCaseData, count: 52} })),
    useUpdateCaseHook: jest.fn().mockImplementation(() =>  ({ mutate: jest.fn() })),
    useCreateCaseHook: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
    useGetLocationsHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockLocationData })),
    useGetProcedureUnitsHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockProcedureUnitData })),
    useGetServiceLinesHook: jest.fn().mockImplementation(() =>  ({ isLoading: false, data: mockServiceLineData })),
    useGetProvidersHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockProviderData }))
}));

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({getQueryCache: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn()
}));

const updateDashboardFunction = jest.fn();

const initialDashboardState = [{
    dashboard: {
        dateRangeStart:  moment().startOf('day'),
        dateRangeEnd:  moment().add(7, 'days').endOf('day'),
        searchBarValue: '',
        page: 1
      }
}, updateDashboardFunction];

function renderDashboardWithContext(context: any) {
    return render(
        <CaseFilterContext.Provider value={context}>
            <Dashboard />
        </CaseFilterContext.Provider>
    )
}

describe("Dashboard", () => {  
    test("renders the dashboard and the date range picker", async () => { 
        const { getByRole, getByText } = renderDashboardWithContext(initialDashboardState);

        await waitFor(() => {
            expect(getByRole("heading", {name: "Cases"})).toBeInTheDocument();
        });

        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
      });

      test("renders and interacts with search bar and pagination", async () => { 
        const { getByRole, getByPlaceholderText, rerender } = renderDashboardWithContext(initialDashboardState);

        await waitFor(() => {
            expect(getByRole("heading", {name: "Cases"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Go to page 2"})).toBeInTheDocument();
        
        expect(getByPlaceholderText("Search Patient Name")).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "Go to page 2"}));

        fireEvent.change(getByPlaceholderText("Search Patient Name"), {target: {value: 'searched'}});

        await waitFor(() => {
            expect(updateDashboardFunction).toHaveBeenCalledTimes(3);
            expect(getByPlaceholderText("Search Patient Name")).toHaveValue('searched');
        });    
      });
});
