import { createSlice } from "@reduxjs/toolkit";
import { emptyPagination, PAGE_LIMITS } from "@/utils/pagination";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singleJob: null,
        allAdminJobs: [],
        allAppliedJobs: [],
        searchJobByText: "",
        searchedQuery: "",
        savedJobs: [],
        adminJobsPagination: emptyPagination(PAGE_LIMITS.table),
        appliedJobsPagination: emptyPagination(PAGE_LIMITS.table),
        allJobsPagination: emptyPagination(PAGE_LIMITS.jobs),
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload.jobs ?? action.payload;
            if (action.payload.pagination) {
                state.allJobsPagination = action.payload.pagination;
            }
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload.jobs ?? action.payload;
            state.adminJobsPagination = action.payload.pagination || emptyPagination(PAGE_LIMITS.table);
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload.applications ?? action.payload;
            state.appliedJobsPagination = action.payload.pagination || emptyPagination(PAGE_LIMITS.table);
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        toggleSaveJob: (state, action) => {
            // Guard: ensure savedJobs is always an array (protection against bad rehydration)
            if (!Array.isArray(state.savedJobs)) {
                state.savedJobs = [];
            }
            const job = action.payload;
            const existsIndex = state.savedJobs.findIndex(j => j._id === job._id);
            if (existsIndex !== -1) {
                state.savedJobs.splice(existsIndex, 1);
            } else {
                // Store a plain copy to avoid Immer proxy issues
                state.savedJobs.push(JSON.parse(JSON.stringify(job)));
            }
        },
    },
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setAllAppliedJobs,
    setSearchJobByText,
    setSearchedQuery,
    toggleSaveJob,
} = jobSlice.actions;

export default jobSlice.reducer;