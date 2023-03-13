import { render, fireEvent, waitFor } from "@testing-library/react";
import CaseHub from '../[caseId].page';
import { mockSingleCase } from "../../../testReference";
import { PagesTestWrapper } from "../../../testReference";
import { useGenericQueryHook } from "../../../utils/hooks";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    QueryClient: jest.fn(),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() })
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({query: {caseId: '123'}}),
}))

jest.mock("../../../utils/hooks", () => ({
    useGetCaseByIdHook: jest.fn().mockImplementation(() => ({data: mockSingleCase})),
    useUpdateCaseHook: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
    useGenericQueryHook: jest.fn().mockImplementation(() => ({}))
}));

describe('[caseId]: Case Hub Page', () => {

  test("renders the case hub page", async() => {
    
    const { getByRole } = render(
        <PagesTestWrapper >
          <CaseHub />
        </PagesTestWrapper>
    );

    expect(getByRole('button', {name: 'Booking Sheet'})).toBeInTheDocument();
    expect(getByRole('button', {name: '< Dashboard'})).toBeInTheDocument();

    expect(getByRole('tab', {name: 'Patient'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Financial'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Procedure'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Scheduling'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Implants & Products'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Clinical'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Procedure Information'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Scheduling'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Procedure Details'})).toBeInTheDocument();

    expect(getByRole('heading', {name: 'Activity'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Case Amendments'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Comments'})).toBeInTheDocument();
    expect(getByRole('heading', {name: 'Documents'})).toBeInTheDocument();

  });

  test("opens and closes the booking sheet", async() => {
    
    const { getByRole, queryByRole } = render(
        <PagesTestWrapper >
          <CaseHub />
        </PagesTestWrapper>
    );

    expect(queryByRole('button', {name: 'Booking Sheet'})).toBeInTheDocument();

    fireEvent.click(getByRole('button', {name: 'Booking Sheet'}));
    expect(queryByRole('tab', {name: 'Patient'})).toBeInTheDocument();
    
    expect(queryByRole('button', {name: ''})).toBeInTheDocument();
    fireEvent.click(getByRole('button', {name: ''}));
    
    await waitFor(() => {
        expect(queryByRole('button', {name: ''})).not.toBeInTheDocument();
    });
  });

  test("click on a tab to open the booking sheet to the correct tab", async() => {
    
    const { getByRole } = render(
        <PagesTestWrapper >
          <CaseHub />
        </PagesTestWrapper>
    );

    expect(getByRole('tab', {name: 'Financial'})).toBeInTheDocument();

    fireEvent.click(getByRole('tab', {name: 'Financial'}));

    expect(getByRole('tab', {name: 'Financial'})).toHaveAttribute('aria-selected', "true");
      
  });
});