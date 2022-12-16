import { render, fireEvent, waitFor } from "@testing-library/react";
import moment from "moment";
import DateRangePicker from "../dateRangePicker";

const props = {
    dateRangeStart: moment("12/13/2022"),
    dateRangeEnd: moment("12/13/2022").add(7, 'days'),
    setDateRangeStart: jest.fn(),
    setDateRangeEnd: jest.fn()
}

describe("DateRangePicker", () => {

    afterEach(()=> {
        jest.clearAllMocks()
    })

    it('sets default value', function () {
        const { getByLabelText } = render(<DateRangePicker {...props} />);
        const input = getByLabelText('Date Range Start');
    
        expect(input).toHaveValue('12/13/2022');
      });

    it('can update start / end of day date', async function () {
        const { getByLabelText } = render(<DateRangePicker {...props} />);
        const dateRangeStart = "12/19/2022";
        const dateRangeEnd = "01/20/2023";
        const startInput = getByLabelText('Date Range Start');
        const endInput = getByLabelText('Date Range End');
    
        fireEvent.change(startInput, {target: {value: dateRangeStart}});
    
        await waitFor(() => {
            expect(startInput).toHaveValue('12/19/2022')
            expect(props.setDateRangeEnd).toHaveBeenCalledWith(null)
            expect(props.setDateRangeStart).toHaveBeenCalledTimes(1);
            expect(props.setDateRangeEnd).toHaveBeenCalledTimes(1);
        });

        fireEvent.change(endInput, {target: {value: dateRangeEnd}});
        await waitFor(() => {
            expect(startInput).toHaveValue('12/19/2022')
            expect(endInput).toHaveValue('01/20/2023')
            expect(props.setDateRangeEnd).toHaveBeenCalledTimes(2);
        });

    });

    it("calls onChange of both Date Range Start and Date Range End", async() => {
        const { getByRole } = render(
            <DateRangePicker  {...props}/>
        ); 

        const dateRangeStart = '12/19/2022';
        const dateRangeEnd = '12/29/2022';

        expect(getByRole("textbox", {name: "Date Range Start"})).toBeInTheDocument();
        fireEvent.change(getByRole("textbox", {name: "Date Range Start"}), {target: {value: dateRangeStart}});
        
        expect(getByRole("textbox", {name: "Date Range End"})).toBeInTheDocument();
        fireEvent.change(getByRole("textbox", {name: "Date Range End"}), {target: {value: dateRangeEnd}});

        await waitFor(() => {
            expect(props.setDateRangeStart).toHaveBeenCalledTimes(1);
            expect(props.setDateRangeEnd).toHaveBeenCalledTimes(2);
        });

    });
});
