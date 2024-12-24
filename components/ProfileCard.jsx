import Image from "next/image";
import React from "react";

const ProfileCard = ({ Djname, profilep, name }) => {
  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300  h-36  w-28 md:w-48 md:h-60 p-4">
      <div className="h-16 w-16 md:w-36 md:h-36 flex items-center justify-center mb-3">
        <Image
          src={
            profilep
              ? profilep
              : "https://assets.practice365.co.uk/wp-content/uploads/sites/1005/2023/03/Default-Profile-Picture-Transparent.png"
          }
          className="rounded-full border-4 border-gray-200 dark:border-gray-600 object-cover"
          alt="profile"
          width={128}
          height={128}
        />
      </div>
      <div className="text-center">
        <h4 className=" text-xs md:text-base font-semibold text-gray-800 dark:text-gray-200 break-words">
          {Djname ? Djname : name}
        </h4>
      </div>
    </div>
  );
};

export default ProfileCard;
