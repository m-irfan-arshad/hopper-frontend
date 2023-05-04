import { render, renderHook, fireEvent, waitFor, within } from '@testing-library/react'        
import ClinicalTab from "../clinicalTab";
import moment from "moment";
import { useForm, FormProvider } from "react-hook-form";
import { FormWrapper, mockBookingSheetConfig, mockSingleClinical } from "../../../../testReference";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockImplementation((queryKeyList) =>{
        const queryKey = queryKeyList[0]
        if (queryKey === 'getDiagnosticTests') {
            return {data: [{testName: "Other"}]}
        } else if (queryKey === 'getClearances') {
            return {data: [{clearanceName: "Other"}]}
        }
        return []
    })
}));  


const ClinicalFormWrapper = (props: any) => {
    const formMethods = useForm({
        defaultValues: {
            clinical: mockSingleClinical
        }
    });

    return (
      <FormProvider {...formMethods}>
        {props.children}
      </FormProvider>
    );
  };


describe("ClinicalTab", () => {
    const { result } = renderHook(() => useForm())
    
    const props = {
        control: result.current.control,
        config: mockBookingSheetConfig,
        getValues: jest.fn()
    };


    test("renders the clinical tab", () => {
        const { getByPlaceholderText, getByText, getByLabelText, getByRole } = render(
            <ClinicalFormWrapper>
                <ClinicalTab {...props}  />
            </ClinicalFormWrapper>
        );  
        expect(getByLabelText("Primary Care First Name")).toBeInTheDocument();
        expect(getByPlaceholderText("Primary Care First Name")).toBeInTheDocument();

        expect(getByLabelText("Primary Care Last Name")).toBeInTheDocument();
        expect(getByPlaceholderText("Primary Care Last Name")).toBeInTheDocument();

        expect(getByLabelText("Primary Care Phone Number")).toBeInTheDocument();
        expect(getByPlaceholderText("Primary Care Phone Number")).toBeInTheDocument();

        expect(getByText("Primary Care Physician")).toBeInTheDocument();
        expect(getByText("Pre-Admission Assessment")).toBeInTheDocument();
        expect(getByText("Pre-Admission Testing")).toBeInTheDocument();
        expect(getByText("Clearances")).toBeInTheDocument();
        expect(getByText("Post-Operative Care")).toBeInTheDocument();
        expect(getByText("Is pre-admission assessment required for this patient?")).toBeInTheDocument();
        expect(getByText("Is pre-admission testing required for this patient?")).toBeInTheDocument();
        expect(getByText("Are clearances required for this patient?")).toBeInTheDocument();

        expect(getByLabelText("Post-Op Date")).toBeInTheDocument();
        expect(getByPlaceholderText("Post-Op Date")).toBeInTheDocument();
    });

    test("renders the form options when required", () => {
        const { getByPlaceholderText, getByRole, getByLabelText } = render(
            <ClinicalFormWrapper>
                <ClinicalTab {...props} />
            </ClinicalFormWrapper>
        ); 

        expect(getByLabelText("Pre-Op Date")).toBeInTheDocument();
        expect(getByPlaceholderText("Pre-Op Date")).toBeInTheDocument();

        expect(getByLabelText("Diagnostic Test")).toBeInTheDocument();
        fireEvent.change(getByRole('combobox', {name: 'Diagnostic Test'}), {target: {value: 'Other'}});
        expect(getByLabelText("Pre-Op Testing Date")).toBeInTheDocument();
        expect(getByLabelText("Clearance")).toBeInTheDocument();
        expect(getByLabelText("Clearance Date")).toBeInTheDocument();
        expect(getByLabelText("Provider First Name")).toBeInTheDocument();
        
    });

    test("If user selects `Other` from diagnostic test dropdown, user can manually select test", async () => {
        const { getByPlaceholderText, getByText, getByRole, getByLabelText, queryByText, findByRole } = render(
            <ClinicalFormWrapper>
                <ClinicalTab {...props} />
            </ClinicalFormWrapper>
        );

        expect(getByLabelText("Diagnostic Test")).toBeInTheDocument();
        expect(queryByText("Other")).toBeNull();
        expect(queryByText("Test Name")).toBeNull();
        fireEvent.change(getByRole('combobox', {name: 'Diagnostic Test'}), {target: {value: 'Other'}});
        expect(getByText("Other")).toBeInTheDocument();
        fireEvent.click(getByText("Other"));
        expect(getByPlaceholderText("Test Name")).toBeInTheDocument();
    });

    test("If user selects `Other` from clearance dropdown, user can manually select clearance", async () => {
        const { getByPlaceholderText, getByText, getByRole, getByLabelText, queryByText, findByRole } = render(
            <ClinicalFormWrapper>
                <ClinicalTab {...props} />
            </ClinicalFormWrapper>
        );

        expect(getByLabelText("Clearance")).toBeInTheDocument();
        expect(queryByText("Other")).toBeNull();
        expect(queryByText("Clearance Name")).toBeNull();
        fireEvent.change(getByRole('combobox', {name: 'Clearance'}), {target: {value: 'Other'}});
        expect(getByText("Other")).toBeInTheDocument();
        fireEvent.click(getByText("Other"));
        expect(getByPlaceholderText("Clearance Name")).toBeInTheDocument();
    });
});

