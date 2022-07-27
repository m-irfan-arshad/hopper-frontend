import { render, fireEvent, screen } from "@testing-library/react";
import CreateCaseDialog from "../createCaseDialog";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../theme";
import * as R from 'ramda';
import moment from "moment";

describe("CaseCard", () => {
  const props = {
    open: true,
    handleClose: jest.fn()
  };

  test("renders the createCaseDialog", () => {
    const { getByText } = render(
      <CreateCaseDialog {...props} />
    );

    expect(getByText("First Name")).toBeInTheDocument();
    expect(getByText("Last Name")).toBeInTheDocument();
    expect(getByText("Patient Date of Birth")).toBeInTheDocument();
    expect(getByText("Primary Surgeon")).toBeInTheDocument();
    expect(getByText("Surgical Location")).toBeInTheDocument();
    expect(getByText("Procedure Unit")).toBeInTheDocument();
    expect(getByText("Service Line")).toBeInTheDocument();
    expect(getByText("Procedure Date")).toBeInTheDocument();
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
