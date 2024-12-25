import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaDownload, FaRegCirclePlay } from "react-icons/fa6";

const MixCard = ({ name, title, img, downloads, Djname, plays, link }) => {
  return (
    <div className="p-2 w-full">
      <Link href={link}>
        <div className="dark:bg-slate-800 bg-slate-300 rounded-xl flex gap-4 p-2 w-full">
          <Image
            priority
            src={img ? img : "https://placehold.co/210x210"}
            className="rounded-xl h-32 w-32 object-cover"
            alt={title}
            height={100}
            width={100}
          />
          <div className="flex flex-col justify-between ">
            <div>
              <h3 className="font-bold dark:text-slate-100 text-[12px] uppercase overflow-clip">
                {title ? title : "Title"}
              </h3>
              <h4 className="font-righteous uppercase dark:text-white text-[11px] mt-1">
                BY : {Djname !== "null" ? Djname : name}
              </h4>
            </div>
            <div className="flex items-center gap-4 mt-2 mb-3">
              <div className="flex items-center gap-2">
                <FaDownload className="dark:text-slate-50 h-5 w-5" />
                <h4 className="dark:text-slate-50 text-sm">{downloads}</h4>
              </div>
              <div className="flex items-center gap-2">
              <FaRegCirclePlay className="dark:text-slate-50 h-5 w-5"/>
                <h4 className="dark:text-slate-50 text-sm">{plays}</h4>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MixCard;
