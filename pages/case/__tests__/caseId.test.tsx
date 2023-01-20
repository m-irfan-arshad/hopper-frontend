import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseHub from '../[caseId]';
import { mockCaseData } from "../../../testReference";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    QueryClient: jest.fn()
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({query: {caseId: '123'}}),
}))

jest.mock("../../../utils/hooks", () => ({
    useGetCaseByIdHook: jest.fn().mockImplementation(() => ({ data: mockCaseData[0] })),
  }));

describe('[caseId]: Case Hub Page', () => {
  test("renders the case hub page and opens/closes the booking sheet", async() => {
    
    const { getByRole, queryByRole } = render(
        <CaseHub />
    );

    expect(queryByRole('button', {name: 'Booking Sheet'})).toBeInTheDocument();

    fireEvent.click(getByRole('button', {name: 'Booking Sheet'}));
    expect(queryByRole('tab', {name: 'Patient'})).toBeInTheDocument();
    
    expect(queryByRole('button', {name: ''})).toBeInTheDocument();
    fireEvent.click(getByRole('button', {name: ''}));
    
    await waitFor(() => {
        expect(queryByRole('tab', {name: 'Patient'})).not.toBeInTheDocument();
    });
  });
});