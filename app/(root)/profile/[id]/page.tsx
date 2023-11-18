import UserCard from "@/components/cards/UserCard";
import PostTab from "@/components/shared/PostTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants/icons";
import { fetchUser, UserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async ({params}:{params:{id:string}}) => {
  let user = await currentUser();
  if (!user) return redirect('/sign-in');
  const userInfo : UserData | null | undefined = await fetchUser(params.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  let MyInfo = await fetchUser(user.id)
  let friends= params.id===user.id?MyInfo?.friends:userInfo?.friends;
  
  return (
    <section className="">
      <ProfileHeader
        accountId={userInfo._id}
        userId={userInfo.id}
        myId={MyInfo?._id}
        userAuthId={user.id}
        friends={friends}
        name={userInfo.name}
        username={userInfo.username}
        image={userInfo.image}
        bio={userInfo.bio}
        type={'User'}
      />
      <div className="mt-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  height={24}
                  width={24}
                  className="object-contain"
                />
                <p className=" max-sm:hidden">{tab.label}</p>
                {tab.label === "Posts" && (
                  <p className=" bg-gray-700 rounded-full px-2 text-base-regular">
                    {userInfo?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full mt-8 text-light-1">
                {tab.value==='replies' ?
                <section className="flex flex-col gap-10">
                    {userInfo.friends.map((friend:any) =>
                        <UserCard
                        id={friend.id}
                        name={friend.name}
                        username={friend.username}
                        image={friend.image}
                        personType='User'
                        />
                        )}
                </section>
                :
                 /* @ts-ignore */
              <PostTab
                currentUserId={user?.id}
                accountId={userInfo?.id}
                accountType="User"
              />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
