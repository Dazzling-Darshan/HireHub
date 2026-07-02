import { setAllAppliedJobs } from '@/redux/jobSlice';
import { APPLICATION_API_ENDPOINT } from '@/utils/constant';
import { PAGE_LIMITS } from '@/utils/pagination';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAppliedJobs = (page = 1, limit = PAGE_LIMITS.appliedJobs) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, { 
                    withCredentials: true,
                    params: { page, limit },
                });
                if (res.data.success) {
                    dispatch(setAllAppliedJobs({
                        applications: res.data.applications,
                        pagination: res.data.pagination,
                    }));
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
            }
        };
        fetchAppliedJobs();
    }, [dispatch, page, limit]);
};

export default useGetAppliedJobs;
