import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import moment from "moment";

export function useGetCasesHook(dateFilterValue: string, dateSortValue: string, searchBarValue: string, paginationPage: string) {
    return useQuery(["getCases", dateFilterValue, dateSortValue, searchBarValue, paginationPage], () => fetchCases(dateFilterValue, dateSortValue, searchBarValue, paginationPage))
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

const fetchCases = async (dateFilterValue: string, dateSortValue: string, searchBarValue: string, paginationPage: string) => {
    const url = calculateDashboardURL(dateFilterValue, dateSortValue, searchBarValue, paginationPage);
    const response = await fetch(url);
    
    return response.json();
};

// <----- helpers ------>

function translateSortOrder(dateSortValue: string) {
    return dateSortValue === 'Oldest - Newest' ? 'asc' : 'desc'; 
}

function calculateDashboardURL(dateFilterValue: string, dateSortValue: string, searchBarValue: string, paginationPage: string) {
    let parameters;
    if (dateFilterValue === 'This month') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().toString(),
            dateRangeEnd: moment().utc().endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue),
            searchValue: searchBarValue,
            paginationPage: paginationPage
        });
    } else if (dateFilterValue === 'Next month') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().add(1, 'month').startOf('month').toString(),
            dateRangeEnd: moment().utc().add(1, 'month').endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue),
            searchValue: searchBarValue,
            paginationPage: paginationPage
        });
    }
    else if (dateFilterValue === 'Next quarter') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().toString(),
            dateRangeEnd:  moment().utc().add(2, 'month').endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue),
            searchValue: searchBarValue,
            paginationPage: paginationPage
        });
    }
    const url =  `/api/getCases?` + parameters;
    
    return url;
}