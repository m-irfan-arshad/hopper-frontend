import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment from "moment";
import { caseFilterInterface } from "../reference";

export function useGetCasesHook(
    dateRangeStart: moment.Moment, 
    dateRangeEnd: moment.Moment | null, 
    dateSortValue: string, 
    caseFilter: caseFilterInterface[], 
    searchBarValue: string, 
    page: string
    ) {
        return useQuery(["getCases", dateRangeEnd, dateSortValue, caseFilter, searchBarValue, page], () => fetchCases(dateRangeStart, dateRangeEnd as moment.Moment, dateSortValue, caseFilter, searchBarValue, page), {enabled: dateRangeEnd !== null})
}

export function useCreateCaseHook() {
    const queryClient = useQueryClient()
    return useMutation((data: object) => fetch("/api/createCase",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['getCases'])
            },
            onError: () => {
                alert("there was an error")
            },
        }
    )
}

export function useUpdateCaseHook() {
    const queryClient = useQueryClient()
    return useMutation((data: object) => fetch("/api/updateCase",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['getCases'])
            },
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

const fetchCases = async (dateRangeStart: moment.Moment, dateRangeEnd: moment.Moment, dateSortValue: string, caseFilter: caseFilterInterface[], searchBarValue: string, page: string) => {
    const url = calculateDashboardURL(dateRangeStart, dateRangeEnd, dateSortValue, caseFilter, searchBarValue, page);
    const response = await fetch(url);
    
    return response.json();
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