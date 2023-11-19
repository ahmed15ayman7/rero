"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import * as z  from 'zod'
import { useOrganization } from '@clerk/nextjs'
import { Textarea } from '@/components/ui/textarea'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PostValidation } from '@/lib/validations/post'

import { createPost } from '@/lib/actions/post.actions'
import Image from 'next/image'
const NewPost = ({userId,image,name,username}:{userId:string,image:string,name:string,username:string}) => {
    let pathname= usePathname()
 let router= useRouter()
 let {organization}= useOrganization();
let  p =useSearchParams();
let content=p.get('p')

    let form = useForm< z.infer<typeof PostValidation> >({
        resolver:zodResolver(PostValidation),
        defaultValues:{
            post:content?content:'',
            accountId:userId
        }
    });

   
   async function onSubmit(values: z.infer<typeof PostValidation>) {
    
          await createPost({text:values.post,author:userId,communityId:organization?organization.id:null,path:pathname})
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
              <FormLabel className='py-4 flex gap-4 text-white'>
                <Image src={image} alt={''} height={48} width={48} className={'rounded-full object-contain'}/>
                <div className=" flex flex-col gap-1">
                  <h4 className=' text-body-bold'>{name}</h4>
                  <p className=' text-gray-500 text-small-regular'>@{username}</p>
                </div>
              </FormLabel>
              <FormControl>
                <Textarea  placeholder="What are you thinking?" {...field} className=' account-form_input ' rows={8} />
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