import UserCard from "@/components/cards/UserCard";
import PostTab from "@/components/shared/PostTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants/icons";
import {
  CommunityData,
  fetchCommunityDetails,
} from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
interface Member {
  _id: string;
  id: string;
  name: string;
  username: string;
  image: string;
}
const page = async ({ params }: { params: { id: string } }) => {
  let user = await currentUser();
  let userInfo = await fetchUser(user?.id);

  if (!user) return redirect("/sign-in");
  let communityDetails: CommunityData | null | undefined =
    await fetchCommunityDetails(params.id);
  if (!communityDetails) return null;
  let members: Member[] = communityDetails?.members;
  let myId=userInfo?.communities.filter(e=>JSON.stringify(e)===JSON.stringify(communityDetails?._id))[0]
  let admin=JSON.stringify(userInfo?._id)===JSON.stringify(communityDetails.createdBy)
  return (
    <section className="text-white">
      <ProfileHeader
        accountId={communityDetails?._id}
        userAuthId={user.id}
        userId={userInfo?._id}
        name={communityDetails.name}
        username={communityDetails.username}
        image={communityDetails.image}
        bio={communityDetails.bio}
        myId={myId&&admin?communityDetails.id:undefined}
        friends={members}
        type="Community"
      />
      <div className="mt-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  height={24}
                  width={24}
                  className="object-contain"
                />
                <p className=" max-sm:hidden">{tab.label}</p>
           
                  <p className=" bg-gray-700 rounded-full px-2 text-base-regular">
                    {tab.label === "Posts" ? (communityDetails?.posts?.length):tab.value === "members"?(members?.length):null}
                  </p>
                
              </TabsTrigger>
            ))}
          </TabsList>

          {communityTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full mt-8 text-light-1">
              {tab.value === "members" ? (
                <section className="flex flex-col gap-10">
                  {members.map((member: any) => (
                    <UserCard
                      id={member.id}
                      name={member.name}
                      username={member.username}
                      image={member.image}
                      personType="User"
                    />
                  ))}
                </section>
              ) : (
                /* @ts-ignore */
                <PostTab
                  userId={userInfo?._id}
                  currentUserId={user?.id}
                  accountId={communityDetails?._id}
                  accountType="Community"
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default page;
