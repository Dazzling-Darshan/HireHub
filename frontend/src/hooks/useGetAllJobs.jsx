import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_ENDPOINT } from '@/utils/constant'
import { PAGE_LIMITS } from '@/utils/pagination'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllJobs = (fetchAll = true, page = 1, limit = PAGE_LIMITS.jobs, keyword = "") => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const params = {};
                
                if (!fetchAll) {
                    params.page = page;
                    params.limit = limit;
                }
                
                if (keyword) {
                    params.keyword = keyword;
                }
                
                const res = await axios.get(`${JOB_API_ENDPOINT}/get`, { 
                    withCredentials: true,
                    params
                });
                if (res.data.success) {
                    dispatch(setAllJobs({
                        jobs: res.data.jobs,
                        pagination: res.data.pagination
                    }));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [dispatch, page, limit, keyword, fetchAll])
}

export default useGetAllJobs