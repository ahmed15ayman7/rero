import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


const Page = async () => {
  let user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  let activity = await getActivity(userInfo._id)
  let activityInfo = activity === undefined?[]:activity;
  return (
    <section className="">
        <h1 className=" text-white">
            Activity
        </h1>
        <section className=" mt-10 flex flex-col gap-8">
          {activityInfo.length > 0?<div className="">
            {activityInfo.map(activity =>
              <Link key={activity._id} href={`/post/${activity.parentId}`}>
                <article className="activity-card">
                <Image src={activity.author.image} alt={activity.author.name} width={30} height={30} className=' rounded-full object-contain' />
                <p className=" !text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">{activity.author.name}</span>
                  {' '} replied to your post
                </p>
                </article>
              </Link>
              )}
          </div>:<p className="!text-base-regular text-light-3">No activity yet</p>}
        </section>
        </section>
  )
}

export default Page