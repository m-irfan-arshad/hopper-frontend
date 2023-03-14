import { render, renderHook, fireEvent } from '@testing-library/react'        
import PatientTab from "../patientTab";
import moment from "moment";
import { FormProvider, useForm } from "react-hook-form";
import FinancialTab from '../financialTab';
import { defaultInsuranceValue } from '../../../../reference';

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockReturnValue({ data: [] })
})); 

const FinancialFormWrapper = (props: any) => {
    const formMethods = useForm({
        defaultValues: {
            financial: [defaultInsuranceValue]
        }
    });

    return (
      <FormProvider {...formMethods}>
        {props.children}
      </FormProvider>
    );
  };

describe("FinancialTab", () => { 

    const props = {
        config: {
            organization: "",
            tabs: []
        }
    };

    test("renders the financial tab", () => {
        const { getByPlaceholderText, getByRole } = render(
            <FinancialFormWrapper>
                <FinancialTab {...props}  />
            </FinancialFormWrapper>
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
        const { getAllByRole, getByRole } = render(
            <FinancialFormWrapper>
                <FinancialTab {...props}  />
            </FinancialFormWrapper>
        );  

        expect(getByRole('button', {name: 'Add Insurance'})).toBeInTheDocument();
        fireEvent.click(getByRole('button', {name: 'Add Insurance'}));
        expect(getAllByRole('combobox', {name: 'Insurance'}).length).toEqual(2);
    });

    test("can update fields in financial tab", () => {
        const priorAuthDate = moment('1990-02-01').format('MM/DD/YYYY');
        const { getByPlaceholderText, getByRole } = render(
            <FinancialFormWrapper>
                <FinancialTab {...props}  />
            </FinancialFormWrapper>
        );  

        fireEvent.change(getByRole('textbox', {name: 'Insurance Group Name'}), {target: {value: 'testName'}});
        expect(getByRole('textbox', {name: 'Insurance Group Name'})).toHaveValue('testName');

        fireEvent.change(getByPlaceholderText("Prior Auth Date"), {target: {value: priorAuthDate}})
        expect(getByPlaceholderText("Prior Auth Date")).toHaveValue('02/01/1990');
    });
});

