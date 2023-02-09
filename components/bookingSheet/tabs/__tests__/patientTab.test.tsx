import { render, renderHook, fireEvent } from '@testing-library/react'        
import PatientTab from "../patientTab";
import { patients } from "@prisma/client";
import moment from "moment";
import { useForm } from "react-hook-form";



describe("PatientTab", () => {
    const { result } = renderHook(() => useForm())
    const dateNow = moment().format('MM/DD/YYYY');
    
    const props = {
        control: result.current.control
    };

    test("renders the patient tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole } = render(
            <PatientTab {...props}  />
        );  
        expect(getByRole('textbox', {name: 'First Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("First Name")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Middle Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("Middle Name")).toBeInTheDocument();

        expect(getByLabelText("Zip")).toBeInTheDocument();
        expect(getByPlaceholderText("Zip")).toBeInTheDocument();
    });

    test("can update fields in patient tab", () => {
        const { getByPlaceholderText, getByLabelText, getByRole } = render(
            <PatientTab {...props}  />
        );  
        expect(getByRole('textbox', {name: 'First Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("First Name")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Middle Name'})).toBeInTheDocument();
        expect(getByPlaceholderText("Middle Name")).toBeInTheDocument();

        expect(getByRole('textbox', {name: 'Zip'})).toBeInTheDocument();
        fireEvent.change(getByRole('textbox', {name: 'Zip'}), {target: {value: '10000'}});
        expect(getByRole('textbox', {name: 'Zip'})).toHaveValue('10000');

        expect(getByPlaceholderText("Zip")).toBeInTheDocument();

        expect(getByLabelText("Date of Birth")).toBeInTheDocument();
        expect(getByPlaceholderText("Date of Birth")).toBeInTheDocument();

        fireEvent.change(getByPlaceholderText("Date of Birth"), {target: {value: dateNow}})
        expect(getByPlaceholderText("Date of Birth")).toHaveValue(dateNow);
    });
});

