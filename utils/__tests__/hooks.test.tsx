import { renderHook, waitFor } from "@testing-library/react";
import { useGetCasesHook } from "../hooks";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from "moment";

interface Props {
    children: React.ReactNode
}

const mockData = [
    {
        caseId: 'caseId',
        procedureDate: moment('10/10/2022').utc().format(),
        patients: {
            firstName: 'firstName',
            lastName: 'lastName',
            dateOfBirth: 'DOB',
            mobilePhone: 'mobilePhone',
            mrn: 'mrn',
            address: 'address'
        }
    },
    {
            caseId: 'caseId2',
            procedureDate: moment('10/11/2022').utc().format(),
            patients: {
                firstName: 'firstName2',
                lastName: 'lastName2',
                dateOfBirth: 'DOB2',
                mobilePhone: 'mobilePhone2',
                mrn: 'mrn2',
                address: 'address2'
        }
    }
]; 

global.fetch = jest.fn().mockImplementation(() =>  Promise.resolve({
    json: () => Promise.resolve(mockData),
}));

jest.spyOn(Date, 'now').mockReturnValue(new Date('10/17/2022').getTime());

afterEach(() => {
    jest.clearAllMocks();
});

describe("Hooks", () => {
    const queryClient = new QueryClient();

    const wrapper = ({ children }: Props) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
    );

    test("call query with next month, asc order, and case id value", async() => {
        const { result } = renderHook(() => useGetCasesHook('Next month', 'Oldest - Newest', [{"value": "true", "id": "vendorConfirmation"}], '1234', '1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        const queryString = new URLSearchParams({ 
            dateRangeStart: moment().utc().add(1, 'month').startOf('month').format(),
            dateRangeEnd: moment().utc().add(1, 'month').endOf('month').format(),
            orderBy: 'asc',
            page: '1',
            searchValue: '1234',
            vendorConfirmation: 'Incomplete'
        });

        expect(result.current.data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getCases?${queryString}`);
    });

    test("call query with this month, desc order, and only first name value", async() => {
        const { result } = renderHook(() => useGetCasesHook('This month', 'Newest - Oldest', [{"value": "true", "id": "vendorConfirmation"}], 'Bob', '1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        const queryString = new URLSearchParams({ 
            dateRangeStart: moment().utc().format(),
            dateRangeEnd: moment().utc().endOf('month').format(),
            orderBy: 'desc',
            page: '1',
            searchValue: 'Bob',
            vendorConfirmation: 'Incomplete'
        });

        expect(result.current.data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getCases?${queryString}`);
    });

    test("call query with next quarter, desc order, and both first and last name", async() => {
        const { result } = renderHook(() => useGetCasesHook('Next quarter', 'Newest - Oldest', [{"value": "true", "id": "vendorConfirmation"}], 'Bob Billy', '1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        const queryString = new URLSearchParams({ 
            dateRangeStart: moment().utc().format(),
            dateRangeEnd: moment().utc().add(2, 'month').endOf('month').format(),
            orderBy: 'desc',
            page: '1',
            searchValue: 'Bob Billy',
            vendorConfirmation: 'Incomplete'
        });

        expect(result.current.data).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getCases?${queryString}`);
    });
});
