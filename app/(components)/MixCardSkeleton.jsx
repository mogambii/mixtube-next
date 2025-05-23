const MixCardSkeleton = () => {
  return (
    <div className="p-2 w-full">
      <div className="dark:bg-slate-800 bg-slate-300 rounded-xl flex gap-4 p-2 w-full">
        {/* Image skeleton */}
        <div className="h-32 w-32 rounded-xl bg-slate-400 dark:bg-slate-700 animate-pulse" />
        
        <div className="flex flex-col justify-between flex-1">
          <div>
            {/* Title skeleton */}
            <div className="h-3 bg-slate-400 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
            
            {/* DJ name skeleton */}
            <div className="h-3 bg-slate-400 dark:bg-slate-700 rounded w-1/2 mt-2 animate-pulse" />
          </div>
          
          {/* Stats skeleton */}
          <div className="flex items-center gap-4 mt-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-slate-400 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-8 bg-slate-400 dark:bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-slate-400 dark:bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-8 bg-slate-400 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixCardSkeleton;
