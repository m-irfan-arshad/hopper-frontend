import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateCaseDialog from "../createCaseDialog";
import moment from "moment";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData } from "../../testReference";

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() })
}));

jest.mock("../../utils/hooks", () => ({
  useCreateCaseHook: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useGetLocationsHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockLocationData })),
  useGetProcedureUnitsHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockProcedureUnitData })),
  useGetServiceLinesHook: jest.fn().mockImplementation(() =>  ({ isLoading: false, data: mockServiceLineData })),
  useGetProvidersHook: jest.fn().mockImplementation(() => ({ isLoading: false, data: mockProviderData }))
}));

describe("CreateCaseDialog", () => {
  const props = {
    open: true,
    closeDialog: jest.fn()
  };

  beforeEach(() => {
    props.closeDialog.mockReset();
    jest.setTimeout(10000);
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
    const { getByRole } = render(
      <CreateCaseDialog {...props} />
    );

    expect(getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    expect(props.closeDialog).toHaveBeenCalledTimes(0);

    fireEvent.click(getByRole('button', {name: 'Cancel'}));
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

  test("calls onSubmit when all required fields are filled out", async() => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <CreateCaseDialog {...props} />
    );
    const dateNow = moment().format('MM/DD/YYYY');
    const dateTomorrow = moment().add(1).format('MM/DD/YYYY');
    
    expect(getByRole('textbox', {name: 'First Name'})).toBeInTheDocument();
    expect(getByRole('textbox', {name: 'Last Name'})).toBeInTheDocument();
    expect(getByRole('combobox', {name: 'Surgical Location'})).toBeInTheDocument();
    expect(getByRole('combobox', {name: 'Procedure Unit'})).toBeInTheDocument();
    expect(getByRole('combobox', {name: 'Service Line'})).toBeInTheDocument();
    expect(getByRole('combobox', {name: 'Primary Surgeon'})).toBeInTheDocument();
    expect(getByPlaceholderText("Procedure Date")).toBeInTheDocument();
    expect(getByPlaceholderText("Patient Date of Birth")).toBeInTheDocument();
    expect(getByRole('button', {name: 'Create Case'})).toBeDisabled();

    fireEvent.change(getByRole('textbox', {name: 'First Name'}), {target: {value: 'firstName'}});
    fireEvent.change(getByRole('textbox', {name: 'Last Name'}), {target: {value: 'lastName'}});
    fireEvent.change(getByPlaceholderText("Procedure Date"), {target: {value: dateNow}})
    fireEvent.change(getByPlaceholderText("Patient Date of Birth"), {target: {value: dateTomorrow}})
    fireEvent.change(getByRole("combobox", {name: 'Surgical Location'}), {target: {value: mockLocationData[0].locationName}})

    await waitFor(() => {
        expect(getByText(mockLocationData[0].locationName)).toBeInTheDocument();
    })

    fireEvent.click(getByText(mockLocationData[0].locationName));
    fireEvent.change(getByRole("combobox", {name: 'Procedure Unit'}), {target: {value: mockProcedureUnitData[0].procedureUnitName}})
    
    await waitFor(() => {
        expect(getByText(mockProcedureUnitData[0].procedureUnitName)).toBeInTheDocument();
    })

    fireEvent.click(getByText(mockProcedureUnitData[0].procedureUnitName));
    fireEvent.change(getByRole("combobox", {name: 'Service Line'}), {target: {value: mockServiceLineData[0].serviceLineName}})

    await waitFor(() => {
        expect(getByText(mockServiceLineData[0].serviceLineName)).toBeInTheDocument();
    })

    fireEvent.click(getByText(mockServiceLineData[0].serviceLineName));
    fireEvent.change(getByRole("combobox", {name: 'Primary Surgeon'}), {target: {value: mockProviderData[0].firstName}})

    await waitFor(() => {
        expect(getByText(`${mockProviderData[0].firstName} ${mockProviderData[0].lastName}`)).toBeInTheDocument();
    })

    fireEvent.click(getByText(`${mockProviderData[0].firstName} ${mockProviderData[0].lastName}`));

    await waitFor(() => {
      expect(getByRole('button', {name: 'Create Case'})).not.toBeDisabled();
    })

    fireEvent.click(getByRole('button', {name: 'Create Case'}));

    await waitFor(() => {
      expect(props.closeDialog).toHaveBeenCalledTimes(1);
    })
  });
});
