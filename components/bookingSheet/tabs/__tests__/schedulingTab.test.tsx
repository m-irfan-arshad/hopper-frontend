import { render, renderHook, fireEvent, waitFor } from '@testing-library/react'        
import moment from "moment";
import { useForm, FormProvider } from "react-hook-form";
import { mockLocationData, mockProcedureUnitData, mockProviderData, mockServiceLineData } from '../../../../testReference';
import SchedulingTab from '../schedulingTab';

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockReturnValue({ data: [] })
}));

jest.mock("../../../../utils/hooks", () => ({
    useGenericQueryHook: jest.fn().mockImplementation(({queryKey}) => {
        console.log("queryKey: ", queryKey)
        switch (queryKey) {
            case "getLocations": {
                console.log("got here")
                return {isLoading: false, data: mockLocationData}
            }
            case "getProcedureUnits": {
                return {isLoading: false, data: mockProcedureUnitData}
            }
            case "getServiceLines": {
                return {isLoading: false, data: mockServiceLineData}
            }
            case "getProviders": {
                return {isLoading: false, data: mockProviderData}
            }
            default: return { data: []}
        }
    })
}));

const FormWrapper = (props: any) => {
    const formMethods = useForm({
        defaultValues: {
            scheduling: {
                location: {
                    locationId: 1,
                    locationName: "Medtel Hospital"
                }
            }
        }
    });

    return (
      <FormProvider {...formMethods}>
        {props.children}
      </FormProvider>
    );
  };

describe("SchedulingTab", () => {
    const props = {
        config: {
            organization: "...",
            tabs: []
        }
    };

    test("renders the scheduling tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole } = render(
            <FormWrapper>
                <SchedulingTab {...props}  />
            </FormWrapper>
        );  
        expect(getByRole('combobox', {name: 'Surgical Location'})).toBeInTheDocument();
        expect(getByPlaceholderText("Surgical Location")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Procedure Unit'})).toBeInTheDocument();
        expect(getByPlaceholderText("Procedure Unit")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Service Line'})).toBeInTheDocument();
        expect(getByPlaceholderText("Service Line")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeInTheDocument();
        expect(getByPlaceholderText("Primary Surgeon")).toBeInTheDocument();

        expect(getByPlaceholderText("Procedure Date")).toBeInTheDocument()
        expect(getByPlaceholderText("Procedure Date")).toHaveValue('02/01/1990');

        expect(getByRole('combobox', {name: 'Admission Type'})).toBeInTheDocument();
        expect(getByPlaceholderText("Admission Type")).toBeInTheDocument();
    });

    test("can select location from dropdown", async () => {
        const { getByText, getByPlaceholderText, getByLabelText, getByRole } = render(
            <FormWrapper>
                <SchedulingTab {...props}  />
            </FormWrapper>
        );  

        await waitFor(() => {
            expect(getByText("Medtel Hospital")).toBeInTheDocument();
        })
        fireEvent.click(getByText(mockLocationData[0].locationName));
        expect(getByRole('combobox', {name: 'Procedure Unit'})).toBeDisabled();
        expect(getByRole('combobox', {name: 'Service Line'})).toBeDisabled();
    });
});

