
import Search from "@/components/shared/Search";
import { fetchUser, UserData } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const Page = async() => {
  let user = await currentUser();
  if (!user) return redirect('/sign-in');
  const userInfo : UserData | null | undefined = await fetchUser(user.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  return (
    <Search typeS="user"/>
  );
};

export default Page;
