import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

// Copy paste most of the code as it is from the /onboarding
interface userData{
    id:string,
    objectID:string,
    username:string |null,
    name:string,
    bio:string,
    image:string,
}
async function Page() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const userInfo = await fetchUser(user?.id);

  if (!userInfo?.onboarding) redirect("/onboarding");

  const userData:userData = {
    id: user?.id,
    objectID: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12">
        <AccountProfile userData={userData} btnTitle="Continue" />
      </section>
    </>
  );
}

export default Page;
