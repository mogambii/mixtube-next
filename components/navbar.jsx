import Link from "next/link";
import Image from "next/image";
import NotificationIcon from "./NotificationIcon";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-slate-100 dark:bg-gray-950 dark:text-slate-50 shadow-lg rounded">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            className="h-10 hidden md:block"
            src="https://telegra.ph/file/a5282d7a00d9ec58056a5.png"
            alt="Mixtube Logo"
            width={40}
            height={40}
          />
          <h1 className="text-xl md:text-2xl xl:text-3xl font-bold">
            MIX<span className="text-blue-700">TUBE</span>
          </h1>
        </Link>
      </div>
      <div className=" flex gap-x-2">
        <NotificationIcon />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Navbar;
