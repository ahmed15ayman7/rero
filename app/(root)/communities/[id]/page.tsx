import UserCard from "@/components/cards/UserCard";
import PostTab from "@/components/shared/PostTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants/icons";
import {
  CommunityData,
  fetchCommunityDetails,
} from "@/lib/actions/community.actions";
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
  if (!user) return redirect("/sign-in");
  let communityDetails: CommunityData | null | undefined =
    await fetchCommunityDetails(params.id);
  if (!communityDetails) return null;
  let members: Member[] = communityDetails?.members;
  return (
    <section className="text-white">
      <ProfileHeader
        accountId={params.id}
        userAuthId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        image={communityDetails.image}
        bio={communityDetails.bio}
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
                {tab.label === "Posts" && (
                  <p className=" bg-gray-700 rounded-full px-2 text-base-regular">
                    {communityDetails?.posts?.length}
                  </p>
                )}
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
