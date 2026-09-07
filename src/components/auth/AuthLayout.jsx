import React from "react";
import { Sparkles } from "lucide-react";
import peerLogo from "../../assests/peerLogo.png";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* Header */}
      <header className="h-[70px] sm:h-[80px] lg:h-[90px] px-5 sm:px-8 lg:px-10 flex items-center">
        <div className="flex items-center gap-2 sm:gap-3">
           <div className='w-5 h-5 sm:w-8 items-center shadow shadow-violet-800 justify-center flex sm:h-8 rounded-xl object-contain bg-violet-700'>
                <span className='font-extrabold text-[17px] text-white'>P</span>
            </div>

          <p className="text-lg sm:text-xl font-bold text-slate-950">
            Peer.Hiring
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="px-5 sm:px-8 lg:px-16 pb-10 lg:pb-0">

        <div
          className="
            min-h-[calc(100vh-70px)]
            sm:min-h-[calc(100vh-80px)]
            lg:min-h-[calc(100vh-90px)]

            flex
            flex-col
            lg:flex-row

            items-start
            lg:items-center

            justify-start
            lg:justify-between

            gap-10
            lg:gap-16
          "
        >

          {/* Hero Section */}
          <div className="w-full lg:w-[55%] pt-4 lg:pt-0">

            <div className="max-w-[650px] mx-auto lg:mx-0">

              {/* Small heading */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 lg:mb-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />

                <p className="text-xs sm:text-sm font-bold tracking-wide text-violet-600">
                  THE FUTURE OF WORK
                </p>
              </div>

              {/* Main heading */}
              <h1
                className="
                  text-[42px]
                  sm:text-[52px]
                  lg:text-[68px]

                  leading-[1]
                  lg:leading-[0.98]

                  tracking-[-2px]
                  lg:tracking-[-3px]

                  font-bold
                  text-slate-950
                "
              >
                Find work that
                <br />

                <span className="text-violet-600">
                  feels like you.
                </span>
              </h1>

              {/* Description */}
              <p
                className="
                  mt-5
                  lg:mt-7

                  max-w-[600px]

                  text-base
                  sm:text-lg

                  leading-7
                  sm:leading-8

                  text-slate-500
                "
              >
                One trusted space for ambitious people and the teams
                they want to join.
              </p>

              {/* Users */}
              <div className="flex items-center mt-8 lg:mt-12">

                <div className="flex -space-x-2">

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-violet-700">
                      JM
                    </span>
                  </div>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-violet-700">
                      SK
                    </span>
                  </div>

                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                    <span className="text-[10px] sm:text-xs font-bold text-violet-700">
                      RB
                    </span>
                  </div>

                </div>

                <p className="ml-4 sm:ml-5 text-xs sm:text-sm text-slate-500">
                  <span className="font-bold text-slate-900">
                    12,000+
                  </span>{" "}
                  people finding better work
                </p>

              </div>

            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">

            <div className="w-full max-w-md pb-4">
              {children}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default AuthLayout;