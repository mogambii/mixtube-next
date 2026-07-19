const MixCardSkeleton = () => {
  return (
    <div className="p-2 w-full">
      <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl rounded-2xl flex flex-col sm:flex-row gap-4 p-3 sm:p-4 w-full shadow-lg border border-white/20 dark:border-white/5 overflow-hidden relative">
        {/* Image skeleton */}
        <div className="mx-auto sm:mx-0 h-48 w-full sm:h-40 sm:w-40 flex-shrink-0 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        
        <div className="flex flex-col justify-between flex-1 text-center sm:text-left py-1 w-full min-w-0">
          <div className="w-full min-w-0">
            {/* Title skeleton */}
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto sm:mx-0 animate-pulse" />
            
            {/* DJ name skeleton */}
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mt-3 mx-auto sm:mx-0 animate-pulse" />
          </div>
          
          {/* Stats skeleton */}
          <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-4 sm:mt-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixCardSkeleton;
