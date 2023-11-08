"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import * as z  from 'zod'

import { Textarea } from '@/components/ui/textarea'
import { usePathname, useRouter } from 'next/navigation'
import { PostValidation } from '@/lib/validations/post'

import { createPost } from '@/lib/actions/post.actions'
const NewPost = ({userId}:{userId:string}) => {
    let pathname= usePathname()
 let router= useRouter()


    let form = useForm< z.infer<typeof PostValidation> >({
        resolver:zodResolver(PostValidation),
        defaultValues:{
            post:'',
            accountId:userId
        }
    });

   
   async function onSubmit(values: z.infer<typeof PostValidation>) {
          await createPost({text:values.post,author:userId,community:null,path:pathname})
          router.push('/')
        }
  return (
    <Form {...form}>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=' text-white'>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your post" {...field} className=' account-form_input ' rows={15} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <Button type="submit" className=' bg-primary-500 w-full'>Post</Button>
          </form>
          </Form>
  )
}

export default NewPost;