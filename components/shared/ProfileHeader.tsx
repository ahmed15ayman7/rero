import Image from "next/image";
import React from "react";
interface props {
  accountId: string;
  userAuthId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
}
const ProfileHeader = ({
  accountId,
  userAuthId,
  name,
  username,
  image,
  bio,
}: props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={image} alt={name} width={60} height={60} className='rounded-full object-cover shadow-2xl' />
          <div className="flex flex-col gap-3">
          <h3 className="text-white">{name}</h3>
          <p className=" text-subtle-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-gray-1">{bio}</p>
      <div className="mt-12"></div>
    </div>
  );
};

export default ProfileHeader;
