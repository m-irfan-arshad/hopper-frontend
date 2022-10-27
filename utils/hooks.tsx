import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment from "moment";

export function useGetCasesHook(dateFilterValue: string, dateSortValue: string, caseFilterValue: string, searchBarValue: string) {
    return useQuery(["getCases", dateFilterValue, dateSortValue, caseFilterValue, searchBarValue], () => fetchCases(dateFilterValue, dateSortValue, caseFilterValue, searchBarValue))
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

const fetchCases = async (dateFilterValue: string, dateSortValue: string, caseFilterValue: string, searchBarValue: string) => {
    const url =  calculateDashboardURL(dateFilterValue, dateSortValue, caseFilterValue, searchBarValue);
    const response = await fetch(url);
    
    return response.json();
};

// <----- helpers ------>

function translateSortOrder(dateSortValue: string) {
    return dateSortValue === 'Oldest - Newest' ? 'asc' : 'desc'; 
}

function calculateDashboardURL(dateFilterValue: string, dateSortValue: string, caseFilterValue: string, searchBarValue: string) {
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
        dateRangeStart: dateRangeStart.toString(),
        dateRangeEnd:  dateRangeEnd.toString(),
        orderBy: translateSortOrder(dateSortValue),
        searchValue: searchBarValue,
        caseStepFilters: caseFilterValue
    });

    const url =  `/api/getCases?` + parameters;
    
    return url;
}