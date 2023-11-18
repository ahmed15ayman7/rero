"use server";

import { connectDB } from "@/mongoose";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
import Post from "../models/post.models";
import User from "../models/user.models";
interface props {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createPost({ text, author, communityId, path }: props) {
  connectDB();
  try {
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );
    let createPost = await Post.create({
      text,
      author,
      community: communityIdObject,
    });
    await User.findByIdAndUpdate(author, { $push: { posts: createPost._id } });
    console.log("Post created ❤️‍🔥");
    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { posts: createPost._id },
      });
    }
    revalidatePath(path);
  } catch (error: any) {
    console.log(`failed to create posts: ${error.message}`);
  }
}
export async function createCommentToPost({
  postId,
  commentText,
  userId,
  path,
}: {
  postId: string;
  commentText: string;
  userId: string;
  path: string;
}) {
  connectDB();
  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
    }

    let createCommentToPost = new Post({
      text: commentText,
      author: userId,
      parentId: postId,
    });
    let saveCommentToPost = await createCommentToPost.save();
    await post.children.push(saveCommentToPost._id);
    await post.save();
    revalidatePath(path);
  } catch (error: any) {
    console.log(`failed to create posts: ${error.message}`);
  }
}
export async function fetchPostById(id: string) {
  connectDB();
  try {
    const post = await Post.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchPosts(pageNum = 1, pageSize = 20) {
  connectDB();
  try {
    let skipAmount = (pageNum - 1) * pageSize;
    const postQ = Post.aggregate([
      { $match: { parentId: { $in: [null, undefined] } } },
      { $sample: { size: pageSize } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {$unwind:'$author'},
      {
          $lookup: {
              from: "posts",
              localField: "children",
              foreignField: "_id",
              as: "children",
            },
        },
        {$unwind:{path:'$children',preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "users",
                localField: "children.author",
                foreignField: "_id",
                as: "children.author",
            },
        },
        {$unwind:{path:'$children.author',preserveNullAndEmptyArrays: true}},
        {
            $lookup: {
                from: "communities",
                localField: "community",
                foreignField: "_id",
                as: "community",
            },
        },
        {$unwind:{path:'$community',preserveNullAndEmptyArrays: true}},
      {
        $project: {
          _id: 1,
          text: 1,
          author: {
            _id: 1,
            id: 1,
            name: 1,
            username: 1,
            image: 1,
          },
          community: { _id: '$community._id', id: '$community.id', name: '$community.name', username: '$community.username', image: '$community.image' },
          parentId: 1,
          children: {
            author: {
              _id: '$children.author._id',
              id: '$children.author.id',
              name: '$children.author.name',
              username: '$children.author.username',
              image: '$children.author.image',
              parentId: '$children.author.parentId',
            },
          },
          members: { _id: 1, id: 1, image: 1 },
        },
      },
    ])
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize);
    const totalPosts = await Post.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postQ.exec();

    console.log("success posts count: " + posts.length);
    let isNext = +totalPosts > skipAmount + posts.length;
    return { posts, isNext };
  } catch (error: any) {
    console.log("failed to fetch posts" + error.message);
  }
}
