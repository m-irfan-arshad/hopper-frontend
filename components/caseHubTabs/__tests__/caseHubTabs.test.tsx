import { render, fireEvent } from "@testing-library/react";
import CaseHubTabs from '../caseHubTabs';
import { PagesTestWrapper } from "../../../testReference";

jest.mock('@tanstack/react-query', () => ({
    useQueryClient: jest.fn().mockReturnValue(({invalidateQueries: ()=>{}})),
    QueryClient: jest.fn(),
    useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
    useQuery: jest.fn().mockReturnValue({ data: [] })
}));

describe('CaseHubTabs', () => {

    test("click on the Document tab to open the Document section on the case hub page", async() => {
        
        const { getByRole } = render(
            <PagesTestWrapper >
                <CaseHubTabs />
            </PagesTestWrapper>
        );

        expect(getByRole('tab', {name: 'Documents (2)'})).toBeInTheDocument();

        fireEvent.click(getByRole('tab', {name: 'Documents (2)'}));

        expect(getByRole('button', {name: '+ Upload Document'})).toBeInTheDocument();

    });

    test("click on the Comment tab to open the Comment section on the case hub page", async() => { 
        const { getByRole } = render(
            <PagesTestWrapper >
                <CaseHubTabs />
            </PagesTestWrapper>
        );

        expect(getByRole('tab', {name: 'Comments (0)'})).toBeInTheDocument();

        fireEvent.click(getByRole('tab', {name: 'Comments (0)'}));

        expect(getByRole('button', {name: '+ New Comment'})).toBeInTheDocument();
    });
});