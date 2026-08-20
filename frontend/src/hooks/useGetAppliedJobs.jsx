import { setAllAppliedJobs } from '@/redux/jobSlice';
import { APPLICATION_API_ENDPOINT } from '@/utils/constant';
import { PAGE_LIMITS } from '@/utils/pagination';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAppliedJobs = (page = 1, limit = PAGE_LIMITS.appliedJobs) => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        if (!user || user.role !== 'student') {
            dispatch(setAllAppliedJobs({ applications: [], pagination: null }));
            return;
        }

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
                if (error.response?.status === 401) {
                    dispatch(setAllAppliedJobs({ applications: [], pagination: null }));
                }
            }
        };
        fetchAppliedJobs();
    }, [dispatch, page, limit, user]);
};

export default useGetAppliedJobs;
