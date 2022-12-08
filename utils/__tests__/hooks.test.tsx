import { renderHook, waitFor } from "@testing-library/react";
import { useGetCasesHook, useGetProviderOptionsHook, useGetLocationOptionsHook } from "../hooks";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from "moment";

interface Props {
    children: React.ReactNode
}

const mockCaseData = [
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

const mockProviderData = [
    {
        providerId: 1,
        fhirResourceId: "testId",
        firstName: 'firstName',
        lastName: 'lastName',
        locationName: 'NYU Langone',
        address: 'address',
        serviceLine: 'General Surgery',
        email: 'fake@email.com',
        createTime: new Date(),
        updateTime: new Date()
    },
    {
        providerId: 2,
        fhirResourceId: "testId2",
        firstName: 'firstName2',
        lastName: 'lastName2',
        locationName: 'NYU Langone2',
        address: 'address2',
        serviceLine: 'General Surgery2',
        email: 'fake2@email.com',
        createTime: new Date(),
        updateTime: new Date()
    }
]; 

const mockLocationData = [
    {
        locationId: 1,
        fhirResourceId: 'fhirResourceId',
        locationName: 'locationName',
        createTime: new Date(),
        updateTime: new Date()
    },
    {
        locationId: 2,
        fhirResourceId: 'fhirResourceId2',
        locationName: 'locationName2',
        createTime: new Date(),
        updateTime: new Date()
    }
]; 

global.fetch = jest.fn().mockImplementation(() =>  Promise.resolve({
    json: () => Promise.resolve(mockCaseData),
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

    test("call getCasesHook with", async() => {
        const { result } = renderHook(() => useGetCasesHook(moment().utc().startOf('month'), moment().utc().endOf('month'), 'Oldest - Newest', [{"value": "true", "id": "vendorConfirmation"}], '1234', '1'), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        const queryString = new URLSearchParams({ 
            dateRangeStart: moment().utc().startOf('month').format(),
            dateRangeEnd: moment().utc().endOf('month').format(),
            orderBy: 'asc',
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
        
        const { result } = renderHook(() => useGetProviderOptionsHook(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        expect(result.current.data).toEqual(mockProviderData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getProviderOptions`);
    });

    test("call getLocationOptionsHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockLocationData),
        }));
        
        const { result } = renderHook(() => useGetLocationOptionsHook(2), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });
        
        expect(result.current.data).toEqual(mockLocationData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getLocationOptions?providerId=2`);
    });
});
