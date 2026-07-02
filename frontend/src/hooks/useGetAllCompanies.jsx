import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_ENDPOINT } from '@/utils/constant'
import { PAGE_LIMITS } from '@/utils/pagination'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = (page = 1, limit = PAGE_LIMITS.table, keyword = "", fetchAll = false) => {
    const dispatch = useDispatch();
  useEffect(()=>{
    const fetchAllCompany = async () => {
         try {
            const res = await axios.get(`${COMPANY_API_ENDPOINT}/get/`, {
                withCredentials: true,
                params: fetchAll
                    ? { ...(keyword && { keyword }) }
                    : { page, limit, ...(keyword && { keyword }) },
            });
            if(res.data.success){
                dispatch(setCompanies({
                    companies: res.data.companies,
                    ...(res.data.pagination && { pagination: res.data.pagination }),
                }));
            }
         } catch (error) {
            console.log(error);
         }
    }
    fetchAllCompany();
  }, [dispatch, page, limit, keyword, fetchAll])
}

export default useGetAllCompanies
