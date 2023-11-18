import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchAllUser, fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { SugCard } from "../cards/sugCard";

const RightSidebar = async () => {

  let user = await currentUser();
  let userInfo = await fetchUser(user?.id);
  let users = await fetchAllUser({
    searchString: "",
    pageNum: 1,
    pageSize: 30,
  });
  let communities = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 30,
  });

  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className=" text-heading4-medium text-light-1 mb-6">
          Suggested Communities
        </h3>
        
          {/* @ts-ignore */}
          <SugCard
          result={communities?.communities}
            userInfo={userInfo}
            type={"communities"}
          />
 
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className=" text-heading4-medium text-light-1 mb-6">Suggested User</h3>

          {/* @ts-ignore */}
          <SugCard result={users?.users}  userInfo={userInfo} type={"users"} />
      </div>
    </section>
  );
};

export default RightSidebar;
