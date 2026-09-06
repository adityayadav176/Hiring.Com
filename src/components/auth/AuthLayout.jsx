import React from "react";
import { Sparkles } from "lucide-react";
import peerLogo from "../../assests/peerLogo.png";

function AuthLayout({ children }) {
  return (
    <div className="h-screen overflow-hidden bg-[#f7f8fc]">

      <header className="h-[90px] px-10 flex items-center">
        <div className="flex items-center gap-3">
          <img
            src={peerLogo}
            alt="Peer Hiring"
            className="w-10 h-10 object-contain"
          />

          <p className="text-xl font-bold text-slate-950">
            Peer.Hiring
          </p>
        </div>
      </header>


      <main className="h-[calc(100vh-90px)] px-16">

        <div className="h-full flex items-center justify-between">

          <div className="w-[55%]">

            <div className="max-w-[650px]">

              {/* Small heading */}
              <div className="flex items-center gap-3 mb-6">

                <Sparkles className="w-5 h-5 text-violet-600" />

                <p className="text-sm font-bold tracking-wide text-violet-600">
                  THE FUTURE OF WORK
                </p>

              </div>


              {/* Main heading */}
              <h1 className="text-[68px] leading-[0.98] tracking-[-3px] font-bold text-slate-950">

                Find work that
                <br />

                <span className="text-violet-600">
                  feels like you.
                </span>

              </h1>


              {/* Description */}
              <p className="mt-7 max-w-[600px] text-lg leading-8 text-slate-500">
                One trusted space for ambitious people and the teams
                they want to join.
              </p>


              {/* Users */}
              <div className="flex items-center mt-12">

                <div className="flex -space-x-2">

                  <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-700">
                      JM
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-700">
                      SK
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-bold text-violet-700">
                      RB
                    </span>
                  </div>

                </div>


                <p className="ml-5 text-sm text-slate-500">

                  <span className="font-bold text-slate-900">
                    12,000+
                  </span>{" "}

                  people finding better work

                </p>

              </div>

            </div>

          </div>

          <div className="w-[45%] flex justify-end">

            <div className="w-full">
              {children}
            </div>

          </div>


        </div>

      </main>

    </div>
  );
}

export default AuthLayout;