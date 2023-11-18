import CardPost from "@/components/cards/CardPost";
import { fetchPosts } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarding) redirect("/onboarding");
  const FPosts = await fetchPosts(1, 30);
  
  return (
    <main>
      <section className="p-8 flex flex-col gap-8 max-sm:p-0">
        {FPosts?.posts.map((post) => (
          <CardPost
            key={post?._id}
            id={post?._id}
            parentId={post?.parentId}
            currentId={user?.id}
            author={post?.author}
            content={post?.text}
            createdAt={post?.createdAt}
            community={post?.community}
            comments={post?.children}
          />
        ))}
      </section>
    </main>
  );
}
