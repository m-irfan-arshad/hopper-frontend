import { useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment from "moment";
import { caseFilterInterface } from "../reference";
import {AlertContext} from "../pages/_app"

export function useGetCasesHook(dateFilterValue: string, dateSortValue: string, caseFilter: caseFilterInterface[], searchBarValue: string, page: string) {
    const [_, setAlertState] = useContext(AlertContext);
    return useQuery(
        ["getCases", dateFilterValue, dateSortValue, caseFilter, searchBarValue, page], 
        () => fetchCases(dateFilterValue, dateSortValue, caseFilter, searchBarValue, page).then(res => {
            if (res.ok) {
              return res.json()
            }      
            throw new Error()
          }),
        {
            onError: () => {
                setAlertState({open: true, title: "Error Fetching Cases", status: "error"})
            }
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
            },
            onError: () => {
                setAlertState({open: true, title: "Error Updating Case", status: "error"})
            }
        }
    )
}

export function useGetProviderOptionsHook() {
    return useQuery(["getProviderOptions"], async () => (await fetch("/api/getProviderOptions")).json());
}

export function useGetLocationOptionsHook(providerId: number) {
    return useQuery(["getLocationOptions", providerId], async () =>  
        (await fetch(`/api/getLocationOptions?providerId=${providerId}`)).json()
    );
}

const fetchCases = async (dateFilterValue: string, dateSortValue: string, caseFilter: caseFilterInterface[], searchBarValue: string, page: string) => {
    const url = calculateDashboardURL(dateFilterValue, dateSortValue, caseFilter, searchBarValue, page);
    return fetch(url)
};

// <----- helpers ------>

function translateSortOrder(dateSortValue: string) {
    return dateSortValue === 'Oldest - Newest' ? 'asc' : 'desc'; 
}

export function convertCaseStepsToFilters(caseFilter: caseFilterInterface[]): object {
    let returnObject: any = {};
    caseFilter.filter(filterObj => filterObj.id !== "all").forEach(filterObj => (returnObject[filterObj.id] = "Incomplete"))
    return returnObject
}

function calculateDashboardURL(dateFilterValue: string, dateSortValue: string, caseFilter: caseFilterInterface[], searchBarValue: string, page: string) {
    let parameters;
    let dateRangeStart = moment().utc()
    let dateRangeEnd = moment().utc()
    switch(dateFilterValue) {
        case 'This month':
            dateRangeEnd = dateRangeEnd.endOf('month')
            break;
        case 'Next month':
            dateRangeStart = dateRangeStart.add(1, 'month').startOf('month')
            dateRangeEnd = dateRangeEnd.add(1, 'month').endOf('month')
            break;
        case 'Next quarter':
            dateRangeEnd = dateRangeEnd.add(2, 'month').endOf('month')
            break;
    }

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