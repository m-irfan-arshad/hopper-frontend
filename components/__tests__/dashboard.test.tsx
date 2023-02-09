import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import moment from "moment";
import Dashboard from "../dashboard";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData, mockCaseData } from "../../testReference";
import AppContext from "../../appContext";

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

describe("Dashboard", () => {  
    const appState = [{dashboard: {
        dateRangeStart:  moment().startOf('day'),
        dateRangeEnd:  moment().add(7, 'days').endOf('day'),
        dateSortValue: 'Newest - Oldest',
        caseFilterValue: [{id: "all", value: "All Steps"}],
        searchBarValue: '',
        page: 1
      }}, jest.fn()]

    test("renders the dashboard", async () => {
        const { getByRole, getByText } = render(
            <AppContext.Provider value={appState}>
                <Dashboard  />
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
            expect(getByText("Show Completed Cases")).toBeInTheDocument();
        });
    });

    test("renders the date range picker", async () => { 
        const { getByRole, getByLabelText } = render(
            <AppContext.Provider value={appState}>
                <Dashboard  />
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
        expect(getByLabelText(`Choose date, selected date is ${moment().utc().format('MMM D, YYYY')}`)).toBeInTheDocument();
      });

      test("renders and interacts with search bar and pagination", async () => { 
        const { getByRole, getByPlaceholderText } = render(
            <AppContext.Provider value={appState}>
                <Dashboard  />
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Go to page 2"})).toBeInTheDocument();

        expect(getByPlaceholderText("Search Name or Case ID")).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "Go to page 2"}));

        expect(getByRole("button", {name: "page 1"})).toBeInTheDocument();

        fireEvent.change(getByPlaceholderText("Search Name or Case ID"), {target: {value: 'searched'}});

        await waitFor(() => {
            expect(getByRole("button", {name: "Go to page 2"})).toBeInTheDocument();
        });

        expect(getByRole("searchbox")).toHaveValue('searched');
      });

    test("renders and interacts with regular dropdown and mobile dropdown on dashboard", async () => { 
        const { getByRole, queryByRole, rerender } = render(
            <AppContext.Provider value={appState}>
                <Dashboard  />
            </AppContext.Provider>
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();

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
            <AppContext.Provider value={appState}>
                <Dashboard  />
            </AppContext.Provider>
          );
      });
});
