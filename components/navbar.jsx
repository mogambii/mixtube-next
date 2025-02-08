import Image from "next/image";
import Link from "next/link";
import NotificationIcon from "./NotificationIcon";
import { getServerSession } from "next-auth";
import ProfileIcon from "./Profile";
import ThemeToggle  from "./ThemeToggle";

async function  Navbar() {
  const session = await getServerSession();

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-slate-100 dark:bg-gray-900 dark:text-slate-50 shadow-lg rounded">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            className="h-10 hidden md:block"
            src="https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png"
            alt="Mixtube Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl md:text-2xl xl:text-3xl font-bold font-righteous">
            MIX<span className="text-blue-700">TUBE</span>
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-3">
        {session ? (
          <>
            <NotificationIcon />
            <ProfileIcon />
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="rounded-full px-4 py-2 font-medium hover:bg-slate-200 dark:hover:bg-gray-800 text-sm">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="rounded-full px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 text-sm">
                Sign Up
              </button>
            </Link>
          </>
        )}
        <ThemeToggle/>
      </div>
    </div>
  );
}

export default Navbar;
