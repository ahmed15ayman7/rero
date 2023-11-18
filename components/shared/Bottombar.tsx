'use client'
import { SidebarLinks } from '@/constants/icons'
import { useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import React from 'react'

const Bottombar = () => {
  let pathname= usePathname();
  let {userId} = useAuth();
  return (
    <section className='bottombar'>
     <div className="bottombar_container">
      {SidebarLinks.map((link, index) => {
        if(link.route==='/profile') link.route=`/profile/${userId}`
        
        let isActive=(pathname.includes(link.route)&&link.route.length>1)||pathname === link.route;
        return(
        <Link key={index} href={link.route} className={`bottombar_link ${isActive && ' bg-primary-500'}`}>
            <Image src={link.imgURL} alt={link.label}  height={24} width={24}/>
            <span className=' text-white hidden sm:block'>{link.label.split(/\s+/)[0]}</span>
          </Link>
        )}
        )}
        </div>
    </section>
  )
}

export default Bottombar