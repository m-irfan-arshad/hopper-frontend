import { useQuery } from '@tanstack/react-query'
import moment from "moment";

export function useGetCasesHook(dateFilterValue: string, dateSortValue: string) {
    return useQuery(["getCases", dateFilterValue, dateSortValue], () => fetchCases(dateFilterValue, dateSortValue))
}

const fetchCases = async (dateFilterValue: string, dateSortValue: string) => {
    const url =  calculateDashboardURL(dateFilterValue, dateSortValue);
    const response = await fetch(url);
    
    return response.json();
};

// <----- helpers ------>

function translateSortOrder(dateSortValue: string) {
    return dateSortValue === 'Oldest - Newest' ? 'asc' : 'desc'; 
}

function calculateDashboardURL(dateFilterValue: string, dateSortValue: string) {
    let parameters;
    if (dateFilterValue === 'This month') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().toString(),
            dateRangeEnd: moment().utc().endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue)
        });
    } else if (dateFilterValue === 'Next month') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().add(1, 'month').startOf('month').toString(),
            dateRangeEnd: moment().utc().add(1, 'month').endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue)
        });
    }
    else if (dateFilterValue === 'Next quarter') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().toString(),
            dateRangeEnd:  moment().utc().add(2, 'month').endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue)
        });
    }
    const url =  `/api/getCases?` + parameters;
    return url;
}