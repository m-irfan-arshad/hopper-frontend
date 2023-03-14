import { render, fireEvent } from "@testing-library/react";
import CaseSummaryDialog from "../caseSummaryDialog";
import * as R from 'ramda';
import { useUpdateCaseHook } from '../../utils/hooks';
import { mockSingleCase } from "../../testReference";

jest.mock("../../utils/hooks");

describe("CaseSummaryDialog", () => {
  const mutateFunc = jest.fn()
  const mockedUseUpdateCaseHook = useUpdateCaseHook as jest.Mock<any>; 
  mockedUseUpdateCaseHook.mockImplementation(() => ({ mutate: mutateFunc }));

  afterEach(() => {
    mutateFunc.mockClear();
  });

  const testProps = {
    open: true,
    closeDialog: jest.fn(),
    row: mockSingleCase
  };

  beforeEach(() => {
    testProps.closeDialog.mockReset();
  });

  test("renders the caseSummaryDialog", () => {
    const { getByText } = render(
      <CaseSummaryDialog {...testProps} />
    );

    expect(getByText('Patient Name')).toBeInTheDocument();
    expect(getByText('Captain Whitebeard')).toBeInTheDocument();

    expect(getByText('DOB')).toBeInTheDocument();
    expect(getByText('02/01/1990')).toBeInTheDocument();

    expect(getByText('Patient Address')).toBeInTheDocument();
    expect(getByText('360 Washington Ave')).toBeInTheDocument();

    expect(getByText('Patient Phone')).toBeInTheDocument();
    expect(getByText('Mobile: 221-345-2211')).toBeInTheDocument();
    expect(getByText('Home: 333-544-2222')).toBeInTheDocument();

    expect(getByText('Procedure Date and Time')).toBeInTheDocument();
    expect(getByText('10/10/2022')).toBeInTheDocument();

    expect(getByText('Site')).toBeInTheDocument();
    expect(getByText('Medtel Hospital')).toBeInTheDocument();

    expect(getByText('Surgeon Name')).toBeInTheDocument();
    expect(getByText('Lee, Robert')).toBeInTheDocument();

  });

  test("renders the caseSummaryDialog with N/A for all applicable fields", () => {
    const propsClone = {...testProps, row: {...testProps.row, scheduling: {...testProps.row.scheduling, provider: null} }}
      
    const { getAllByText } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect((getAllByText('N/A')).length).toEqual(1);
  });

  test("handles closing of createCaseDialog", () => {
    const propsClone = {...testProps}
    
    const { getByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect(getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    expect(propsClone.closeDialog).toHaveBeenCalledTimes(0);

    fireEvent.click(getByRole('button', {name: 'Cancel'}));
    expect(propsClone.closeDialog).toHaveBeenCalledTimes(1);
  });

  test("renders correct buttons when step not completed yet", () => {
    const propsClone = {...testProps}
    
    const { getByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect(getByRole('button', {name: 'Confirm Vendor'})).toBeInTheDocument();
  });

  test("triggers mutation when action button pressed", () => {
    const propsClone = {...testProps}
    
    const { getByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );
    
    fireEvent.click(getByRole('button', {name: 'Confirm Vendor'}))
    expect(mutateFunc).toHaveBeenCalledTimes(1);
  });

  test("renders correct buttons when step completed", () => {
    const propsClone = {...testProps, row: testProps.row}
    propsClone.row.vendorConfirmation = "Complete"
    
    const { getByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect(getByRole('button', {name: 'Vendor Confirmed'})).toBeInTheDocument();
  });

});
