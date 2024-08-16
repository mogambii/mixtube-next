import Image from "next/image";
import React from "react";

const ProfileCard = ({ Djname, profilep, name }) => {
  return (
    <>
      <div className="grid gap-1 bg-slate-500 h-48 w-36 rounded-lg pb-2">
        <div className="p-1 object-cover">
          <Image
            src={
              profilep
                ? profilep
                : "https://assets.practice365.co.uk/wp-content/uploads/sites/1005/2023/03/Default-Profile-Picture-Transparent.png"
            }
            className="rounded-md border-2 object-cover"
            alt="profile"
            width={200}
            height={200}
          />
        </div>
        <div className=" text-center pb-3 ">
          <h4 className="flex items-center justify-center  gap-x-2 font-righteous  dark:text-slate-50 text-xs uppercase">
            {Djname ? Djname : name}
          </h4>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
