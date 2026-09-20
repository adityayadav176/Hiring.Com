import React, { useEffect } from 'react'
import {
  ChevronDown,
  Menu,
  BellIcon,
  CircleQuestionMark
} from 'lucide-react'

import { useAuth, useHome, useTitle } from '../../hooks/Hook'

function Navbar() {
  const { user, admin, recruiter } = useAuth()
  const { title, setTitle } = useTitle()
  const { setActivePage } = useHome()
  const currentAccount = admin || admin || recruiter

  return (
    <nav className="flex min-w-full items-center justify-between bg-white px-10 py-2">
      
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <Menu className="md:hidden" />

        <p className="text-sm text-gray-600">
          Workspace
        </p>

        <p className="text-sm text-gray-600">
          /
        </p>

        <p className="text-sm font-medium text-gray-950">
          {title}
        </p>
      </div>


      {/* Right Side */}
      <div className="flex items-center justify-center gap-2">

        <div className="flex gap-3">

          {/* Notification */}
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50"
          >
            <BellIcon className="h-5 w-5" />
          </button>

          {/* Help */}
          <button
            type="button"
            className="rounded-xl border border-gray-300 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50"
          >
            <CircleQuestionMark className="h-5 w-5" />
          </button>

        </div>


        {/* Profile */}
        <button
          type="button"
          onClick={() => {
            setActivePage("profile")
            setTitle("My Profile")
          }}
          className="
            hidden md:flex
            w-[12rem]
            items-center
            gap-3
            rounded-xl
            p-2.5
            text-left
            cursor-pointer
            transition-all
            duration-200
            hover:bg-slate-50
          "
        >

          {/* Avatar */}
          <div className="
            flex h-9 w-9 shrink-0
            items-center justify-center
            overflow-hidden rounded-full
            bg-violet-100
            text-sm font-semibold
            text-violet-700
          ">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user?.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              currentAccount?.name?.charAt(0)?.toUpperCase()
            )}
          </div>


          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">
              {currentAccount?.name}
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              {currentAccount?.role || currentAccount?.type}
            </p>
          </div>


          {/* Dropdown */}
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />

        </button>

      </div>

    </nav>
  )
}

export default Navbar