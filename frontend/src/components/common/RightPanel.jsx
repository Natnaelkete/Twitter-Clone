import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useQueriesCollections from "../../hooks/useQueriesCollections";
import useMutationsCollections from "../../hooks/useMutationsCollection";
import toast from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";
// import { useState } from "react";

const RightPanel = () => {
  // const [followingUserId, setFollowingUserId] = useState('')
  // const [followedUserId, setFollowedUserId] = useState([])
  const { suggestedUsers, isGettingSuggestion } = useQueriesCollections();
  const { follow, isFollowing } = useMutationsCollections();
  // const check = followedUserId.some((user)=> user._id === followingUserId)

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isGettingSuggestion && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isGettingSuggestion &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id, {
                        onSuccess: (data) => {
                          // setFollowedUserId(data)
                          toast.success(`${user.username} ${data.message}`);
                        },
                      });
                    }}
                  >
                    {isFollowing ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
