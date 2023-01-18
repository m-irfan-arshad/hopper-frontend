import { render, fireEvent } from "@testing-library/react";
import CaseSummaryDialog from "../caseSummaryDialog";
import * as R from 'ramda';
import { useUpdateCaseHook } from '../../utils/hooks';

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
    row: {
      caseId: 1,
      fhirResourceId: "testId",
      patientId: 1,
      procedureDate: "01/30/1990",
      providerId: 123,
      locationId: 456,
      createTime: new Date(),
      updateTime: new Date(),
      procedureLocation: "procedureLocation",
      patients: {
        patientId: 1,
        fhirResourceId: "aa22ss",
        firstName: "Captain",
        lastName: "Whitebeard",
        dateOfBirth: "02/01/1990",
        mobilePhone: "111-111-1111",
        homePhone: "555-555-5555",
        address: "330 Philly Lane",
        mrn: "5678567890",
      },
        locationName: "testLocationName",
        providerName: "provider name",
      steps: {
        priorAuthorization: "Incomplete",
        vendorConfirmation: "Incomplete",
      }
    }
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
    expect(getByText('330 Philly Lane')).toBeInTheDocument();

    expect(getByText('Patient Phone')).toBeInTheDocument();
    expect(getByText('Mobile: 111-111-1111')).toBeInTheDocument();
    expect(getByText('Home: 555-555-5555')).toBeInTheDocument();

    expect(getByText('Procedure Date and Time')).toBeInTheDocument();
    expect(getByText('01/30/1990')).toBeInTheDocument();

    expect(getByText('Site')).toBeInTheDocument();
    expect(getByText('testLocationName')).toBeInTheDocument();

    expect(getByText('Surgeon Name')).toBeInTheDocument();
    expect(getByText('provider name')).toBeInTheDocument();

  });

  test("renders the caseSummaryDialog with N/A for all applicable fields", () => {
    const propsClone = {...testProps, row: {...testProps.row, providerName: ''}}
      
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

    expect(getByRole('button', {name: 'Verify Insurance'})).toBeInTheDocument();
    expect(getByRole('button', {name: 'Confirm Vendor'})).toBeInTheDocument();
  });

  test("renders correct buttons when step completed", () => {
    const propsClone = {...testProps, row: {...testProps.row, steps: {priorAuthorization: "Complete", vendorConfirmation: "Complete"}}}
    
    const { getByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect(getByRole('button', {name: 'Insurance Verified'})).toBeInTheDocument();
    expect(getByRole('button', {name: 'Vendor Confirmed'})).toBeInTheDocument();
  });

  test("triggers mutation when action button pressed", () => {
    const propsClone = {...testProps}
    
    const { getByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );
    
    fireEvent.click(getByRole('button', {name: 'Verify Insurance'}))
    expect(mutateFunc).toHaveBeenCalledTimes(1);
  });

});
