"use server";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import Post from "../models/post.models";
import User from "../models/user.models";
import { connectDB } from "@/mongoose";
import { revalidatePath } from "next/cache";
import { Result } from "./user.actions";
export interface CommunityData {
  _id: string;
  id: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  createdBy: string;
  posts: string[];
  members: {
    _id: string;
    id: string;
    name: string;
    username: string;
    image: string;
  }[];
}
export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string // Change the parameter name to reflect it's an id
) {
  try {
    connectDB();

    // Find the user with the provided unique id
    const user = await User.findOne({ id: createdById });

    if (!user) {
      console.log("User not found"); // Handle the case if the user with the id is not found
    }

    const newCommunity = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();

    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error: any) {
    console.log("Error creating community:", error);
  }
}

export async function fetchCommunityDetails(id: string) {
  connectDB();
  try {
    let communityDetails: CommunityData | null = await Community.findOne({
      id: id,
    })
      .populate([
        {
          path: "members",
          model: User,
          select: "name username image _id id",
        },
      ])
      .lean();
    if (!communityDetails) console.log("community details not found");
    return communityDetails;
  } catch (error: any) {
    console.log("Error fetching community details:", error);
  }
}

export async function fetchCommunityPosts(id: string) {
  connectDB();
  try {
    const communityPosts: Result | null | undefined = await Community.findById(
      id
    )
      .populate({
        path: "posts",
        model: Post,
        populate: [
          {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
          {
            path: "children",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "image _id", // Select the "name" and "_id" fields from the "User" model
            },
          },
        ],
      })
      .lean();

    return communityPosts;
  } catch (error: any) {
    console.log("Error fetching community posts:", error);
  }
}

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof Community> = {};
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    const communitiesQ = Community.aggregate([
      { $match: query },
      { $sample: { size: pageSize } },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $project: {
          _id: 1,
          id: 1,
          name: 1,
          username: 1,
          image: 1,
          members: { _id: 1, id: 1, image: 1 },
        },
      },
    ])
      .sort({ createdAt: sortBy })
      .skip(skipAmount)
      .limit(pageSize);

    const totalCommunitiesCount = await Community.countDocuments(query);
    let communities = await communitiesQ.exec();
    const isNext = totalCommunitiesCount > skipAmount + communities.length;
    return { communities, isNext };
  } catch (error: any) {
    console.log("Error fetching communities:", error);
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string | undefined,
  path: string,
  isFriend: boolean
) {
  try {
    connectDB();
    // Find the community by its unique id
    const community = await Community.findById(communityId);

    if (!community) {
      console.log("Community not found");
    }
    // Find the user by their unique id
    const user = await User.findById(memberId);

    if (!user) {
      console.log("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      console.log("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    isFriend
      ? user.communities.pop(community._id)
      : user.communities.push(community._id);
    isFriend
      ? community.members.pop(user._id)
      : community.members.push(user._id);
    await community.save();
    await user.save();
    revalidatePath(path);
    // return community;
  } catch (error: any) {
    console.log("Error adding member to community:", error);
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectDB();
    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      console.log("User not found");
    }

    if (!communityIdObject) {
      console.log("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error: any) {
    console.log("Error removing user from community:", error);
  }
}

export async function updateCommunityInfo({
  communityId,
  username,
  name,
  bio,
  image,
  path,
}: {
  communityId: string | undefined;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}) {
  try {
    connectDB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findByIdAndUpdate(communityId, {
      name: name,
      username: username,
      image: image,
      bio: bio,
    });
    if (path.includes("/profile/edit")) {
      revalidatePath(path);
    }
    if (!updatedCommunity) {
      console.log("Community not found");
    }

    return updatedCommunity;
  } catch (error: any) {
    console.log("Error updating community information:", error);
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectDB();
    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });
    if (!deletedCommunity) {
      console.log("Community not found");
    }
    // Delete all threads associated with the community
    await Post.deleteMany({ community: communityId });
    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityId });
    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });
    await Promise.all(updateUserPromises);
    return deletedCommunity;
  } catch (error: any) {
    console.log("Error deleting community: ", error);
  }
}
