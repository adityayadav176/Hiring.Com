import React, { useEffect } from 'react'
import { ArrowUpRightSquareIcon, BriefcaseIcon, CircleCheck, Code, Edit3, GraduationCap, MapPin, Percent, Building2, PlusIcon } from 'lucide-react';
import {useAuth, useProfile} from "../../hooks/Hook"


function ProfileDashboard() {
    
    const {profile, profileCompletion, handleGetMyProfile, handleProfileCompletion} = useProfile();
    const {user} = useAuth()
    console.log("Hello");
    console.log(profile);
    console.log(profileCompletion);
    console.log(user);
    console.log("Avatar:", user?.avatar);
console.log("Avatar type:", typeof user?.avatar);

    useEffect(() => {
  const fetchProfileData = async () => {
    await handleGetMyProfile();
    await handleProfileCompletion();
  };

  fetchProfileData();
}, []);
    
  return (
     <section className='flex items-center justify-center w-auto h-auto gap-5 m-8 flex-col'>
        <div className='md:w-full flex items-center  bg-white p-7 rounded-2xl shadow shadow-gray-300 justify-between'>
            <div className='flex gap-4'>
                <div className="w-20 h-20 rounded-2xl bg-violet-600 flex items-center justify-center overflow-hidden">
  {user?.avatar ? (
    <img
      src={user?.avatar?.url}
      alt={user?.name || "User"}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-2xl font-extrabold text-white">
      {user?.name?.charAt(0)?.toUpperCase() || "A"}
    </span>
  )}
</div>
                <div className='m-2'>
                    <h1 className='font-bold text-2xl'>{user?.name || "Alex"}</h1>
                    <h2 className='text-violet-600 font-medium'>{profile?.headline}</h2>

                    <div className='flex text-gray-700 font-medium text-sm'>
                        <MapPin/>
                        <p>{profile?.location?.city}, {profile?.location?.state}, {profile?.location?.country}</p>
                    </div>
                </div>
            </div>
            <div>
                <button className='flex bg-violet-700 p-2  rounded-xl gap-3 text-white'>
                    <Edit3/>
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>

       <div className="w-full h-auto bg-white p-5 rounded-2xl shadow shadow-gray-300">

  <div className="flex justify-between items-center">

    <div className="flex items-center gap-2">
      <CircleCheck
        size={18}
        className="text-violet-600"
      />

      <span className="font-bold text-gray-900">
        Profile Completion
      </span>
    </div>

    <span className="font-bold text-violet-600">
      {profileCompletion?.score ?? 0}%
    </span>

  </div>

  <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
  <div
    className="h-full bg-violet-600 rounded-full"
    style={{
      width: `${profileCompletion?.score ?? 0}%`,
    }}
  />
</div>


  <p className="text-xs text-gray-500 mt-3">
  Complete your{" "}
  {profileCompletion?.missingFields?.length
    ? profileCompletion.missingFields.join(", ")
    : "experience"}{" "}
  section to reach 100%.
</p>

</div>
        
        <div className='w-full bg-white p-5 h-auto gap-3 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex gap-2'>
                <BriefcaseIcon className='text-violet-600'/>
                <p className='font-bold text-gray-900'>Job Preferences</p>
            </div>
           {profile?.preferences?.lookingForJob === true ? (
  <div className="bg-green-100 border w-50 flex items-center justify-center border-green-500 text-green-800 p-2 rounded-xl gap-3 font-medium text-sm">
    <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
    <p>Actively looking for jobs</p>
  </div>
) : (
  <div className="bg-red-100 border w-50 flex items-center justify-center border-red-500 text-red-800 p-2 rounded-xl gap-3 font-medium text-sm">
    <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
    <p>Not looking for jobs</p>
  </div>
)}
            
            <span className='text-gray-400 font-medium text-xs'>JOB TYPES</span>
            <div className='flex gap-3'>    
            {profile?.preferences?.preferredJobType?.length > 0 ? (profile.preferences.preferredJobType.map((item) => (<div key={item} className='text-gray-600 bg-gray-100 border border-gray-300 px-3 py-1 rounded-xl text-sm flex items-center justify-center capitalize'>{item}</div>))) : (<div className='text-gray-400 text-sm'>No Job Type Selected</div>)}
            </div>
            <span className='text-gray-400 font-medium text-xs'>EXPECTED SALARY</span>
            {profile?.preferences?.expectedSalary?.currency && <div className='w-30 border rounded-xl border-gray-400 font-bold p-2 flex items-center bg-slate-100'>{`Based in ${profile?.preferences?.expectedSalary?.currency}`}</div>}
        </div>

             <div className="w-full bg-white h-auto p-5 rounded-2xl shadow shadow-gray-300">

  <div className="flex justify-between items-center">

    <div className="flex items-center">
      <span className="font-bold text-gray-900 mb-2">
       About
      </span>
    </div>
  </div>


  <p className="text-xs text-gray-500 mt-3">
    {profile?.bio || <span className="text-gray-400 text-sm">
                            No About
                        </span>}
  </p>

</div>
        <div className="w-full bg-white p-5 h-auto rounded-2xl shadow shadow-gray-300">
  <div className="flex justify-between mb-5">
    <div className="font-bold text-gray-900 flex gap-3">
      <Code className="text-violet-600" />
      <span>Skills</span>
    </div>

    <button className="font-medium text-violet-600 cursor-pointer hover:underline">
      Add Skill
    </button>
  </div>

  <div className="flex flex-wrap gap-3">
    {profile?.skills?.length > 0 ? (
      profile.skills.map((item) => (
        <div
          key={item?._id}
          className="flex p-2 font-medium gap-2 bg-slate-100 rounded-xl"
        >
          <p>{item?.name}</p>

          <p className="text-violet-800 bg-violet-200 rounded-xl px-2 py-1 text-xs capitalize">
            {item?.level}
          </p>
        </div>
      ))
    ) : (
      <span className="text-gray-400 text-sm">
        No skills added
      </span>
    )}
  </div>
</div>
            

        <div className='w-full bg-white p-5 h-auto gap-5 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex justify-between'>
                <div className='font-bold text-gray-900 flex gap-3'>
                <Code className='text-violet-600'/>
                <span>Projects</span>
                </div>
                <button className='font-medium text-violet-600 cursor-pointer hover:underline'>
                    Add Project
                </button>
            </div>

    {profile?.projects?.length > 0 ? (
    profile.projects.map((item) => (
        <div key={item?._id} className="w-full bg-white h-auto p-5 rounded-2xl hover:text-violet-700 shadow hover:shadow-gray-300 shadow-gray-100 border hover:border-violet-200 border-gray-200">
            <div className="flex justify-between">
                <span className="font-bold text-xl">
                    {item?.title || "Hiring Platform"}
                </span>

                <ArrowUpRightSquareIcon className="cursor-pointer text-slate-400 hover:text-slate-900" 
                onClick={() => window.open(item.githubUrl, "_blank", "noopener,noreferrer")}/>
            </div>

            <p className="text-slate-500 font-normal">
                {item?.description || "Microservice based hiring application"}
            </p>

            <div className="flex mt-4">
                <div className="flex flex-wrap gap-2">
                    {item?.technologies?.length > 0 ? (
                        item.technologies.map((technology) => (
                            <span
                                key={technology}
                                className="group relative cursor-pointer text-gray-700 bg-gray-100 border border-gray-300 px-3 py-1.5 rounded-xl text-sm flex items-center justify-center"
                            >
                                <span>{technology}</span>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">
                            No technologies added
                        </span>
                    )}
                </div>
            </div>
        </div>
    ))
) : (
    <div className="text-gray-400 text-sm">
        No projects added
    </div>
)} 
</div>

    
        <div className='w-full bg-white p-5 h-auto gap-2 rounded-2xl shadow shadow-gray-300 flex flex-col'>
            <div className='flex justify-between p-3'>
                <div className='flex gap-2 font-bold text-gray-900'>
                <GraduationCap className='text-violet-600'/>
                <span>Education</span>
                </div>
                <button className='font-medium text-violet-600 cursor-pointer hover:underline'> 
                    Add Education
                </button>
            </div>

            {
                profile?.education?.length > 0 ? profile.education.map((item) => <div key={item._id} className='md:w-full bg-gray-100 flex items-center gap-4 h-auto p-5 rounded-2xl'>
                    <div className='flex text-violet-600 p-2 w-12 h-12  rounded-xl items-center justify-center  bg-white shadow shadow-gray-500 border border-slate-50'>
                        <Building2/>
                    </div>
                    <div>
                    <span className='font-bold'>{item.institute}</span>
                    <p className='font-medium text-sm'>{`${item.degree} In ${item.field}`}</p>
                    <p className='text-gray-500 text-xs mt-2'>{`${item.startYear} - ${item.endYear}`}</p>
                    </div>
                </div> 
                ) : (
                     <span className="text-gray-400 text-sm">
                            No education added
                        </span>
                )
            }

        </div>

        

<div className="w-full bg-white p-5 h-auto gap-5 rounded-2xl shadow shadow-gray-300 flex flex-col">

    {/* Header */}
    <div className="flex gap-2 font-bold text-gray-900">
        <BriefcaseIcon className="text-violet-600" />
        <span>Experience</span>
    </div>

    {/* Ternary */}
    {profile?.experience?.length > 0 ? (

        /* Experience exists */
        profile.experience.map((item, index) => (
            <div
                key={item?._id || index}
                className="w-full bg-gray-100 flex gap-4 p-5 rounded-2xl"
            >

                {/* Icon */}
                <div className="flex-shrink-0 flex text-violet-600 p-2 w-12 h-12 rounded-xl items-center justify-center bg-white shadow shadow-gray-300 border border-slate-50">
                    <BriefcaseIcon />
                </div>

                {/* Experience Details */}
                <div className="flex flex-col gap-1">

                    <span className="font-bold text-lg">
                        {item?.position}
                    </span>

                    <span className="font-medium text-gray-700">
                        {item?.company}
                    </span>

                    <span className="text-sm text-violet-600 capitalize">
                        {item?.employmentType?.type}
                    </span>

                    <p className="text-gray-500 text-xs mt-2">
                        {item?.startDate
                            ? new Date(item.startDate).toLocaleDateString("en-IN", {
                                month: "short",
                                year: "numeric",
                            })
                            : "Start date"
                        }

                        {" - "}

                        {item?.currentlyWorking
                            ? "Present"
                            : item?.endDate
                                ? new Date(item.endDate).toLocaleDateString("en-IN", {
                                    month: "short",
                                    year: "numeric",
                                })
                                : "End date"
                        }
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                        {item?.description}
                    </p>

                </div>
            </div>
        ))

    ) : (

        /* No Experience */
        <div className="inset-0 rounded-2xl border-2 border-dashed border-gray-200 w-full bg-white h-auto gap-5 shadow shadow-gray-300 flex flex-col">

            <div className="flex flex-wrap bg-gray-100 flex-col gap-3 items-center justify-center p-5">

                <div className="rounded-full p-3 text-gray-400 bg-gray-200">
                    <BriefcaseIcon />
                </div>

                <span className="font-bold text-sm">
                    No experience added
                </span>

                <p className="text-xs m-2 text-gray-400 text-center">
                    Add your previous work experience to increase your chances of being noticed.
                </p>

                <button className="p-2 pl-3 pr-3 rounded-xl text-violet-600 font-medium text-sm bg-violet-200 flex">
                    <span>+ Add Experience</span>
                </button>

            </div>

        </div>
    )}

</div>        
    </section>
  )
}

export default ProfileDashboard
