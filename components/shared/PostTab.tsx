import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { PostData } from "@/lib/actions/post.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import CardPost from "../cards/CardPost";
interface props {
  currentUserId: string | undefined;
  accountId: string|undefined;
  accountType: string;
  userId:string|undefined
}

interface Result {
  _id: string;
  name: string;
  image: string;
  id: string;
  posts: PostData[];
}
let resDefault = {
  _id: "",
  name: "",
  image: "",
  id: "",
  posts: [
    {
      _id: "",
      text: "",
      parentId: "",
      currentId:'',
      author: {
        _id: "",
        name: "",
        image: "",
        id: "",
      },
      react:[],
      community: {
        id: "",
        name: "",
        image: "",
      },
      createdAt: "",
      children: [
        {
          author: {
            _id: "",
            id: "",
            image: "",
            name: ''
          },
        },
      ],
    },
  ],
};
async function PostTab({ userId,currentUserId, accountId, accountType }: props) {
  let result: Result | null |undefined = resDefault;
  if (accountId) {
    
    switch (accountType) {
      case "Community":
        result = await fetchCommunityPosts(accountId);
        break;
        case "User":
          result = await fetchUserPosts(accountId);
          break;
          default:
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            result = resDefault;
            break;
          }
    }
  if (!result) redirect("/");
  return (
    <div className="flex flex-col gap-10 ">
      
       {  result.posts.map((post: PostData) => (
       <CardPost
          key={post._id}
          id={post._id}
          parentId={post.parentId}
          currentId={currentUserId}
          author={
            accountType === "User" && result
              ? {
                  _id: result._id,
                  id: result.id,
                  image: result.image,
                  name: result.name,
                }
              : post.author
          }
          userId={userId}
          react={post.react}
          comments={post.children}
          community={
            accountType === "Community" && result
              ? { name: result.name, id: result.id, image: result.image }
              : post.community
          }
          content={post.text}
          createdAt={post.createdAt}
        />
      ))} 
    </div>
  );
}

export default PostTab;
