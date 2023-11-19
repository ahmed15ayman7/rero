'use client'
import { addMemberToCommunity } from "@/lib/actions/community.actions";
import { addFriend, UserData} from "@/lib/actions/user.actions";
import Image from "next/image";
import { usePathname,useRouter } from "next/navigation";

export let SugCard=({result,type,userInfo}:{result:any[]|undefined,type:string,userInfo:UserData|null|undefined})=>{
    let navigate = useRouter();
    let pathname = usePathname();
    let handleAddMember=async(type:string,accountId:string,myId:string|undefined,isFriend:boolean)=>{
        type==='users'?await addFriend({
          finalF: "activity",
          finalU: "sended",
          friendId: accountId,
          userId: myId,
          path: pathname,
          isFriend:isFriend
        }): await addMemberToCommunity(accountId,myId,pathname,isFriend);
      }
    return(
      <div className=" flex flex-col gap-6 w-full scroll-auto">
          {result?.map(result=>{
            let isSubscribed :boolean=false,isFriend :boolean=false;
            if (type==='users') {
              isFriend=userInfo?.friends.filter(e=>e.id===result?.id).length ===1;
            }else if(type==="communities"){
                if(userInfo?.communities!==undefined)
              isSubscribed=(userInfo?.communities.filter((e:string) => e.toString() ===result?._id).length) >= 1;
            }
            let checked=type==='users'?isFriend:isSubscribed;
            let route=type==='users'?`/profile/${result?.id}`:`/communities/${result?.id}`
            return (
              <article className='user-card'>
                <div className="user-card_avatar">
                <Image src={result?.image} alt={result?.name} height={48} width={48} className=' cursor-pointer rounded-full object-contain' onClick={()=>navigate.push(route)}/>
            <div className=" flex-1 text-ellipsis">
                <h3 className=' text-base-semibold text-light-1'>{result?.name}</h3>
                <p className=" text-small-semibold text-gray-1">@{result?.username}</p>
            </div>
            <button
              className="flex no-underline gap-4 cursor-pointer"
              onClick={()=>handleAddMember(type,result?._id,userInfo?._id,checked)}>
                {
              <Image
              src={checked?"/assets/user-true.svg":"/assets/user-plus.svg"}
              alt="add friend"
              className=""
              width={24}
              height={24}
              />
            }
            </button>
    </div>
  </article>
            )
          })}
        </div>
    )
  }