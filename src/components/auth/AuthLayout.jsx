
import React from "react";
import { Sparkles } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="relative isolate min-h-screen w-full overflow-x-hidden bg-[#F8F7FC]">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute -top-[380px] left-[35%] h-[750px] w-[750px] rounded-full bg-[#EEE7FF]/80" />

        <div className="absolute -top-[240px] left-[48%] h-[650px] w-[650px] rounded-full border border-violet-200/70" />

        <div className="absolute -bottom-[420px] -left-[150px] h-[750px] w-[1000px] rounded-[50%] bg-gradient-to-tr from-[#E9DFFF] via-[#F1EAFF] to-transparent" />

        <div className="absolute -bottom-[400px] -right-[250px] h-[650px] w-[650px] rounded-full bg-[#EDE5FF]/80" />

      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex h-[88px] w-full max-w-[1500px] items-center justify-between px-6 sm:px-10 lg:h-[100px] lg:px-12">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6924DB] shadow-md shadow-violet-500/20">
            <span className="text-[27px] font-extrabold italic text-white">
              P
            </span>
          </div>

          <span className="text-[23px] font-bold tracking-[-0.8px] text-[#17152D]">
            Peer.<span className="text-[#6924DB]">Hiring</span>
          </span>

        </div>

      </header>

      {/* Main */}
      <main className="
        relative z-10 mx-auto grid w-full max-w-[1380px]
        grid-cols-1 items-center gap-12
        px-6 pb-12 pt-8
        sm:px-10
        lg:min-h-[calc(100svh-100px)]
        lg:grid-cols-[minmax(0,1fr)_440px]
        lg:gap-16 lg:px-12
        lg:py-10
        xl:gap-24
      ">

        {/* Hero */}
        <section className="flex w-full items-center justify-center lg:justify-start">

          <div className="w-full max-w-[590px]">

            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-200/70 bg-white/70 px-4 py-2.5">
              <Sparkles className="h-[17px] w-[17px] text-[#7029DF]" />

              <span className="text-[12px] font-bold tracking-[1.7px] text-[#7029DF]">
                THE FUTURE OF WORK
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[clamp(42px,4.3vw,62px)] font-bold leading-[1.08] tracking-[-2.8px] text-[#17152F]">
              Find work that
              <br />
              <span className="bg-gradient-to-r from-[#6721D9] to-[#9460E8] bg-clip-text text-transparent">
                feels like you.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-[470px] text-[16px] leading-[1.8] tracking-[-0.15px] text-[#77728F] sm:text-[17px]">
              One trusted space for ambitious people and the teams they want to join.
            </p>

            {/* Social Proof */}
            <div className="mt-9 flex flex-wrap items-center gap-4">

              <div className="flex -space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#E7DDFB] text-[11px] font-bold text-violet-800">
                  JM
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#F9E1F0] text-[11px] font-bold text-pink-800">
                  SK
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#DFE8FF] text-[11px] font-bold text-blue-800">
                  RB
                </div>
              </div>

              <div className="h-8 w-px bg-violet-200" />

              <p className="text-[14px] text-[#77728F]">
                <span className="font-bold text-[#30205D]">12,000+</span>
                {" "}people finding better work
              </p>

            </div>

          </div>
        </section>

        {/* Authentication Card */}
        <section className="flex w-full items-center justify-center lg:-translate-y-10">

          <div className="
            w-full max-w-[440px]
            rounded-[24px]
            border border-white/90
            bg-white/95
            px-6 py-7
            shadow-[0_20px_65px_rgba(76,40,135,0.12)]
            backdrop-blur-xl
            sm:px-8 sm:py-8
          ">
            {children}
          </div>

        </section>

      </main>
    </div>
  );
}

export default AuthLayout;
