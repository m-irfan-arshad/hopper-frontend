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

export function useGetProvidersHook(serviceLineId: number) {
    return useQuery(["getProviders", serviceLineId], async () =>  
        (await fetch(`/api/getProviders?serviceLineId=${serviceLineId}`)).json(), { enabled: serviceLineId > 0 }
    );
}

export function useGetProcedureUnitsHook(locationId: number) {
    return useQuery(["getProcedureUnits", locationId], async () =>  
        (await fetch(`/api/getProcedureUnits?locationId=${locationId}`)).json(), { enabled: locationId > 0 }
    );
}

export function useGetServiceLinesHook(procedureUnitId: number) {
    return useQuery(["getServiceLines", procedureUnitId], async () =>  
        (await fetch(`/api/getServiceLines?procedureUnitId=${procedureUnitId}`)).json(), { enabled: procedureUnitId > 0 }
    );
}

export function useGetLocationsHook() {
    return useQuery(["getLocations"], async () => (await fetch("/api/getLocations")).json());
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