import { render, renderHook, fireEvent } from '@testing-library/react'        
import PatientTab from "../patientTab";
import moment from "moment";
import { useFieldArray, useForm } from "react-hook-form";
import { mockSingleCase } from "../../../../testReference";
import FinancialTab from '../financialTab';

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockReturnValue({ data: [] })
}));   

describe("FinancialTab", () => {
    const defaultInsuranceValue = {
        insurance: null,
        insuranceGroupName: '',
        insuranceGroupNumber: '',
        priorAuthApproved: '',
        priorAuthId: '',
        priorAuthDate: null,
    }

    const { result } = renderHook(() => useForm({defaultValues: {financial: [defaultInsuranceValue]}}))
    const arrayMethods = renderHook(() => useFieldArray({control: result.current.control, name: "financial"}))
    

    const props = {
        control: result.current.control,
        methods: {...arrayMethods.result.current, append: jest.fn()},
        defaultValue: defaultInsuranceValue,
        config: {
            organization: "...",
            tabs: [
                {
                    label: "Patient",
                    fields: [
                        {
                            id: "firstName",
                            required: true,
                            visible: true
                        },
                    ]
                }  
            ]
        },
        getValues: jest.fn()
    };

    test("renders the financial tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole } = render(
            <FinancialTab {...props}  />
        );  
        expect(getByRole('combobox', {name: 'Insurance'})).toBeInTheDocument();
        expect(getByPlaceholderText("Insurance")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Insurance Group Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("Insurance Group Name")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Insurance Group Number'})).toBeInTheDocument();
        expect(getByPlaceholderText("Insurance Group Number")).toBeInTheDocument();

        expect(getByRole('button', {name: 'Add Insurance'})).toBeInTheDocument();
    });

    test("can add more insurances", () => {
        const { getByRole, getAllByPlaceholderText } = render(
            <FinancialTab {...props}  />
        );  

        expect(getByRole('button', {name: 'Add Insurance'})).toBeInTheDocument();
        fireEvent.click(getByRole('button', {name: 'Add Insurance'}));
        expect(props.methods.append).toBeCalledTimes(1)
    });

    test("can update fields in financial tab", () => {
        const priorAuthDate = moment('1990-02-01').format('MM/DD/YYYY');
        const { getByPlaceholderText, getByRole } = render(
            <FinancialTab {...props}  />
        );  

        fireEvent.change(getByRole('textbox', {name: 'Insurance Group Name'}), {target: {value: 'testName'}});
        expect(getByRole('textbox', {name: 'Insurance Group Name'})).toHaveValue('testName');

        fireEvent.change(getByPlaceholderText("Prior Auth Date"), {target: {value: priorAuthDate}})
        expect(getByPlaceholderText("Prior Auth Date")).toHaveValue('02/01/1990');
    });
});

