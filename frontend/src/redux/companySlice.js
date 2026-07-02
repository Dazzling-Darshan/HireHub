import { createSlice } from "@reduxjs/toolkit";
import { emptyPagination, PAGE_LIMITS } from "@/utils/pagination";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [],
        searchCompanyByText : "",
        companiesPagination: emptyPagination(PAGE_LIMITS.table),
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload.companies ?? action.payload;
            state.companiesPagination = action.payload.pagination || emptyPagination(PAGE_LIMITS.table);
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
    },
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;