import { render, fireEvent, screen } from "@testing-library/react";
import CreateCaseDialog from "../createCaseDialog";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../theme";
import * as R from 'ramda';
import moment from "moment";

describe("CaseCard", () => {
  const props = {
    open: true,
    closeDialog: jest.fn()
  };

  beforeEach(() => {
    props.closeDialog.mockReset();
  });

  test("renders the createCaseDialog", () => {
    const { getByLabelText } = render(
      <CreateCaseDialog {...props} />
    );

    expect(getByLabelText("First Name")).toBeInTheDocument();
    expect(getByLabelText("Last Name")).toBeInTheDocument();
    expect(getByLabelText("Patient Date of Birth")).toBeInTheDocument();
    expect(getByLabelText("Primary Surgeon")).toBeInTheDocument();
    expect(getByLabelText("Surgical Location")).toBeInTheDocument();
    expect(getByLabelText("Procedure Unit")).toBeInTheDocument();
    expect(getByLabelText("Service Line")).toBeInTheDocument();
    expect(getByLabelText("Procedure Date")).toBeInTheDocument();
  });

  test("handles closing of createCaseDialog", () => {
    const { getByText } = render(
      <CreateCaseDialog {...props} />
    );

    expect(getByText("Cancel")).toBeInTheDocument();
    expect(props.closeDialog).toHaveBeenCalledTimes(0);

    fireEvent.click(getByText("Cancel"));
    expect(props.closeDialog).toHaveBeenCalledTimes(1);
  });

  test("changes calendar date", () => {
    const { getByPlaceholderText } = render(
      <CreateCaseDialog {...props} />
    );
    const dateNow = moment().format('MM/DD/YYYY');
    const dateTomorrow = moment().add(1).format('MM/DD/YYYY');

    expect(getByPlaceholderText("Procedure Date")).toBeInTheDocument();
    expect(getByPlaceholderText("Patient Date of Birth")).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText("Procedure Date"), {target: {value: dateNow}})
    fireEvent.change(getByPlaceholderText("Patient Date of Birth"), {target: {value: dateTomorrow}})

    expect(getByPlaceholderText("Procedure Date")).toHaveValue(dateNow);
    expect(getByPlaceholderText("Patient Date of Birth")).toHaveValue(dateTomorrow);
  });
});
