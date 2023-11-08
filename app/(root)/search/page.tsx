import UserCard from "@/components/cards/UserCard";
// import PostTab from "@/components/shared/PostTab";
// import ProfileHeader from "@/components/shared/ProfileHeader";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { profileTabs } from "@/constants/icons";
import { fetchAllUser, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


const Page = async () => {
 
  let user = await currentUser();
  if (!user) return redirect('/sign-in');
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  let result = await fetchAllUser({userId:user.id,searchString:'',pageNum:1,pageSize:30})
  return (
    <section className="">
        <div className=" text-white">
            Search
        </div>
        
        <div className=" mt-14 flex flex-1 flex-col gap-9">
        <UserCard key={userInfo.id} id={userInfo.id} name={userInfo.name} username={userInfo.username} image={userInfo.image} personType='User'/>
            {result?.users.length===0?<h1>no result</h1>:
            (result?.users.map(person=><UserCard key={person.id} id={person.id} name={person.name} username={person.username} image={person.image} personType='User'/>
            
            ))}
        </div>
    </section>
  )
}

export default Page