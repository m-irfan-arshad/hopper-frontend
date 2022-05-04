import { render, waitFor, fireEvent } from "@testing-library/react";
import ResponsiveDatePicker from "../responsiveDatePicker";
import moment from "moment";

describe("ResponsiveDatePicker", () => {
  test("changes the datepicker value", () => {
    const finalDate = moment().subtract(1, "years").subtract("1", "months").format("MM/DD/YYYY");

    const { getByDisplayValue, getByText, getByLabelText, getAllByText } =
      render(<ResponsiveDatePicker />);

    expect(getByLabelText("Responsive")).toBeInTheDocument();
    expect(getByDisplayValue(moment().format("MM/DD/YYYY"))).toBeInTheDocument();

    fireEvent.click(getByLabelText("Responsive"));

    fireEvent.click(getByText(moment().subtract(1, "years").year()));
    fireEvent.click(getByText(moment().subtract(1, "months").format("MMM")));
    fireEvent.click(getAllByText(moment().date())[0]);

    expect(getByDisplayValue(finalDate)).toBeInTheDocument();
  });
});
