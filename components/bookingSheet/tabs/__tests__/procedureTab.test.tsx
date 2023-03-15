import { render, renderHook, fireEvent, waitFor } from '@testing-library/react'        
import moment from "moment";
import { useForm, FormProvider } from "react-hook-form";
import { FormWrapper, mockLocationData, mockSingleLocation, mockSingleProcedure, mockSingleProcedureUnit, mockSingleProvider, mockSingleServiceLine, mockUseGenericQueryHook } from '../../../../testReference';
import ProcedureTab from '../procedureTab';

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockReturnValue({ data: [] })
}));

jest.mock("../../../../utils/hooks", () => ({
    useGenericQueryHook: jest.fn().mockImplementation((queryKey) => mockUseGenericQueryHook(queryKey))
}));

describe.only("SchedulingTab", () => {
    const props = {
        config: {
            organization: "...",
            tabs: []
        }
    };

    test("renders the procedure tab", () => {
        const { getByPlaceholderText, getByRole } = render(
            <FormWrapper>
                <ProcedureTab {...props} />
            </FormWrapper>
        );
        expect(getByRole('combobox', {name: 'Procedure'})).toBeInTheDocument();
        expect(getByPlaceholderText("Procedure")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Approach'})).toBeInTheDocument();
        expect(getByPlaceholderText("Approach")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Laterality'})).toBeInTheDocument();
        expect(getByPlaceholderText("Laterality")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Anesthesia'})).toBeInTheDocument();
        expect(getByPlaceholderText("Anesthesia")).toBeInTheDocument();

        expect(getByPlaceholderText("CPT")).toBeInTheDocument()

        expect(getByRole('combobox', {name: 'ICD'})).toBeInTheDocument();
        expect(getByPlaceholderText("ICD")).toBeInTheDocument();

        expect(getByRole('combobox', {name: 'Procedure'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Approach'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Laterality'})).toBeEnabled();
        expect(getByRole('combobox', {name: 'Anesthesia'})).toBeEnabled();
        
    });

    test("Can select option from dropdown", async () => {
        const { getByText, getByRole } = render(
            <FormWrapper>
                <ProcedureTab {...props} />
            </FormWrapper>
        );  

        expect(getByRole('combobox', {name: 'Procedure'})).toBeInTheDocument();
        fireEvent.change(getByRole("combobox", {name: 'Procedure'}), {target: {value: "Brain"}})
        await waitFor(() => {
            expect(getByText(mockSingleProcedure.procedureName)).toBeInTheDocument();
        }) 
    });
});

