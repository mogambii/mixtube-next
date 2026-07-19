import React from "react";

const loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">


      {/* Logo mark */}
      <div className="relative flex items-center justify-center mb-8">

      </div>

      {/* Brand text */}
      <div className="flex items-baseline gap-0.5 mb-2 mt-3">
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide font-righteous">
          MIX
        </span>
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent tracking-wide font-righteous">
          TAPPED
        </span>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:300ms]" />
      </div>

      <style>{`
        @keyframes slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default loading;
