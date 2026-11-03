export default function Loading() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7F8FC]">

      {/* Background glow */}
      <div className="absolute h-80 w-80 rounded-full bg-purple-300/30 blur-[120px] animate-pulse" />

      {/* Background orbit circles */}
      <div className="absolute h-[320px] w-[320px] rounded-full border border-purple-200/50" />
      <div className="absolute h-[440px] w-[440px] rounded-full border border-indigo-100/70" />

      {/* Main loader */}
      <div className="relative flex h-48 w-48 items-center justify-center">

        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#6D28D9] border-r-indigo-400 animate-spin [animation-duration:3s]" />

        {/* Inner rotating ring */}
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-purple-400 border-l-indigo-300 animate-spin [animation-duration:5s] [animation-direction:reverse]" />

        {/* Glowing orb */}
        <div className="absolute inset-7 rounded-full bg-gradient-to-br from-purple-200/60 via-indigo-100/50 to-blue-100/60 shadow-[0_0_50px_rgba(109,40,217,0.15)] animate-pulse" />

        {/* Center logo */}
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border border-white bg-white/80 shadow-[0_8px_35px_rgba(109,40,217,0.12)] backdrop-blur-xl">

          <span className="text-5xl font-black tracking-tighter">
            <span className="bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent">
              p
            </span>
            <span className="bg-gradient-to-br from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              h
            </span>
          </span>

        </div>

        {/* Floating particles */}
        <div className="absolute -right-1 top-10 h-3 w-3 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse" />

        <div className="absolute -left-1 bottom-10 h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse" />

      </div>

      {/* Brand */}
      <div className="absolute bottom-12 text-center">
        <h1 className="text-xl font-semibold tracking-wide text-gray-800">
          Peer<span className="text-[#6D28D9]">.Hiring</span>
        </h1>
      </div>

    </div>
  );
}