import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/recruiter/Companies'
import CompanyCreate from './components/recruiter/CompanyCreate'
import CompanySetup from './components/recruiter/CompanySetup'
import AdminJobs from './components/recruiter/AdminJobs'
import PostJob from './components/recruiter/PostJob'
import EditJob from './components/recruiter/EditJob'
import Applicants from './components/recruiter/Applicants'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsAndConditions from './components/TermsAndConditions'
import ContactUs from './components/ContactUs'
import HelpCenter from './components/HelpCenter'
import FAQs from './components/FAQs'
import ScrollToTop from './components/shared/ScrollToTop'


const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<><ScrollToTop /><Home/></>
  },
  {
    path:'/login',
    element:<><ScrollToTop /><Login/></>
  },
  {
    path:'/signup',
    element:<><ScrollToTop /><Signup/></>
  },
  {
    path:'/jobs',
    element:<><ScrollToTop /><Jobs/></>
  },
  {
    path:'/description/:id',
    element:<><ScrollToTop /><JobDescription/></>
  },
  {
    path:'/browse',
    element:<><ScrollToTop /><Browse/></>
  },
  {
    path:'/profile',
    element:<><ScrollToTop /><Profile/></>
  },
  {
    path:'/privacy',
    element:<><ScrollToTop /><PrivacyPolicy/></>
  },
  {
    path:'/terms',
    element:<><ScrollToTop /><TermsAndConditions/></>
  },
  {
    path:'/contact',
    element:<><ScrollToTop /><ContactUs/></>
  },
  {
    path:'/help',
    element:<><ScrollToTop /><HelpCenter/></>
  },
  {
    path:'/faqs',
    element:<><ScrollToTop /><FAQs/></>
  },
  //recruiter
  {
    path : '/admin/companies',
    element : <><ScrollToTop /><Companies/></>
  },
  {
    path : '/admin/companies/create',
    element : <><ScrollToTop /><CompanyCreate/></>
  },
  {
    path : '/admin/companies/:id',
    element : <><ScrollToTop /><CompanySetup/></>
  },
  {
    path : '/admin/jobs',
    element : <><ScrollToTop /><AdminJobs/></>
  },
  {
    path : '/admin/jobs/create',
    element : <><ScrollToTop /><PostJob/></>
  },
  {
    path : '/admin/jobs/:id',
    element : <><ScrollToTop /><EditJob/></>
  },
  {
    path : '/admin/jobs/:id/applicants',
    element : <><ScrollToTop /><Applicants/></>
  },

])
function App() {

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App
