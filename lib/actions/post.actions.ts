"use server";

import { connectDB } from "@/mongoose";
import { revalidatePath } from "next/cache";
import Post from "../models/post.models";
import User from "../models/user.models";
interface props{
    text: string,
    author: string,
    community: string | null,
    path: string
}
export async function createPost (
    { text,author,community, path}:props
){
    connectDB();
    try {
   let createPost= await Post.create({ text,author,community:null})
    await User.findByIdAndUpdate(author,{$push:{posts:createPost._id}})
    console.log("Post created ❤️‍🔥")
    revalidatePath(path);
   } catch (error:any) {
    console.log(`failed to create posts: ${error.message}`);
   }
}
export async function createCommentToPost (
    { postId,commentText,userId,path}:{postId:string,commentText:string,userId:string,path:string}
){
    connectDB();
    try {

    const post = await Post.findById(postId)
    if(!post) {
        console.log("Post not found");
    }

    let createCommentToPost= new Post({
        text: commentText,
        author: userId,
        parentId: postId
    })
    let saveCommentToPost = await createCommentToPost.save();
    await post.children.push(saveCommentToPost._id);
    await post.save();
    revalidatePath(path);
   } catch (error:any) {
    console.log(`failed to create posts: ${error.message}`);
   }
}
export async function fetchPostById (id:string) {
    connectDB();
    try {
        const post = await Post.findById(id)
        .populate({path:'author',model:User,select:'_id id name image'})
        .populate({path:'children',populate:[{
            path:'author',
            model:User,
            select:'_id id name parentId image',
        },{
            path:'children',
            model:Post,
            populate:{
                path:'author',
                model:User,
                select:'_id id name parentId image',
            }
        }
    ]}).exec();
        return post;
    }catch (error) {
        console.log(error)
    }
    }
export async function fetchPosts (pageNum=1, pageSize=20) {
    connectDB();
    try {
        let skipAmount =(pageNum-1)*pageSize;
    const postQ =  Post.find({parentId:{$in:[null,undefined]}})
    .sort({createdAt:'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path:'author',model:User})
    .populate({path:'children',populate:{
        path:'author',
        model:User,
        select:'_id name parentId image',
    }})
    const totalPosts = await Post.countDocuments({parentId:{$in:[null,undefined]}})
    const posts =await postQ.exec();
    console.log("success posts count: " + posts.length)
    let isNext= +totalPosts > skipAmount + posts.length;
    return { posts , isNext }
    } catch (error:any) {
        console.log("failed to fetch posts"+ error.message);
    }

}