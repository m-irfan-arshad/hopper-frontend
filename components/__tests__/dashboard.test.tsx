import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import moment from "moment";
import Dashboard from "../dashboard";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData, mockCaseData } from "../../testReference";
import { CaseFilterContext } from "../../pages/_app.page";
import * as R from 'ramda';

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

const initialDashboardState = [{
    dashboard: {
        dateRangeStart:  moment().startOf('day'),
        dateRangeEnd:  moment().add(7, 'days').endOf('day'),
        dateSortValue: 'Newest - Oldest',
        searchBarValue: '',
        page: 1
      }
}, jest.fn()];

function renderDashboardWithContext(context: any) {
    return render(
        <CaseFilterContext.Provider value={context}>
            <Dashboard />
        </CaseFilterContext.Provider>
    )
}

describe("Dashboard", () => {  

    test("renders the dashboard", async () => {
        const { getByRole, getByText } = renderDashboardWithContext(initialDashboardState);

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
            expect(getByText("Show Completed Cases")).toBeInTheDocument();
        });
    });

    test("renders the date range picker", async () => { 
        const { getByRole, getByLabelText } = renderDashboardWithContext(initialDashboardState);

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
      });

      /*
      test("renders and interacts with search bar and pagination", async () => { 
        const { getByRole, getByPlaceholderText, rerender } = renderDashboardWithContext(initialDashboardState);

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Go to page 2"})).toBeInTheDocument();
        
        expect(getByPlaceholderText("Search Name or Case ID")).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "Go to page 2"}));
        
        const newDashboardState = R.clone(initialDashboardState);
        
        newDashboardState[0] = {
            dashboard: {
                dateRangeStart:  moment().startOf('day'),
                dateRangeEnd:  moment().add(7, 'days').endOf('day'),
                dateSortValue: 'Newest - Oldest',
                searchBarValue: '',
                page: 2
            }
        }
            
        rerender( 
            <CaseFilterContext.Provider value={newDashboardState}>
                <Dashboard />
            </CaseFilterContext.Provider>
        );

        //expect(getByRole("button", {name: "page 1"})).toBeInTheDocument();

        fireEvent.change(getByPlaceholderText("Search Name or Case ID"), {target: {value: 'searched'}});

        expect(getByPlaceholderText("Search Name or Case ID")).toHaveValue('searched');
      });
      */
     
    test("renders and interacts with regular dropdown and mobile dropdown on dashboard", async () => { 
        const { getByRole, queryByRole, rerender } = renderDashboardWithContext(initialDashboardState);

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Newest - Oldest"}));
        fireEvent.click(getByRole("option", {name: "Oldest - Newest"}));

        const newDashboardState = R.clone(initialDashboardState);

        newDashboardState[0] = {
            dashboard: {
                dateRangeStart:  moment().startOf('day'),
                dateRangeEnd:  moment().add(7, 'days').endOf('day'),
                dateSortValue: 'Oldest - Newest',
                searchBarValue: '',
                page: 2
            }
        }
        
        rerender( 
            <CaseFilterContext.Provider value={newDashboardState}>
                <Dashboard />
            </CaseFilterContext.Provider>
        );

        expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();

        //sets viewport to mobile version   
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
              matches: true,
              media: query,
              onchange: null,
              addListener: jest.fn(),
              removeListener: jest.fn(),
              addEventListener: jest.fn(),
              removeEventListener: jest.fn(),
              dispatchEvent: jest.fn(),
            })),
          });

        rerender(
            <CaseFilterContext.Provider value={newDashboardState}>
                <Dashboard  />
            </CaseFilterContext.Provider>
        );

        expect(queryByRole("button", {name: "Export"})).not.toBeInTheDocument();
        expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Oldest - Newest"}));
        fireEvent.click(getByRole("option", {name: "Newest - Oldest"}));

        rerender( 
            <CaseFilterContext.Provider value={initialDashboardState}>
                <Dashboard />
            </CaseFilterContext.Provider>
        );
       
        expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();
      });
});
