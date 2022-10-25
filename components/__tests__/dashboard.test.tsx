import { fireEvent, render, waitFor } from "@testing-library/react";
import moment from "moment";
import Dashboard from "../dashboard";
import { useGetCasesHook, useUpdateCaseHook } from '../../utils/hooks';

jest.mock("../../utils/hooks");
const mockData = [
    {
        caseId: 1,
        fhirResourceId: "testId",
        patientId: 1,
        procedureDate: "01/30/1990",
        providerName: "testProviderName",
        locationName: "testLocationName",
        createTime: new Date(),
        updateTime: new Date(),
        procedureLocation: "procedureLocation",
        patients: {
            patientId: 1,
            fhirResourceId: "aa22ss",
            firstName: "Captain",
            lastName: "Whitebeard",
            dateOfBirth: "02/01/1990",
            mobilePhone: "111-111-1111",
            homePhone: "555-555-5555",
            address: "330 Philly Lane",
            mrn: "5678567890",
        },
        steps: {
            priorAuthorization: "Incomplete",
            vendorConfirmation: "Incomplete",
        }
    },
    {
        caseId: 2,
        fhirResourceId: "testId2",
        patientId: 1,
        procedureDate: "01/30/1990",
        providerName: "testProviderName2",
        locationName: "testLocationName2",
        createTime: new Date(),
        updateTime: new Date(),
        procedureLocation: "procedureLocation2",
        patients: {
            patientId: 1,
            fhirResourceId: "aa22ss",
            firstName: "Captain",
            lastName: "Whitebeard",
            dateOfBirth: "02/01/1990",
            mobilePhone: "111-111-1111",
            homePhone: "555-555-5555",
            address: "330 Philly Lane",
            mrn: "5678567890",
        },
        steps: {
            priorAuthorization: "Incomplete",
            vendorConfirmation: "Incomplete",
        }
    }
]; 

describe("Dashboard", () => {  
    const mockedUseGetCasesHook = useGetCasesHook as jest.Mock<any>; 
    mockedUseGetCasesHook.mockImplementation(() => ({ isLoading: false, data: mockData }));

    const mockedUseUpdateCaseHook = useUpdateCaseHook as jest.Mock<any>; 
    mockedUseUpdateCaseHook.mockImplementation(() => ({ mutate: jest.fn() }));

    test("renders the dashboard", async () => {
        const { getByRole, } = render(
                <Dashboard  />
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });
    });

    test("renders and interacts with regular dropdown and mobile dropdown on dashboard", async () => { 
        const { getByRole, queryByRole, rerender } = render(
                <Dashboard  />
        );

        await waitFor(() => {
            expect(getByRole("button", {name: "Export"})).toBeInTheDocument();
        });

        expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Oldest - Newest"}));
        fireEvent.click(getByRole("option", {name: "Newest - Oldest"}));

        await waitFor(() => {
            expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();
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
        expect(getByRole("button", {name: "Sort: Newest - Oldest"})).toBeInTheDocument();

        fireEvent.mouseDown(getByRole("button", {name: "Sort: Newest - Oldest"}));
        fireEvent.click(getByRole("option", {name: "Oldest - Newest"}));

        await waitFor(() => {
            expect(getByRole("button", {name: "Sort: Oldest - Newest"})).toBeInTheDocument();
        });
      });
});
