import React from 'react'
import Navbar from '../../components/layout/Navbar'
import {useHome} from "../../hooks/Hook"
import RecruiterJobs from './RecruiterJobs';
import RecruiterApplication from './RecruiterApplication';
import RecruiterInterviews from './RecruiterInterviews';
import Sidebar from '../../components/layout/Sidebar';
import RecruiterDashboard from './RecruiterDashboard';
import Settings from '../seeker/Settings';
import RecruiterProfile from './RecruiterProfile';
import RecruiterCompanies from './RecruiterCompanies';
import CandidateProfile from "./CandidateProfile"

export default function () {
    const {recruiterActivePage} = useHome();
     console.log("Current recruiter page:", recruiterActivePage);
  return (
    <div className='h-screen overflow-hidden flex'>
        <Sidebar/>
        <div className='flex-1 min-w-0 flex flex-col h-screen'>
            <Navbar/>

            <main className='flex-1 min-h-0 overflow-y-auto'>
                    {recruiterActivePage === "recruiter/dashboard" && <RecruiterDashboard/>}
                    {recruiterActivePage === "recruiter/jobs" && <RecruiterJobs/>}
                    {recruiterActivePage === "recruiter/application" && <RecruiterApplication/>}
                    {recruiterActivePage === "recruiter/interviews" && <RecruiterInterviews/>}
                    {recruiterActivePage === "recruiter/settings" && <Settings/>}
                    {recruiterActivePage === "recruiter/profile" && <RecruiterProfile/>}
                    {recruiterActivePage === "recruiter/company" && <RecruiterCompanies/>}
                    {recruiterActivePage === "/recruiter/candidate/profile" && <CandidateProfile/>}
            </main>
        </div>
    </div>
  )
}
