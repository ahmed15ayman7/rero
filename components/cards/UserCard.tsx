"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
interface props{
    id:string,
    name:string,
    username:string,
    image:string,
    personType:string
    
}
const UserCard = ({id,name,username,image,personType}:props) => {
    let navigate= useRouter();
  return (
  <article className='user-card'>
    <div className="user-card_avatar">
        <Image src={image} alt={name} height={48} width={48} className=' rounded-full object-contain'/>
            
            <div className=" flex-1 text-ellipsis">
                <h3 className=' text-base-semibold text-light-1'>{name}</h3>
                <p className=" text-small-semibold text-gray-1">@{username}</p>
            </div>
    </div>
    <Button className='user-card_btn' onClick={()=>navigate.push(`/profile/${id}`)}>view</Button>
  </article>
  )
}

export default UserCard