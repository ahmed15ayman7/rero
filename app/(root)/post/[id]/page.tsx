
import CardPost from "@/components/cards/CardPost";
import Comment from "@/components/forms/Comment";
import { fetchPostById, PostData } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async({params}:{params:{id:string}}) => {
  if (!params.id) return null;
  let user = await currentUser();
  if (!user) return redirect('/sign-in');
  let userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  let post : PostData | null | undefined = await fetchPostById(params.id);
  return (
    <section className=" relative">
     {post && (<div className="">
      <CardPost react={post.react} id={post._id} parentId={post.parentId} userId={userInfo?._id} currentId={user.id} author={post.author} content={post.text}
      createdAt={post.createdAt} community={post.community}  comments={post.children} />
      </div>)}
      {post &&
      <div className="mt-5">
        <Comment
        postId={post._id}
        currentUserId={userInfo?._id}
        currentUserImg={user?.imageUrl}
        />
        </div>}
      <div className="mt-7">
        {post?.children.map((child:any) =>
        <CardPost react={post?.react} id={child?._id} parentId={child?.parentId} userId={userInfo?._id} currentId={child?.id} author={child?.author} content={child?.text}
        createdAt={child?.createdAt} community={child?.community}  comments={child?.children} isComment={true} />)}
        </div>
    </section>
  )
}

export default Page