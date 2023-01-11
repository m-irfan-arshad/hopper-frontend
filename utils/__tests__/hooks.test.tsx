import { renderHook, waitFor } from "@testing-library/react";
import { useGetCasesHook, useGetProvidersHook, useGetLocationsHook } from "../hooks";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from "moment";
import {mockCaseData, mockProviderData, mockLocationData} from '../../testReference'

interface Props {
    children: React.ReactNode
} 

global.fetch = jest.fn().mockImplementation(() =>  Promise.resolve({
    json: () => Promise.resolve(mockCaseData),
    ok: true
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

    test("call getCasesHook", async() => {
        const { result } = renderHook(() => useGetCasesHook(moment().utc().startOf('month'), moment().utc().endOf('month'), 'Oldest - Newest', [{"value": "true", "id": "vendorConfirmation"}], '1234', '1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        const queryString = new URLSearchParams({ 
            dateRangeStart: moment().utc().startOf('month').format(),
            dateRangeEnd: moment().utc().endOf('month').format(),
            orderBy: 'desc',
            page: '1',
            searchValue: '1234',
            vendorConfirmation: 'Incomplete'
        });

        expect(result.current.data).toEqual(mockCaseData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getCases?${queryString}`);
    });

    test("call getProviderOptionsHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockProviderData),
        }));
        
        const { result } = renderHook(() => useGetProvidersHook(123), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        expect(result.current.data).toEqual(mockProviderData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getProviders?serviceLineId=123`);
    });

    test("call getLocationOptionsHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockLocationData),
        }));
        
        const { result } = renderHook(() => useGetLocationsHook(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });
        
        expect(result.current.data).toEqual(mockLocationData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getLocations`);
    });
});
