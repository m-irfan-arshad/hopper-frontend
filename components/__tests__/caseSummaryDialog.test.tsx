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
    const { getByRole } = render(
      <CaseSummaryDialog {...props} />
    );

    expect(getByRole('heading', {name: 'Patient Name'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'firstName lastName'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'DOB'})).toBeInTheDocument();
    expect(getByRole('heading', {name: '01/01/2020'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Patient Address'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Grand Line'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Special Needs'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'needs'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Patient Phone'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Mobile: 111-111-1111'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Home: 999-999-9999'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Allergies'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'allergies'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Procedure Date and Time'})).toBeInTheDocument();
    expect(getByRole('heading', {name: '01/30/1990'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Length of Surgery'})).toBeInTheDocument();
    expect(getByRole('heading', {name: '1 hour'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Comments'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'comment'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Site'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'procedureLocation'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Surgeon Name'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'proceduralist'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Admission Type'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Inpatient'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Surgical Assistance'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Doctor Assist'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Procedures'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Foot Surgery'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Anesthesia Notes'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'note'})).toBeInTheDocument();
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
   
    const { getAllByRole } = render(
      <CaseSummaryDialog {...propsClone} />
    );

    expect(getAllByRole('heading', {name: 'N/A'})[0]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[1]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[2]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[3]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[4]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[5]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[6]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[7]).toBeInTheDocument();
    expect(getAllByRole('heading', {name: 'N/A'})[8]).toBeInTheDocument();
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
