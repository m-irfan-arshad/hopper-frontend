import { render, fireEvent, waitFor } from "@testing-library/react";
import moment from "moment";
import DateRangePicker from "../dateRangePicker";

describe("DateRangePicker", () => {

    const props = {
        dateRangeStart: moment().utc(),
        dateRangeEnd: moment().utc().add(7, 'days'),
        isDateRangeStartCalendarOpen: false,
        isDateRangeEndCalendarOpen: false,
        setDateRangeStartCalendarStatus: jest.fn(),
        setDateRangeEndCalendarStatus: jest.fn(),
        setDateRangeStart: jest.fn(),
        setDateRangeEnd: jest.fn()
    }

    test("renders the DateRangePicker and calls onChange of both Date Range Start and Date Range End", async() => {
        const { getByRole } = render(
            <DateRangePicker  {...props}/>
        ); 

        const dateRangeStart = moment('12/04/2022').startOf('day');
        const dateRangeEnd = moment('12/07/2022').endOf('day');

        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();

        fireEvent.change(getByRole("textbox", {name: "Date Range Start"}), {target: {value: dateRangeStart}});
    
        await waitFor(() => {
            expect(props.setDateRangeEnd).toHaveBeenCalledTimes(1);
            expect(props.setDateRangeStart).toHaveBeenCalledTimes(1);
        });
        
        expect(getByRole("textbox", {name: "Date Range End"})).toBeInTheDocument();

        fireEvent.change(getByRole("textbox", {name: "Date Range End"}), {target: {value: dateRangeEnd}});

        await waitFor(() => {
            expect(props.setDateRangeEnd).toHaveBeenCalledTimes(2);
            expect(props.setDateRangeStart).toHaveBeenCalledTimes(1);
        });

    });

    test("calls onOpen and onClose of Date Range Start DatePicker", async() => {
       //TODO: implement this test and maybe one more? This might cover the rest of the functionality though

    });
});
