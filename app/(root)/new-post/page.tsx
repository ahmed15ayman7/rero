import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import NewPost from '@/components/forms/NewPost';
const Page = async () => {
    let user = await currentUser();
    if (!user) return redirect('/sign-in');
    const userInfo= await fetchUser(user.id);
    if (!userInfo?.onboarding) redirect('/onboarding');


  return (
    <div >
      
        <NewPost userId={`${userInfo?._id}`} image={userInfo?.image} name={userInfo?.name} username={userInfo?.username} />
    </div>
  )
}

export default Page