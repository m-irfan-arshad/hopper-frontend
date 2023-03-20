import { useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment, { isMoment } from "moment";
import { caseFilterInterface } from "../reference";
import {AlertContext} from "../pages/_app.page"

export function useGetCasesHook(
    dateRangeStart: moment.Moment, 
    dateRangeEnd: moment.Moment | null, 
    dateSortValue: string, 
    caseFilter: caseFilterInterface[], 
    searchBarValue: string, 
    page: string
) {
    const [_, setAlertState] = useContext(AlertContext);
    return useQuery(
        ["getCases", dateRangeStart, dateRangeEnd, dateSortValue, caseFilter, searchBarValue, page], 
        () => fetchCases(dateRangeStart, dateRangeEnd as moment.Moment, dateSortValue, caseFilter, searchBarValue, page).then(res => {
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

export function useGetCaseByIdHook(caseId: string) {
    return useQuery(["getCaseById", caseId], async () =>  
        (await fetch(`/api/getCaseById?caseId=${caseId}`)).json(), { enabled: caseId !== undefined }
    );
}

const fetchCases = async (dateRangeStart: moment.Moment, dateRangeEnd: moment.Moment, dateSortValue: string, caseFilter: caseFilterInterface[], searchBarValue: string, page: string) => {
    const url = calculateDashboardURL(dateRangeStart, dateRangeEnd, dateSortValue, caseFilter, searchBarValue, page);
    return fetch(url)
};

// <----- helpers ------>

function translateSortOrder(dateSortValue: string) {
    return dateSortValue === 'Oldest - Newest' ? 'desc' : 'asc'; 
}

export function convertCaseStepsToFilters(caseFilter: caseFilterInterface[]): object {
    let returnObject: any = {};
    caseFilter.filter(filterObj => filterObj.id !== "all").forEach(filterObj => (returnObject[filterObj.id] = "Incomplete"))
    return returnObject
}

function calculateDashboardURL(dateRangeStart: moment.Moment, dateRangeEnd: moment.Moment, dateSortValue: string, caseFilter: caseFilterInterface[], searchBarValue: string, page: string) {
    let parameters;

    parameters = new URLSearchParams({ 
        dateRangeStart: dateRangeStart.format(),
        dateRangeEnd:  dateRangeEnd.format(),
        orderBy: translateSortOrder(dateSortValue),
        page: page,
        ...(searchBarValue !== "") && {searchValue: searchBarValue},
        ...convertCaseStepsToFilters(caseFilter)
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