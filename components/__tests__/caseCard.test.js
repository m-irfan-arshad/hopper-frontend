import { render, fireEvent } from "@testing-library/react";
import CaseCard from "../caseCard";

describe("CaseCard", () => {
  const row = {
    caseID: 12345,
    firstName: "Captain",
    lastName: "Whitebeard",
    dateOfBirth: "02/01/1990",
    procedureDate: "2022-05-05T00:00:00Z",
    procedureLocation: "Whitebeard's ship",
    proceduralist: "Doctor Whitebeard",
    mrn: 5678567890,
  };
  test("renders the caseCard and can expand it", async () => {
    const { getByText, queryByText, getByLabelText } = render(
      <CaseCard row={row} />
    );

    expect(getByText("Captain Whitebeard")).toBeInTheDocument();
    expect(getByText("02/01/1990")).toBeInTheDocument();

    expect(queryByText("Whitebeard's ship")).not.toBeInTheDocument();
    expect(queryByText("Doctor Whitebeard")).not.toBeInTheDocument();

    expect(getByLabelText("show more")).toBeInTheDocument();
    fireEvent.click(getByLabelText("show more"));

    expect(queryByText("Whitebeard's ship")).toBeInTheDocument();
    expect(queryByText("Doctor Whitebeard")).toBeInTheDocument();
  });
});
