import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import NewPost from '@/components/forms/NewPost';
const page = async () => {
    let user = await currentUser();
    if (!user) return null;
    const userInfo= await fetchUser(user.id);
    if (!userInfo?.onboarding) redirect('/onboarding');
  return (
    <div>
      
        <NewPost userId={`${userInfo?._id}`}/>
    </div>
  )
}

export default page