import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_ENDPOINT } from '@/utils/constant';
import { PAGE_LIMITS } from '@/utils/pagination';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
 
const useGetAllAdminJobs = (page = 1, limit = PAGE_LIMITS.table, keyword = "") => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_ENDPOINT}/get/adminjobs`, { 
                    withCredentials: true,
                    params: { page, limit, ...(keyword && { keyword }) },
                });
                
                if (res.data.success) {
                    dispatch(setAllAdminJobs({
                        jobs: res.data.jobs,
                        pagination: res.data.pagination,
                    }));
                }
            } catch (error) {
                console.error("Error fetching admin jobs:", error);
            }
        };
        fetchAllAdminJobs();
    }, [dispatch, user, page, limit, keyword]);
};

export default useGetAllAdminJobs;
