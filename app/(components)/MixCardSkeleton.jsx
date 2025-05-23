const MixCardSkeleton = () => {
  return (
    <div className="p-2 w-full">
      <div className="dark:bg-slate-800 bg-slate-300 rounded-xl flex flex-col sm:flex-row gap-3 p-3 w-full">
        {/* Image skeleton */}
        <div className="mx-auto sm:mx-0 h-36 w-36 sm:h-40 sm:w-40 rounded-xl bg-slate-400 dark:bg-slate-700 animate-pulse" />
        
        <div className="flex flex-col justify-between flex-1 text-center sm:text-left">
          <div>
            {/* Title skeleton */}
            <div className="h-3 bg-slate-400 dark:bg-slate-700 rounded w-3/4 mx-auto sm:mx-0 animate-pulse" />
            
            {/* DJ name skeleton */}
            <div className="h-3 bg-slate-400 dark:bg-slate-700 rounded w-1/2 mt-2 mx-auto sm:mx-0 animate-pulse" />
          </div>
          
          {/* Stats skeleton */}
          <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-3 sm:mt-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse" />
              <div className="h-3 w-6 sm:h-4 sm:w-8 bg-slate-400 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse" />
              <div className="h-3 w-6 sm:h-4 sm:w-8 bg-slate-400 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixCardSkeleton;
