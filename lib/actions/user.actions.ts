"use server";

import { connectDB } from "@/mongoose";
import { currentUser } from "@clerk/nextjs";
import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
import Post from "../models/post.models";
import User from "../models/user.models";
import { PostData } from "./post.actions";
interface props{
    userId: string | undefined,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}
export interface UserData{
    _id: string,
    id: string ,
    username: string,
    name: string,
    bio: string,
    image: string,
    posts:string[],
    communities:string[],
    onboarding:boolean,
    friends:{
        _id:string,
        id:string,
        name:string,
        username:string,
        image:string,
    }[]
}
export interface Result {
    _id: string;
    name: string;
    image: string;
    id: string;
    posts: PostData[];
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
    if (path.includes('/profile/edit')) {
        revalidatePath(path);
    }
   } catch (error:any) {
    console.log(`failed to update user: ${error.message}`);
   }
}
export async function fetchUser (userId:string | undefined) {
    connectDB();
    try {
        let user :UserData|null =  await User.findOne({id:userId})
        .populate({
            path: 'friends',
            model:User,
            select:'id image name username',
          }).lean()
        
        console.log(user)
        if(!user){
            console.log("user not found");
        }
        console.log("found user with id ")
    return user;
    } catch (error:any) {
        console.log(`not found user: ${error.message}`);
    }
}
export async function fetchAllUser ({searchString='',pageNum=1, pageSize=20,sortBy='desc'}:{searchString:string,pageNum:number, pageSize:number,sortBy?:SortOrder}) {
    try {
        connectDB();
        let user = await currentUser();
        let skipAmount =(pageNum-1)*pageSize;
        let regex = new RegExp(searchString,"i")
        let query :FilterQuery<typeof User> ={id:{$ne:user?.id}};
        if (searchString.trim() !=='') {
            query.$or=[{name:{$regex:regex}},{username:{$regex:regex}}]
        }
        let users = await  User.aggregate([{$match:query},
            {$sample:{size:pageSize}},
          ])
        .sort({createdAt:'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .exec();
        const totalUsers = await User.countDocuments(query);
        let isNext= +totalUsers > skipAmount + users.length;
    return {users,isNext};
    } catch (error:any) {
        console.log(`not found user: ${error.message}`);
    }

}
export async function fetchUserPosts (userId:string) {
    connectDB();
    try {
        let posts: Result | null  = await User.findOne({id:userId}).populate({
            path:'posts',
            model:Post,
            populate:[ {
                path:'children',
                model:Post,
                populate: {
                    path:'author',
                    model:User,
                    select:'id name image'
                }
            },
            {
                path:'community',
                model: Community,
                select:'id name image'
            }
        ]
        }).lean()
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
    }catch(e:any){
        console.log(`not found user: ${e.message}`);
        
    }
}
export async function addFriend (
    {finalF,finalU,friendId, userId,path,isFriend}:{userId?:string,friendId:string,finalF:string,finalU:string,path:string,isFriend:boolean}
){
    connectDB();
    try {

    const user = await User.findById(userId)
    const friend = await User.findById(friendId)
    if(!user || !friend){
        console.log("user not found");
    }
    isFriend?friend.friends.pop(userId):
    friend.friends.push(userId);
    isFriend?user.friends.pop(friendId):
    user.friends.push(friendId);
    await friend.save();
    await user.save();
    console.log('success to add friend');
    revalidatePath(path);
   } catch (error:any) {
    console.log(`failed to add friend: ${error.message}`);
   }
}