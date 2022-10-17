import { useQuery } from '@tanstack/react-query';
import moment from "moment";

export function useGetCasesHook(dateFilterValue: string, dateSortValue: string, searchBarValue: string) {
    return useQuery(["getCases", dateFilterValue, dateSortValue, searchBarValue], () => fetchCases(dateFilterValue, dateSortValue, searchBarValue))
}

const fetchCases = async (dateFilterValue: string, dateSortValue: string, searchBarValue: string) => {
    const url =  calculateDashboardURL(dateFilterValue, dateSortValue, searchBarValue);
    const response = await fetch(url);
    
    return response.json();
};

// <----- helpers ------>

function translateSortOrder(dateSortValue: string) {
    return dateSortValue === 'Oldest - Newest' ? 'asc' : 'desc'; 
}

function calculateDashboardURL(dateFilterValue: string, dateSortValue: string, searchBarValue: string) {
    console.log('dateFilterValue',dateFilterValue);
    console.log('dateSortValue',dateSortValue);
    console.log('searchBarValue',searchBarValue);

    let parameters;
    if (dateFilterValue === 'This month') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().toString(),
            dateRangeEnd: moment().utc().endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue),
            searchValue: searchBarValue
        });
    } else if (dateFilterValue === 'Next month') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().add(1, 'month').startOf('month').toString(),
            dateRangeEnd: moment().utc().add(1, 'month').endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue),
            searchValue: searchBarValue
        });
    }
    else if (dateFilterValue === 'Next quarter') {
        parameters = new URLSearchParams({ 
            dateRangeStart: moment().utc().toString(),
            dateRangeEnd:  moment().utc().add(2, 'month').endOf('month').toString(),
            orderBy: translateSortOrder(dateSortValue),
            searchValue: searchBarValue
        });
    }
    const url =  `/api/getCases?` + parameters;
    console.log('parameters',parameters);
    return url;
}