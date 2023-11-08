"use client"
import { createCommentToPost } from "@/lib/actions/post.actions";
import { CommentValidation } from "@/lib/validations/post";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
interface props {
  postId: string;
  currentUserId: string;
  currentUserImg: string;
}
const Comment = ({ postId, currentUserId, currentUserImg }: props) => {
    let pathname= usePathname()
  let form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  });
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    await createCommentToPost({postId:postId,commentText: values.comment,userId:currentUserId,path:pathname})
    form.reset();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form  item-center">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
              <FormItem className="flex w-full items-center gap-3">
                <FormLabel>
                <Image src={currentUserImg} alt='user image' height={50} width={50} className=' rounded-full'/>
                </FormLabel>
              <FormControl>
                <Input
                  placeholder="Add comment...."
                  {...field}
                  className=" no-focus border-none bg-dark-1 text-white"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className=" comment-form_btn">
          reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
