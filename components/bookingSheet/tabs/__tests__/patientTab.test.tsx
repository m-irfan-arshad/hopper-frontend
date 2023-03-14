import { render, renderHook, fireEvent } from '@testing-library/react'        
import PatientTab from "../patientTab";
import moment from "moment";
import { useForm, FormProvider } from "react-hook-form";
import { FormWrapper } from "../../../../testReference";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    QueryClient: jest.fn(),
    useQuery: jest.fn().mockReturnValue({ data: [] })
}));  

describe("PatientTab", () => {
    const { result } = renderHook(() => useForm())
    const birthDate = moment('1990-02-01').format('MM/DD/YYYY');
    
    const props = {
        control: result.current.control,
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

    test("renders the patient tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole } = render(
            <FormWrapper>
            <PatientTab {...props}  />
            </FormWrapper>
        );  
        expect(getByRole('textbox', {name: 'First Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("First Name")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Middle Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("Middle Name")).toBeInTheDocument();

        expect(getByLabelText("Zip")).toBeInTheDocument();
        expect(getByPlaceholderText("Zip")).toBeInTheDocument();
    });

    test("does not render fields marked non visible in the patient tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole, queryByRole } = render(
            <FormWrapper>
            <PatientTab config={{
                organization: "...",
                tabs: [
                    {
                        label: "Patient",
                        fields: [
                            {
                                id: "firstName",
                                required: true,
                                visible: false
                            },
                        ]
                    }  
                ]
            }}  />
            </FormWrapper>
        );  
        expect(queryByRole('textbox', {name: 'First Name'})).not.toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Middle Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("Middle Name")).toBeInTheDocument();
    });

    test("can update fields in patient tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole } = render(
            <FormWrapper>
            <PatientTab {...props}  />
            </FormWrapper>
        );  

        expect(getByRole('textbox', {name: 'Middle Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("Middle Name")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Zip'})).toBeInTheDocument();
        fireEvent.change(getByRole('textbox', {name: 'Zip'}), {target: {value: '10000'}});
        expect(getByRole('textbox', {name: 'Zip'})).toHaveValue('10000');

        expect(getByPlaceholderText("Zip")).toBeInTheDocument();

        expect(getByLabelText("Date of Birth")).toBeInTheDocument();
        expect(getByPlaceholderText("Date of Birth")).toBeInTheDocument();

        fireEvent.change(getByPlaceholderText("Date of Birth"), {target: {value: birthDate}})
        expect(getByPlaceholderText("Date of Birth")).toHaveValue('02/01/1990');
    });
});

