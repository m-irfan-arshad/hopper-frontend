import { useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment, { isMoment } from "moment";
import {AlertContext} from "../pages/_app.page"

export function useGetCasesHook(
    dateRangeStart: moment.Moment, 
    dateRangeEnd: moment.Moment | null, 
    searchBarValue: string, 
    page: string,
    workQueue: string
) {
    const [_, setAlertState] = useContext(AlertContext);
    return useQuery(
        ["getCases", dateRangeStart, dateRangeEnd, searchBarValue, page, workQueue], 
        () => fetchCases(dateRangeStart, dateRangeEnd as moment.Moment, searchBarValue, page, workQueue).then(res => {
            if (res.ok) {
              return res.json()
            }      
            throw new Error()
          }),
        {
            onError: () => {
                setAlertState({open: true, title: "Error Fetching Cases", status: "error"})
            },
            enabled: isMoment(dateRangeStart) && isMoment(dateRangeEnd),
        }
    )  
}

export function useCreateCaseHook() {
    const queryClient = useQueryClient()
    const [_, setAlertState] = useContext(AlertContext);
    return useMutation((data: object) => fetch("/api/createCase",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
              return res.json()
            }      
            throw new Error()
          }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['getCases'])
                setAlertState({open: true, title: "Successfully Created Case", status: "success"})
            },
            onError: () => {
                setAlertState({open: true, title: "Error Creating Case", status: "error"})
            }
        }
    )
}

export function useUpdateCaseHook() {
    const queryClient = useQueryClient()
    const [_, setAlertState] = useContext(AlertContext);
    return useMutation((data: object) => fetch("/api/updateCase",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
              return res.json()
            }      
            throw new Error()
          }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['getCases'])
                queryClient.invalidateQueries(['getCaseById'])
                setAlertState({open: true, title: "Successfully Updated Case", status: "success"})
            },
            onError: () => {
                setAlertState({open: true, title: "Error Updating Case", status: "error"})
            }
        }
    )
}

export function useCreateCommentHook() {
    const queryClient = useQueryClient();
    return useMutation((data: object) => fetch("/api/createComment",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
              return res.json()
            }      
            throw new Error()
          }),
          {
            onSuccess: () => {
                queryClient.invalidateQueries(['getCaseById'])
            }
        }
    )
}

export function useGetCaseByIdHook(caseId: string) {
    return useQuery(["getCaseById", caseId], async () =>  
        (await fetch(`/api/getCaseById?caseId=${caseId}`)).json(), { enabled: caseId !== undefined }
    );
}

const fetchCases = async (dateRangeStart: moment.Moment, dateRangeEnd: moment.Moment, searchBarValue: string, page: string, workQueue: string) => {
    const url = calculateDashboardURL(dateRangeStart, dateRangeEnd, searchBarValue, page, workQueue);
    return fetch(url)
};

// <----- helpers ------>


function calculateDashboardURL(dateRangeStart: moment.Moment, dateRangeEnd: moment.Moment, searchBarValue: string, page: string, workQueue: string) {
    let parameters;

    parameters = new URLSearchParams({ 
        dateRangeStart: dateRangeStart.format(),
        dateRangeEnd:  dateRangeEnd.format(),
        page: page,
        ...(workQueue !== "") && {workQueue: workQueue},
        ...(searchBarValue !== "") && {searchValue: searchBarValue},
    });

    const url =  `/api/getCases?` + parameters;
    return url;
}

interface CaseFieldHookProps {
    queryKey: string,
    paramString: string,
    dependency: any
}

export function useGetDropdownOptionsHook(props: CaseFieldHookProps) {
    const {queryKey, paramString, dependency} = props
    return useQuery([queryKey, dependency], async () => (await fetch(`/api/getDropdownOptions?queryKey=${queryKey}${paramString}`)).json());
}

export function useGetBookingSheetConfigHook() {
    return useQuery(["bookingSheetConfig"], async () => (await fetch(`/api/getBookingSheetConfig`)).json());
}

export function useCreateDocumentHook() {
    const queryClient = useQueryClient()
    const [_, setAlertState] = useContext(AlertContext);
    return useMutation((data: object) => fetch("/api/createDocument",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
              return res.json()
            }      
            throw new Error()
          }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['getCaseById'])
                setAlertState({open: true, title: "Document Uploaded", status: "success"})
            },
            onError: () => {
                setAlertState({open: true, title: "Error Uploading Document", status: "error"})
            }
        }
    )
}

export function useDownloadDocumentHook(storagePath: string) {
    return useQuery([storagePath], async () => (await fetch(`/api/downloadDocument?storagePath=${storagePath}`)).json(), { enabled: false });
}