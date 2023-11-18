"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
interface props{
    id:string,
    name:string,
    username:string,
    image:string,
    personType:string
    members:{
      _id:string,
      id:string,
      usernames:string,
      name:string,
      image:string,
    }[]
}
const CommunityCard = ({id,name,username,image,personType,members}:props) => {
    let navigate= useRouter();
  return (
  <article className='community-card'>
    <div className="community-card_avatar">
        <Image src={image} alt={name} height={60} width={60} className=' rounded-full object-contain'/>
            
            <div className=" flex-1 text-ellipsis">
                <h5 className=' text-base-semibold text-light-1'>{name}</h5>
                <p className=" text-small-semibold text-gray-1">@{username}</p>
            </div>
    </div>
    <div className="flex justify-between w-full">
    <Button className='community-card_btn' onClick={()=>navigate.push(`/communities/${id}`)}>view</Button>
    <div className="w-3/5 flex justify-end overflow-hidden">
    {members !==undefined &&<p className="rounded-full text-white justify-center items-center flex bg-primary-500" style={{width:'30px',height:'30px',zIndex:'400',border:'1px solid #ffffff',opacity:'.7'}}>+{members?.length}</p>}
    {members !==undefined && members.map((member, index) => {
            if (index>4) {
              return null
            }
            return (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={30}
                height={30}
                style={{zIndex:`${399-index}`}}
                className={`-ml-4 rounded-full object-cover`}
              />
            );
          })}
    </div>
    </div>
  </article>
  )
}

export default CommunityCard