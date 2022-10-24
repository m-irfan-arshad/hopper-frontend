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
      providerName: "testProviderName",
      locationName: "testLocationName",
      createTime: new Date(),
      updateTime: new Date(),
      priorAuthorization: "Incomplete",
      vendorConfirmation: "Incomplete",
      surgeryLength: "1 hour",
      comments: "comment",
      procedureLocation: "procedureLocation",
      proceduralist: "proceduralist",
      admissionType: "Inpatient",
      surgeryAssistance: "Doctor Assist",
      procedures: "Foot Surgery",
      allergies: "seasonal",
      patients: {
        firstName: "Captain",
        lastName: "Whitebeard",
        dateOfBirth: "02/01/1990",
        mobilePhone: "111-111-1111",
        homePhone: "555-555-5555",
        address: "330 Philly Lane",
        mrn: "5678567890"
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

    expect(getByText('Length of Surgery')).toBeInTheDocument();
    expect(getByText('1 hour')).toBeInTheDocument();

    expect(getByText('Comments')).toBeInTheDocument();
    expect(getByText('comment')).toBeInTheDocument();

    expect(getByText('Site')).toBeInTheDocument();
    expect(getByText('procedureLocation')).toBeInTheDocument();

    expect(getByText('Surgeon Name')).toBeInTheDocument();
    expect(getByText('proceduralist')).toBeInTheDocument();

    expect(getByText('Admission Type')).toBeInTheDocument();
    expect(getByText('Inpatient')).toBeInTheDocument();

    expect(getByText('Surgical Assistance')).toBeInTheDocument();
    expect(getByText('Doctor Assist')).toBeInTheDocument();

    expect(getByText('Procedures')).toBeInTheDocument();
    expect(getByText('Foot Surgery')).toBeInTheDocument();
  });

  test("renders the caseSummaryDialog with N/A for all applicable fields", () => {
    const propsClone = {...testProps}
      
    const { getAllByText } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect((getAllByText('N/A')).length).toEqual(2);
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
    const propsClone = {...testProps, row: {...testProps.row, priorAuthorization: "Complete", vendorConfirmation: "Complete"}}
    
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
