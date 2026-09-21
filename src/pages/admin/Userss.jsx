  import { Ban, CheckCircle, ChevronLeft, ChevronRight, Eye, MoreVertical, Search, Trash2, UserCheck, UserX, Users, X } from 'lucide-react'
  import React, { useState } from 'react'

  function Userss() {
      const [showMenu, setShowMenu] = useState(false);
      const [selectedUser, setSelectedUser] = useState(false);
      const [user, setUsers] = useState([
         {
            _id: "USR001",
            name: "Rahul Sharma",
            email: "rahul.sharma@gmail.com",
            phoneNo: "9876543210",
            role: "user",
            status: "active",
            joined: "Sep 18, 2026",
        },
      ])
    return (
      <div className='w-full min-h-full bg-[#F7F8FC] p-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-slate-900 font-bold text-2xl'>Users</h1>
                <span className='bg-[#EEF0FF] text-[#5950E6] text-xs font-semibold px-2.5 py-1 rounded-full'>6</span> 
            </div>
            <p className='text-slate-500 text-sm mt-1 '>Manage all registered users on Peer.Hiring</p>
          </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
            <div className='bg-white border border-slate-200 rounded-2xl p-5'>
                <div className='flex items-center justify-between'> 
                    <div>
                      <p className='text-slate-500 text-sm'>Total Users</p>
                      <h2 className='mt-1 text-slate-900 font-bold text-2xl'>5</h2>
                      <p className='text-xs text-slate-400s mt-1'>Registered accounts</p>
                    </div>
                    <div className='flex items-center justify-center rounded-xl w-11 h-11 bg-[#EEF0FF]'>
                      <Users className='text-[#5950E6] w-5 h-5'/>
                    </div>
                </div>
            </div>
            <div className='bg-white border border-slate-200 rounded-2xl p-5'>
                <div className='flex items-center justify-between'> 
                    <div>
                      <p className='text-slate-500 text-sm'>Active Users</p>
                      <h2 className='mt-1 text-slate-900 font-bold text-2xl'>5</h2>
                      <p className='text-xs text-slate-400s mt-1 text-green-500'>Currently active</p>
                    </div>
                    <div className='flex items-center justify-center rounded-xl w-11 h-11 bg-green-50'>
                      <UserCheck className='w-5 h-5 text-green-600'/>
                    </div>
                </div>
            </div>
            <div className='bg-white border border-slate-200 rounded-2xl p-5'>
                <div className='flex items-center justify-between'> 
                    <div>
                      <p className='text-slate-500 text-sm'>Blocked Users</p>
                      <h2 className='mt-1 text-slate-900 font-bold text-2xl'>0</h2>
                      <p className='text-xs text-slate-400s mt-1 text-red-500'>Restricted accounts</p>
                    </div>
                    <div className='flex items-center justify-center rounded-xl w-11 h-11 bg-red-50'>
                      <UserX className='w-5 h-5 text-red-500'/>
                    </div>
                </div>
            </div>
          </div>

          <div className='bg-white border border-slate-200 rounded-2xl mt-6 p-4'>
            <div className='flex flex-col md:flex-row gap-3'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400'/>
                <input type="text" placeholder="Search by name, email or phone..." className='w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50  outline-none focus:bg-white focus:border-[#5950E6] transition'/>
              </div>
              <select className='h-11 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-600 outline-none focus:border-[#5950E6]'> 
                  <option value="All">All Users</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

            {/* table */}
          <div className='bg-white border border-slate-200 rounded-2xl mt-4 overflow-hidden'>
              <div className='px-6 py-4 border-b border-slate-200 flex items-center justify-between'>
                <div>
                  <h2 className='text-sm font-semibold text-slate-900'>All Users</h2>
                  <p className='text-xs text-slate-400 mt-1'>5 users found</p>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-slate-50'>
                    <tr>
                      <th className='text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide'>USER</th>
                      <th className='text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide'>EMAIL</th>
                      <th className='text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide'>ROLE</th>
                      <th className='text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide'>JOINED</th>
                      <th className='text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide'>STATUS</th>
                      <th className='text-left px-6 py-3.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide'>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-t border-slate-100 hover:bg-slate-50/70 transition'>
                        <td className='px-6 py-4'>
                              <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-xl bg-[#EEF0FF] text-[#5950E6] flex items-center justify-center text-xs font-bold shrink-0'>
                                      AY
                                </div>
                                <div className='min-w-0'>
                                  <p className='text-sm font-semibold text-slate-900 truncate'>Aditya</p>
                                </div>
                              </div>
                        </td>
                        <td className='px-6 py-4'>
                            <p className='text-sm text-slate-600'>priya.singh@gmail.com</p>
                            <p className='text-xs text-slate-400 mt-0.5'>9123456780</p>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex px-2.5 py-1 rounded-lg bg-violet-50 text-[#5950E6] text-xs font-medium'>user</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='text-sm text-slate-500'>Sep 17, 2026</span>
                        </td>
                        <td>
                          <span className='inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-lg'>
                            <span className='w-1.5 h-1.5 rounded-full bg-green-500'/>
                            Active
                          </span>
                        </td>



                        <td className="px-6 py-4">

                                        <div className="relative flex justify-end">

                                           <button
    type="button"
    onClick={() => setShowMenu(!showMenu)}
    className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
>
    <MoreVertical className="w-4 h-4 text-slate-500" />
</button>

{showMenu && (
    <div className="absolute right-0 top-10 z-30 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5">

        <button
            type="button"
            onClick={() => {
                setSelectedUser(true);
                setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
        >
            <Eye className="w-4 h-4" />
            View User
        </button>

        <button
            type="button"
            className="w-full flex text-orange-600 hover:bg-orange-50 items-center gap-2 px-3 py-2.5 text-sm rounded-lg"
        >
            <CheckCircle className="w-4 h-4" />
            Block User
        </button>

        <div className="h-px bg-slate-100 my-1" />

        <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
            <Trash2 className="w-4 h-4" />
            Delete User
        </button>

    </div>
)}

                                        </div>

                                    </td>



                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='px-6 py-4 border-t border-slate-200 flex items-center justify-between'>
                    <p className='text-xs text-slate-400'>
                      Showing{" "}
                      <span className='font-semibold text-slate-600'>1</span>{" "}
                      -{" "}
                      <span className='font-semibold text-slate-600'>8</span>{" "}
                      of{" "}
                      <span className='font-semibold text-slate-600'>8</span>
                    </p>

                    <div className='flex items-center gap-1'>
                      <button className='w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50'>
                        <ChevronLeft/>
                      </button>
                      <button className='w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-white bg-[#5950E6]'>
                        1
                      </button>
                      <button className='w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50'>
                          <ChevronRight/>
                      </button>
                    </div>
              </div>
          </div>
                  
          {selectedUser && (
            <div className='fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4'> 
                <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden'>
                      <div className='flex items-center justify-between px-6 py-5 border-b border-slate-200'>
                        <div>
                          <h2 className='font-bold text-slate-900 text-lg'>User Details</h2>
                          <p className='text-xs text-slate-400 mt-1'>User account information</p>
                        </div>
                        <button onClick={() => setSelectedUser(false)} className='text-slate-400 w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center'>
                          <X className='w-5 h-5 text-slate-500'/>
                        </button>
                      </div>

                      <div className='p-6'>
                          <div className='flex gap-4 items-center'>
                              <div className='w-16 h-16 rounded-2xl bg-[#EEF0FF] text-[#5950E6] flex items-center justify-center text-xl font-bold'>AM</div>
                              <div>
                                <h3 className='text-lg font-bold text-slate-900'>Arjun Mehta</h3>
                                <p className='text-sm text-slate-500 mt-0.5'>arjun.mehta@gmail.com</p>
                              </div>
                          </div>

                          <div className='grid grid-cols-2 gap-3 mt-6'>
                              <div className='bg-slate-50 rounded-xl p-4'>
                                    <p className='text-xs text-slate-400'>Role</p>
                                    <p className='text-sm font-semibold text-slate-800 mt-1'>user</p>
                              </div>
                              <div className='bg-slate-50 rounded-xl p-4'>
                                    <p className='text-xs text-slate-400'>Status</p>
                                    <p className='text-sm font-semibold text-slate-800 mt-1'>Active</p>
                              </div>
                              <div className='bg-slate-50 rounded-xl p-4'>
                                    <p className='text-xs text-slate-400'>Phone</p>
                                    <p className='text-sm font-semibold text-slate-800 mt-1'>9639761042</p>
                              </div>
                              <div className='bg-slate-50 rounded-xl p-4'>
                                    <p className='text-xs text-slate-400'>Joined</p>
                                    <p className='text-sm font-semibold text-slate-800 mt-1'>Sep 12, 2026</p>
                              </div>
                          </div>

                          <div className='mt-3 bg-slate-50 rounded-xl p-4'>
                              <p className='text-xs text-slate-400'>User ID</p>
                              <p className='text-sm font-semibold text-slate-800 mt-1'>USR005</p>
                          </div>
                      </div>
                </div>
            </div>
          )}
      </div>


    )
  }

  export default Userss
