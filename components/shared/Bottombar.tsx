import { SidebarLinks } from '@/constants/icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Bottombar = () => {
  return (
    <section className='bottombar'>
     <div className="bottombar_container">
      {SidebarLinks.map((link, index) => (
        <Link key={index} href={link.route} className='bottombar_link'>
            <Image src={link.imgURL} alt={link.label}  height={24} width={24}/>
            <span className=' hidden sm:block'>{link.label.split(/\s+/)[0]}</span>
          </Link>
        )
        )}
        </div>
    </section>
  )
}

export default Bottombar