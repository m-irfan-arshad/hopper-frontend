import { render, renderHook, fireEvent, waitFor } from '@testing-library/react'        
import moment from "moment";
import { useForm, FormProvider } from "react-hook-form";
import { FormWrapper, mockLocationData, mockProcedureUnitData, mockProviderData, mockServiceLineData, mockSingleCase, mockSingleLocation, mockSingleProcedureUnit, mockSingleProvider, mockSingleServiceLine, mockuseGetDropdownOptionsHook } from '../../../../testReference';
import SchedulingTab from '../schedulingTab';

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockReturnValue({ data: [] })
}));

jest.mock("../../../../utils/hooks", () => ({
    useGetDropdownOptionsHook: jest.fn().mockImplementation((queryKey) => mockuseGetDropdownOptionsHook(queryKey))
}));

  const PrepopulatedFormWrapper = (props: any) => {
    const formMethods = useForm({
        defaultValues: {
            scheduling: {
                location: mockSingleLocation,
                procedureUnit: mockSingleProcedureUnit,
                serviceLine: mockSingleServiceLine,
                provider: mockSingleProvider
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
        const { getByPlaceholderText, getByRole } = render(
            <FormWrapper>
                <SchedulingTab {...props} />
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
        expect(getByPlaceholderText("Procedure Date")).toHaveValue('02/01/1990 12:00 AM');

        expect(getByRole('combobox', {name: 'Admission Type'})).toBeInTheDocument();
        expect(getByPlaceholderText("Admission Type")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Surgical Location'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Procedure Unit'})).toBeDisabled();
        expect(getByRole('combobox', {name: 'Service Line'})).toBeDisabled();
        expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeDisabled();
        
    });

    test("Selecting filter from dropdown enables it's dependency", async () => {
        const { getByText, getByRole } = render(
            <FormWrapper>
                <SchedulingTab {...props} />
            </FormWrapper>
        );  

        expect(getByRole('combobox', {name: 'Surgical Location'})).toBeInTheDocument();
        fireEvent.change(getByRole("combobox", {name: 'Surgical Location'}), {target: {value: "M"}})
        await waitFor(() => {
            expect(getByText(mockLocationData[0].locationName)).toBeInTheDocument();
        })

        fireEvent.click(getByText(mockLocationData[0].locationName));
        expect(getByRole('combobox', {name: 'Procedure Unit'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Service Line'})).toBeDisabled();
        expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeDisabled();

        fireEvent.change(getByRole("combobox", {name: 'Procedure Unit'}), {target: {value: "p"}})
        await waitFor(() => {
            expect(getByText(mockProcedureUnitData[0].procedureUnitName)).toBeInTheDocument();
        })

        fireEvent.click(getByText(mockProcedureUnitData[0].procedureUnitName));
        expect(getByRole('combobox', {name: 'Surgical Location'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Service Line'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeDisabled();

        fireEvent.change(getByRole("combobox", {name: 'Service Line'}), {target: {value: "s"}})
        await waitFor(() => {
            expect(getByText(mockServiceLineData[0].serviceLineName)).toBeInTheDocument();
        })

        fireEvent.click(getByText(mockServiceLineData[0].serviceLineName));
        expect(getByRole('combobox', {name: 'Surgical Location'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Service Line'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeEnabled();
    });

    test("Enables all filters if prepopulated", async () => {
        const { getByRole } = render(
            <PrepopulatedFormWrapper>
                <SchedulingTab {...props} />
            </PrepopulatedFormWrapper>
        );  

        expect(getByRole('combobox', {name: 'Surgical Location'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Procedure Unit'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Service Line'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeEnabled();
    });
});

