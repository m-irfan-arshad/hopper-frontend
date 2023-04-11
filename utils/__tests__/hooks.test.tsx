import { renderHook, waitFor, act } from "@testing-library/react";
import { 
    useGetCasesHook, 
    useGetCaseByIdHook, 
    useGetDropdownOptionsHook,
    useCreateCommentHook,
    useGetBookingSheetConfigHook,
    useDownloadDocumentHook
} from "../hooks";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import moment from "moment";
import {mockBookingSheetConfig, mockCaseData, mockCommentData, mockServiceLineData, mockSingleDocument} from '../../testReference'

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

    test("call getCaseByIdHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockCaseData[0]),
        }));
        
        const { result } = renderHook(() => useGetCaseByIdHook("1"), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });
        
        expect(result.current.data).toEqual(mockCaseData[0]);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getCaseById?caseId=1`);
    });

    test("call useCreateCommentHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockCommentData[0]),
            ok: true,
        }));
        
        const { result } = renderHook(() => useCreateCommentHook(), { wrapper });

        act(() => { result.current.mutate(mockCommentData) });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });

        expect(result.current.data).toEqual(mockCommentData[0]);
        expect(global.fetch).toHaveBeenCalledWith(`/api/createComment`, {"body": JSON.stringify(mockCommentData), "headers": {"Content-Type": "application/json"}, "method": "post"});
    });

    test("call useGetDropdownOptionsHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockServiceLineData),
        }));
        
        const { result } = renderHook(() => useGetDropdownOptionsHook({
            queryKey: "getServiceLines",
            dependency: "scheduling.procedureUnit.procedureUnitId",
            paramString: "&procedureUnitId=1"
        }), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });
        
        expect(result.current.data).toEqual(mockServiceLineData);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getDropdownOptions?queryKey=getServiceLines&procedureUnitId=1`);
    });

    test("call useGetBookingSheetConfigHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockBookingSheetConfig),
        }));
        
        const { result } = renderHook(() => useGetBookingSheetConfigHook(), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });
        
        expect(result.current.data).toEqual(mockBookingSheetConfig);
        expect(global.fetch).toHaveBeenCalledWith(`/api/getBookingSheetConfig`);
    });

    test("call useDownloadDocumentHook", async() => {
        global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve(mockSingleDocument),
        }));
        
        const { result } = renderHook(() => useDownloadDocumentHook("storagePath"), { wrapper });

        await waitFor(() => {
            expect(result.current.isSuccess).toEqual(true);
        });
        
        expect(result.current.data).toEqual(mockSingleDocument);
        expect(global.fetch).toHaveBeenCalledWith(`/api/downloadDocument?storagePath=storagePath`);
    });
});
