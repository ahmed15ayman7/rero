import * as z from "zod";

export const PostValidation = z.object({
  post: z.string().nonempty().min(3,{message:"minimum 3 characters required"}),
  accountId: z.string(),
});
export const CommentValidation = z.object({
  comment: z.string().nonempty().min(3,{message:"minimum 3 characters required"}),
});
