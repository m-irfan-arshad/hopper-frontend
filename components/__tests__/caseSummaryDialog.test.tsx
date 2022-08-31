import { render, fireEvent } from "@testing-library/react";
import CaseSummaryDialog from "../caseSummaryDialog";
import * as R from 'ramda';

describe("CaseSummaryDialog", () => {
  const props = {
    open: true,
    closeDialog: jest.fn(),
    row:  {
        caseID: "caseID",
        firstName: "firstName",
        lastName: "lastName",
        dateOfBirth: "01/01/2020",
        procedureDate: "01/30/1990",
        procedureLocation: "procedureLocation",
        proceduralist: "proceduralist",
        patientAddress: "Grand Line",
        specialNeeds: "needs",
        mobilePhone: "111-111-1111",
        homePhone: "999-999-9999",
        allergies: "allergies",
        surgeryLength: "1 hour",
        comments: "comment",
        admissionType: "Inpatient",
        surgeryAssistance: "Doctor Assist",
        procedures: "Foot Surgery",
        notes: "note",
        mrn: "mrn",
        steps: [
            {
                text: "hi",
                status: false
            }
        ]
    }
  };

  beforeEach(() => {
    props.closeDialog.mockReset();
  });

  test("renders the caseSummaryDialog", () => {
    const { getByText } = render(
      <CaseSummaryDialog {...props} />
    );

    expect(getByText('Patient Name')).toBeInTheDocument();
    expect(getByText('firstName lastName')).toBeInTheDocument();

    expect(getByText('DOB')).toBeInTheDocument();
    expect(getByText('01/01/2020')).toBeInTheDocument();

    expect(getByText('Patient Address')).toBeInTheDocument();
    expect(getByText('Grand Line')).toBeInTheDocument();

    expect(getByText('Special Needs')).toBeInTheDocument();
    expect(getByText('needs')).toBeInTheDocument();

    expect(getByText('Patient Phone')).toBeInTheDocument();
    expect(getByText('Mobile: 111-111-1111')).toBeInTheDocument();
    expect(getByText('Home: 999-999-9999')).toBeInTheDocument();

    expect(getByText('Allergies')).toBeInTheDocument();
    expect(getByText('allergies')).toBeInTheDocument();

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

    expect(getByText('Anesthesia Notes')).toBeInTheDocument();
    expect(getByText('note')).toBeInTheDocument();
  });

  test("renders the caseSummaryDialog with N/A for all applicable fields", () => {
    const propsClone = {
        open: true,
        closeDialog: jest.fn(),
        row:  {
            caseID: "caseID",
            firstName: "firstName",
            lastName: "lastName",
            dateOfBirth: "01/01/2020",
            procedureDate: "01/30/1990",
            procedureLocation: "procedureLocation",
            proceduralist: "proceduralist",
            mrn: "mrn",
            steps: [
                {
                    text: "hi",
                    status: false
                }
            ]
        }
    };
   
    const { getAllByText } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect((getAllByText('N/A')).length).toEqual(9);
  });

  test("handles closing of createCaseDialog", () => {
    const { getByRole } = render(
      <CaseSummaryDialog {...props} />
    );

    expect(getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    expect(props.closeDialog).toHaveBeenCalledTimes(0);

    fireEvent.click(getByRole('button', {name: 'Cancel'}));
    expect(props.closeDialog).toHaveBeenCalledTimes(1);
  });

});
