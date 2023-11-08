'use client'
import { SidebarLinks } from '@/constants/icons'
import { SignedIn, SignOutButton,useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const LeftSidebar = () => {
  let pathname= usePathname();
  let router = useRouter();
  let {userId} = useAuth();
  return (
    <section className='leftsidebar'>
      <div className=" flex flex-col gap-2 px-6 mb-auto">
      {SidebarLinks.map((link, index) =>{
        if(link.route==='/profile') link.route=`/profile/${userId}`
        let isActive=(pathname.includes(link.route)&&link.route.length>1)||pathname === link.route;
        return(
          <Link key={index} href={link.route} className={`leftsidebar_link ${isActive && ' bg-primary-500'}`}>
            <Image src={link.imgURL} alt={link.label}  height={24} width={24}/>
            <span className=' text-white max-lg:hidden'>{link.label}</span>
          </Link>
        )
      }
      )}
        </div>
        <div className=" px-6">
          <SignedIn>
            <SignOutButton signOutCallback={()=>router.push('/sign-in')}>
              <div className="flex gap-4 cursor-pointer">
                <Image src='/assets/logout.svg' alt='logout' width={24} height={24}/>
                <span className=' text-white  max-lg:hidden'>logout</span>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
    </section>
  )
}

export default LeftSidebar