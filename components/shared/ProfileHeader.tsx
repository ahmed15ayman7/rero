"use client";
import { addMemberToCommunity } from "@/lib/actions/community.actions";
import { addFriend } from "@/lib/actions/user.actions";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
interface props {
  accountId: string;
  userAuthId: string | undefined;
  name: string;
  username: string;
  image: string;
  bio: string;
  userId?: string;
  friends?: {
    _id: string;
    id: string;
    name: string;
    username: string;
    image: string;
  }[];
  myId?: string;
  type?: "User" | "Community";
}
const ProfileHeader = ({
  accountId,
  userAuthId,
  name,
  username,
  image,
  bio,
  userId,
  friends,
  type,
  myId,
}: props) => {
  let router = useRouter();
  let pathname = usePathname();
  let isFriend =
    friends?.filter(
      (friend) => friend.id === userId || friend.id === userAuthId
    ).length === 1;
  let handleAddFriend = async () => {
    await addFriend({
      finalF: "activity",
      finalU: "sended",
      friendId: accountId,
      userId: myId,
      path: pathname,
      isFriend: isFriend,
    });
  };
  let handleAddMember = async () => {
    await addMemberToCommunity(accountId, userAuthId, pathname, isFriend);
  };
  return (
    <div className="flex w-full  justify-between">
      <div className="flex flex-col justify-start">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={image}
              alt={name}
              width={60}
              height={60}
              className="rounded-full object-cover shadow-2xl"
            />
            <div className="flex flex-col gap-3">
              <h3 className="text-white">{name}</h3>
              <p className=" text-subtle-medium text-gray-1">@{username}</p>
            </div>
          </div>
        </div>
        <p className="mt-6 max-w-lg text-base-regular text-gray-1">{bio}</p>
        <div className="mt-12"></div>
      </div>
      <div className="flex flex-col w-1/2 justify-between items-end gap-8">
        {type === "User" && userId === userAuthId ? (
          <div className="">
            <Link href={"/profile/edit/"} className="flex gap-4 cursor-pointer">
              <span className=" text-white  max-lg:hidden">edit</span>
              <Image
                src="/assets/edit.svg"
                alt="edit"
                className=""
                width={24}
                height={24}
              />
            </Link>
          </div>
        ) : (
          <div></div>
        )}
        {userId !== userAuthId ? (
          <div className="">
            <button
              className="flex no-underline gap-4 cursor-pointer"
              onClick={
                type === "Community" ? handleAddMember : handleAddFriend
              }>
              <span
                className={` text-white ${
                  isFriend ? "text-primary-500" : ""
                } max-lg:hidden`}>
                {type === "Community"
                  ? isFriend
                    ? "Subscribed"
                    : "Subscribe"
                  : isFriend
                  ? "friend"
                  : "add to friends"}
              </span>
              <Image
                src={
                  isFriend ? "/assets/user-true.svg" : "/assets/user-plus.svg"
                }
                alt="add friend"
                className=""
                width={24}
                height={24}
              />
            </button>
          </div>
        ) : (
          <div></div>
        )}
        {type === "User" && userId === userAuthId ? (
          <div className="max-sm:flex hidden ">
            <SignedIn>
              <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                <div className="flex gap-4 cursor-pointer">
                  <Image
                    src="/assets/logout.svg"
                    alt="logout"
                    width={24}
                    height={24}
                  />
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
        ) : null}
        <div className="ml-2 mt-3 flex content-end  items-center gap-2 overflow-hidden">
          {friends !== undefined && (
              <p
                className="rounded-full text-white justify-center items-center  bg-primary-500 flex"
                style={{
                  width: "30px",
                  height: "30px",
                  zIndex: "400",
                  border: "1px solid #ffffff",
                  opacity: ".6",
                }}>
                +{friends?.length}
              </p>
            ) &&
            friends.map((friend, index) => {
              return (
                <Image
                  key={index}
                  src={friend.image}
                  alt={`user_${index}`}
                  width={30}
                  height={30}
                  style={{ zIndex: `${399 - index}` }}
                  className={`-ml-4 rounded-full object-cover`}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
