import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import CardPost from "../cards/CardPost";
interface props {
  currentUserId: string | undefined;
  accountId: string;
  accountType: string;
}
async function PostTab ({ currentUserId, accountId, accountType }: props){
  let result = await fetchUserPosts(accountId);
  if (!result) redirect("/");
  return (
    <div className="flex flex-col gap-10 ">
      {result.posts.map((post:any) => (
        <CardPost
          key={post._id}
          id={post._id}
          parentId={post.parentId}
          currentId={currentUserId}
          author={accountType==='User'?{id:result.id,image:result.image,name:result.name}:post.author}
          comments={post.children}
          community={post.community}
          content={post.text}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
};

export default PostTab;
