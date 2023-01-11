import { render, fireEvent, waitFor } from "@testing-library/react";
import CreateCaseDialog from "../createCaseDialog";
import moment from "moment";
import { mockLocationData, mockProviderData, mockProcedureUnitData, mockServiceLineData } from "../../testReference";
import { 
  useCreateCaseHook, 
  useGetLocationsHook, 
  useGetProcedureUnitsHook,
  useGetServiceLinesHook,
  useGetProvidersHook
} from '../../utils/hooks';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() })
}));

jest.mock("../../utils/hooks");

describe("CreateCaseDialog", () => {
  const mockedUseGetLocationsHook = useGetLocationsHook as jest.Mock<any>; 
  mockedUseGetLocationsHook.mockImplementation(() => ({ isLoading: false, data: mockLocationData }));

  const mockedUseCreateCaseHook = useCreateCaseHook as jest.Mock<any>; 
  mockedUseCreateCaseHook.mockImplementation(() => ({ mutate: jest.fn() }));

  const mockedUseGetProcedureUnitsHook = useGetProcedureUnitsHook as jest.Mock<any>; 
  mockedUseGetProcedureUnitsHook.mockImplementation(() => ({ isLoading: false, data: mockProcedureUnitData }));

  const mockedUseGetServiceLinesHook = useGetServiceLinesHook as jest.Mock<any>; 
  mockedUseGetServiceLinesHook.mockImplementation(() => ({ isLoading: false, data: mockServiceLineData }));

  const mockedUseGetProvidersHook = useGetProvidersHook as jest.Mock<any>; 
  mockedUseGetProvidersHook.mockImplementation(() => ({ isLoading: false, data: mockProviderData }));
  
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

  //TODO: make an onsubmit test
});
