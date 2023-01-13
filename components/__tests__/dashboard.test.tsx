import { fireEvent, render, waitFor } from "@testing-library/react";
import moment from "moment";
import Dashboard from "../dashboard";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData, mockCaseData } from "../../testReference";

jest.mock("../../utils/hooks", () => ({
    useGetCasesHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: {cases: mockCaseData, count: 52} })),
    useUpdateCaseHook: jest.fn().mockImplementation(() =>  ({ mutate: jest.fn() })),
    useCreateCaseHook: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
    useGetLocationsHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockLocationData })),
    useGetProcedureUnitsHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockProcedureUnitData })),
    useGetServiceLinesHook: jest.fn().mockImplementation(() =>  ({ isLoading: false, data: mockServiceLineData })),
    useGetProvidersHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockProviderData }))
}));

describe("Dashboard", () => {  
    test("renders the dashboard", async () => {
        const { getByRole, getByText } = render(
                <Dashboard  />
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
            expect(getByText("Show Completed Cases")).toBeInTheDocument();
        });
    });

    test("renders the date range picker", async () => { 
        const { getByRole, getByLabelText } = render(
                <Dashboard  />
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
        expect(getByLabelText(`Choose date, selected date is ${moment().utc().format('MMM D, YYYY')}`)).toBeInTheDocument();
      });

      test("renders and interacts with search bar and pagination", async () => { 
        const { getByRole, getByPlaceholderText } = render(
                <Dashboard  />
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Go to page 2"})).toBeInTheDocument();

        expect(getByPlaceholderText("Search Name or Case ID")).toBeInTheDocument();

        fireEvent.click(getByRole("button", {name: "Go to page 2"}));

        expect(getByRole("button", {name: "page 2"})).toBeInTheDocument();

        fireEvent.change(getByPlaceholderText("Search Name or Case ID"), {target: {value: 'searched'}});

        await waitFor(() => {
            expect(getByRole("button", {name: "Go to page 2"})).toBeInTheDocument();
        });

        expect(getByRole("searchbox")).toHaveValue('searched');
      });

    test("renders and interacts with regular dropdown and mobile dropdown on dashboard", async () => { 
        const { getByRole, queryByRole, rerender } = render(
                <Dashboard  />
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Newest - Oldest"}));
        fireEvent.click(getByRole("option", {name: "Oldest - Newest"}));

        await waitFor(() => {
            expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();
        });

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
                <Dashboard  />
          );

        expect(queryByRole("button", {name: "Export"})).not.toBeInTheDocument();
        expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Oldest - Newest"}));
        fireEvent.click(getByRole("option", {name: "Newest - Oldest"}));

        await waitFor(() => {
            expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();
        });
      });
});
