import { createSlice } from "@reduxjs/toolkit";
import { emptyPagination, PAGE_LIMITS } from "@/utils/pagination";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applicants: null,
        applicantStats: { total: 0, accepted: 0, rejected: 0, pending: 0 },
        applicantsPagination: emptyPagination(PAGE_LIMITS.table),
    },
    reducers: {
        setApplicants: (state, action) => {
            state.applicants = action.payload.job ?? action.payload;
            if (action.payload.stats) {
                state.applicantStats = action.payload.stats;
            }
            state.applicantsPagination = action.payload.pagination || emptyPagination(PAGE_LIMITS.table);
        },
        updateApplicantStatus: (state, action) => {
            const { id, status } = action.payload;
            if (state.applicants && state.applicants.applications) {
                state.applicants.applications = state.applicants.applications.map((app) => 
                    app._id === id ? { ...app, status } : app
                );
            }
        }
    }
});

export const { setApplicants, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
