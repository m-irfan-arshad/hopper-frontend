import { fireEvent, render, waitFor, within, screen } from "@testing-library/react";
import moment from "moment";
import Dashboard from "../dashboard";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe("Dashboard", () => {   
    const mockData = [
        {
            caseId: 'caseId',
            procedureDate: moment('10/10/2022').utc().format(),
            patients: {
                firstName: 'firstName',
                lastName: 'lastName',
                dateOfBirth: 'DOB',
                mobilePhone: 'mobilePhone',
                mrn: 'mrn',
                address: 'address'
            }
        },
        {
                caseId: 'caseId2',
                procedureDate: moment('10/11/2022').utc().format(),
                patients: {
                    firstName: 'firstName2',
                    lastName: 'lastName2',
                    dateOfBirth: 'DOB2',
                    mobilePhone: 'mobilePhone2',
                    mrn: 'mrn2',
                    address: 'address2'
            }
        }
    ]; 

    global.fetch = jest.fn().mockImplementation(() =>  Promise.resolve({
        json: () => Promise.resolve( mockData ),
    }));

    test("renders the dashboard", async () => {
        const queryClient = new QueryClient();

        const { getByRole, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <Dashboard  />
            </QueryClientProvider>
        ); 

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });
    });

    test("calls onChange of dropdown", async () => {
        const queryClient = new QueryClient();

        const { getByRole, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <Dashboard  />
            </QueryClientProvider>
        ); 

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });
    });

    test("renders and interacts with mobile view of dashboard", async () => { 
        const queryClient = new QueryClient();

        const { getByRole, queryByRole, rerender } = render(
            <QueryClientProvider client={queryClient}>
                <Dashboard  />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
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
            <QueryClientProvider client={queryClient}>
                <Dashboard  />
            </QueryClientProvider>
          );

        expect(queryByRole("button", {name: "Export"})).not.toBeInTheDocument();
        expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Oldest - Newest"}));

        const listbox = getByRole("listbox");

        fireEvent.click(screen.getByText("Newest - Oldest"));

        await waitFor(() => {
            expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();
        });
      });
});
