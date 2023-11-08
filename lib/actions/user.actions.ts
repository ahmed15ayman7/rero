"use server";

import { connectDB } from "@/mongoose";
import { SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Post from "../models/post.models";
import User from "../models/user.models";
interface props{
    userId: string | undefined,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}
export async function updateUser (
    { userId, username, name, bio, image, path}:props
) : Promise<void> {
    connectDB();
    try {
    await User.findOneAndUpdate(
        {id: userId},
        {username: username, bio: bio, name: name, image: image, onboarding:true},
        {upsert: true}
    )
    console.log("Successfully updated user")
    if (path==='/profile/edit') {
        revalidatePath(path);
    }
   } catch (error:any) {
    console.log(`failed to update user: ${error.message}`);
   }
}
export async function fetchUser (userId:string | undefined) {
    connectDB();
    try {
        let user = await User.findOne({id:userId});
        console.log("found user with id ")
    return user;
    } catch (error:any) {
        console.log(`not found user: ${error.message}`);
    }

}
export async function fetchAllUser ({userId,searchString='',pageNum=1, pageSize=20,sortBy='desc'}:{userId:string,searchString:string,pageNum:number, pageSize:number,sortBy?:SortOrder}) {
    connectDB();
    try {
        let skipAmount =(pageNum-1)*pageSize;
        let regax = new RegExp(searchString,'i')
        let searchBy=[];
        if (searchString.trim() !=='') {
        searchBy.push({name:{$regax:regax}},{username:{$regax:regax}})
        }
        let users = await  User.find({id:{$ne:userId},$or:searchBy})
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .exec();
        const totalPosts = await Post.countDocuments({id:{$ne:userId},$or:searchBy});
        let isNext= +totalPosts > skipAmount + users.length;
    return {users,isNext};
    } catch (error:any) {
        console.log(`not found user: ${error.message}`);
    }

}
export async function fetchUserPosts (userId:string) {
    connectDB();
    try {
        let posts = await User.findOne({id:userId}).populate({
            path:'posts',
            model:Post,
            populate: {
                path:'children',
                model:Post,
                populate: {
                    path:'author',
                    model:User,
                    select:'id name image'
                }
            }
        });
        return posts;
    } catch (error:any) {
        console.log(`not found user: ${error.message}`);
    }
    
}
export async function getActivity (userId:string) {
    connectDB();
    try {
        let userPosts= await Post.find({author:userId})
        let childPostIds= userPosts.reduce((acc :any , post : any) =>acc.concat(post.children),[])
        let replies = await Post.find({_id:{$in:childPostIds},author:{$ne:userId}})
        .populate({
            path:'author',
            model:User,
            select:'_id name image'
        })
        return replies;
    }catch(e){
    
    }
}