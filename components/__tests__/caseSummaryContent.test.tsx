import { render } from "@testing-library/react";
import CaseSummaryContent from "../caseSummaryContent";

describe("CaseSummaryContent", () => {
    const props = {
        row: {
            caseId: 1,
            fhirResourceId: "testId",
            patientId: 1,
            procedureDate: "2022-05-05T00:00:00Z",
            providerName: "testProviderName",
            locationName: "testLocationName",
            createTime: new Date(),
            updateTime: new Date(),
            providerId: 1,
            locationId: 2,
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
    };

    test("renders the CaseSummaryContent", () => {
        const { getByRole, getByText } = render(
            <CaseSummaryContent {...props}  />
        );  
        expect(getByRole("heading", {name: "Procedure Information"})).toBeInTheDocument();
        expect(getByRole("heading", {name: "Scheduling"})).toBeInTheDocument();
        expect(getByRole("heading", {name: "Procedure Details"})).toBeInTheDocument();

        expect(getByText('Site')).toBeInTheDocument();
        expect(getByText("testLocationName")).toBeInTheDocument();

    });
});
