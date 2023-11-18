import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import CardPost from "../cards/CardPost";
interface props {
  currentUserId: string | undefined;
  accountId: string|undefined;
  accountType: string;
}
interface Posts {
  _id: string;
  text: string;
  parentId: string;
  author: {
    _id: string;
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  children: {
    author: {
      _id: string;
      id: string;
      image: string;
    };
  }[];
}
interface Result {
  _id: string;
  name: string;
  image: string;
  id: string;
  posts: Posts[];
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
      author: {
        _id: "",
        name: "",
        image: "",
        id: "",
      },
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
          },
        },
      ],
    },
  ],
};
async function PostTab({ currentUserId, accountId, accountType }: props) {
  let result: Result = resDefault;
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
      {result.posts.map((post: Posts) => (
        <CardPost
          key={post._id}
          id={post._id}
          parentId={post.parentId}
          currentId={currentUserId}
          author={
            accountType === "User"
              ? {
                  _id: result._id,
                  id: result.id,
                  image: result.image,
                  name: result.name,
                }
              : post.author
          }
          comments={post.children}
          community={
            accountType === "Community"
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
