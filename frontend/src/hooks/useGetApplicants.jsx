import { setApplicants } from '@/redux/applicationSlice';
import { APPLICATION_API_ENDPOINT } from '@/utils/constant';
import { PAGE_LIMITS } from '@/utils/pagination';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetApplicants = (id, page = 1, limit = PAGE_LIMITS.table) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                if (!id) return;
                const res = await axios.get(`${APPLICATION_API_ENDPOINT}/${id}/applicants`, { 
                    withCredentials: true,
                    params: { page, limit },
                });
                if (res.data.success) {
                    dispatch(setApplicants({
                        job: res.data.job,
                        stats: res.data.stats,
                        pagination: res.data.pagination,
                    }));
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };
        fetchApplicants();
    }, [dispatch, id, page, limit]);
};

export default useGetApplicants;
