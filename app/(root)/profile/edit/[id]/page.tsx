import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";

// Copy paste most of the code as it is from the /onboarding
interface userData{
    id:string,
    objectID:string | undefined,
    username:string |null,
    name:string,
    bio:string,
    image:string,
    type:string,

}
async function Page({params}:{params:{id:string}}) {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  const userInfo = params.id.includes('org')?await fetchCommunityDetails(params.id): await fetchUser(params.id);

  const userData:userData = {
    id: user?.id,
    objectID: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
    type:params.id.includes('org')?'community':'user'
  };

  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12">
        <AccountProfile userData={userData} />
      </section>
    </>
  );
}

export default Page;
