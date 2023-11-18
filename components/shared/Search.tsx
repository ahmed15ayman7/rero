import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchAllUser } from "@/lib/actions/user.actions";
import React, { useState } from "react";
import CommunityCard from "../cards/CommunityCard";
import UserCard from "../cards/UserCard";
import { Input } from "../ui/input";

const Search = ({
  typeS,
}: {
  typeS: string;
}) => {
  
  const [resultU, setResultU] = useState<{ users: any[]; isNext: boolean }>(
    { users: [], isNext: false }
  );
  const [resultC, setResultC] = useState<{ communities: any[]; isNext: boolean }>(
    { communities: [], isNext: false }
  );
  let handelOnFocus = async (e: string) => {
   try{ 
    if (typeS==='user') {
      if (e.trim() === "") {
        let result = await fetchAllUser({
          searchString: "",
          pageNum: 1,
          pageSize: 30,
        });
        if (result !== undefined) {
          setResultU(result);
        }
      }
    }else if (typeS==='community') {
      if (e.trim() === "") {
      let result = await fetchCommunities({
        searchString: e,
        pageNumber: 1,
        pageSize: 30,
      });
      if (result !== undefined) {
        setResultC(result);
      }
    }
    }
  }catch(e:any) {
    console.log('faild to fetch on focus', e);
  }
  };
  let handelOnChange = async (e: string) => {
    try {
      if (typeS==='user') {
        
          let result = await fetchAllUser({
            searchString: "",
            pageNum: 1,
            pageSize: 30,
          });
          if (result !== undefined) {
            setResultU(result);
          }
        
      }else if (typeS==='community') {
        let result = await fetchCommunities({
          searchString: e,
          pageNumber: 1,
          pageSize: 30,
        });
        if (result !== undefined) {
          setResultC(result);
        }
      }
    } catch (e: any) {
      console.log("faild to search", e);
    }
  };
  return (
    <section className="">
      <div className=" text-white">{typeS==='user'?'Search':'Communities'}</div>
      <div className="w-full mt-3">
        <Input
          placeholder="Enter name or username"
          className=" account-form_input "
          onChange={(e) => handelOnChange(e.target.value)}
          onFocus={(e) => handelOnFocus(e.target.value)}
        />
      </div>
      
    <div className={` mt-14 flex flex-1   ${typeS==='community'?' justify-evenly max-sm:flex-col gap-7':'flex-col gap-9' }`}>
      {typeS==='user' ?(resultU?.users.length === 0 ? (
        <h1>no result</h1>
        ) : (
          resultU?.users.map((person: any) => (
          <UserCard
          key={person.id}
          id={person.id}
          name={person.name}
          username={person.username}
          image={person.image}
          personType="User"
          />
          ))
          )):typeS==='community'?(resultC?.communities.length === 0 ? (
            <h1>no result</h1>
            ) : (
              resultC?.communities.map((community: any) => (
              <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              image={community.image}
              personType="community"
              members={community.members}
              />
              ))
              )):null}
    </div>
          </section>
  );
};

export default Search;
