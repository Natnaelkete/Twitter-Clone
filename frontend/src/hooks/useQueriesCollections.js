import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Suggested, getFollowing, getMyProfile } from "../services/api";

function useQueriesCollections() {
  // Get SuggestedUsers
  const { data: suggestedUsers, isLoading: isGettingSuggestion } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: Suggested,
    onError: (err) => toast.error(err.response.data.message),
  });

  // Get currentUser Profile
  const { data: myProfile, isLoading: isGettingMyProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    onError: (err) => toast.error(err.response.data.message),
  });

  // Get Following users
  const { data: following, isLoading: isGettingFollowing } = useQuery({
    queryKey: ["following"],
    queryFn: getFollowing,
    onError: (err) => toast.error(err.response.data.message),
  });

  return {
    suggestedUsers,
    isGettingSuggestion,
    myProfile,
    isGettingMyProfile,
    following,
    isGettingFollowing,
  };
}

export default useQueriesCollections;
