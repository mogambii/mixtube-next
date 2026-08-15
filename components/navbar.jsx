import Image from "next/image";
import Link from "next/link";
import NotificationIcon from "./NotificationIcon";
import { getServerSession } from "next-auth";
import ProfileIcon from "./Profile";
import ThemeToggle from "./ThemeToggle";
import SearchTrigger from "./SearchTrigger";
import NavMenu from "./NavMenu";

async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="mx-auto max-w-7xl flex justify-between items-center px-3 sm:px-6 py-2 sm:py-3 bg-white/75 dark:bg-gray-950/70 backdrop-blur-2xl dark:text-slate-50 border border-black/5 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-full transition-all duration-300">
      
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative group-hover:scale-105 transition-transform duration-300 shrink-0">
            <Image
              src="https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"
              alt="mixtapped Logo"
              width={32}
              height={32}
              className="object-contain w-7 h-7 sm:w-9 sm:h-9"
            />
          </div>
          
          <h1 className="text-base sm:text-2xl xl:text-3xl font-bold font-righteous tracking-wide whitespace-nowrap">
            <span className="text-gray-900 dark:text-white">MIX</span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              TAPPED
            </span>
          </h1>
        </Link>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-x-1 sm:gap-x-3 shrink-0">
        {session ? (
          <>
            <SearchTrigger />
            <NotificationIcon />
            <div className="h-5 sm:h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-0.5 sm:mx-1 hidden xs:block"></div>
            <ProfileIcon />
          </>
        ) : (
          <div className="flex items-center gap-x-1 sm:gap-x-2">
            <SearchTrigger />
            <Link href="/login" className="hidden sm:block">
              <button className="rounded-full px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors whitespace-nowrap">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 font-semibold text-white text-xs sm:text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap">
                Sign Up
              </button>
            </Link>
          </div>
        )}
        
        {/* Separator */}
        <div className="h-5 sm:h-8 w-[1px] bg-black/10 dark:bg-white/10 mx-0.5 sm:mx-1"></div>
        
        <ThemeToggle />
        <NavMenu />
      </div>
    </nav>
  );
}

export default Navbar;
