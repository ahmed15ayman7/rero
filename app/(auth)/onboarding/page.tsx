import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
interface usData {
  id: string | undefined;
  objectID: string | undefined;
  username: string |null|undefined;
  name: string;
  bio: string;
  image: string|undefined;
  type: string
}
const Onboarding = async () => {
  let user = await currentUser();
  const userInfo = await fetchUser(user?.id);
  console.log(user);
  if (userInfo?.onboarding) redirect("/");
  let userData: usData = {
    id: user?.id,
    objectID: userInfo?._id,
    username: user?.username || userInfo?.username,
    name: user?.firstName || userInfo?.name || "",
    bio: userInfo?.bio || "",
    image: user?.imageUrl || userInfo?.image,
    type:'user'
  };
  return (
    <main className="  mx-auto py-12 flex flex-col max-w-3xl">
      <h1 className="font-bold text-white">Onboarding</h1>
      <p className=" text-gray-500 my-6">
        This is where you will be able to create a new account.
      </p>
      <div className=" bg-dark-2  p-10 ">
        <AccountProfile userData={userData}/>
      </div>
    </main>
  );
};

export default Onboarding;
