import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  GetUserProfile,
  Suggested,
  getFollowing,
  getMyProfile,
  getPosts,
} from "../services/api";

function useQueriesCollections(username) {
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

  // Get All Posts
  const { data: posts, isLoading: isGettingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    onError: (err) => toast.error(err.response.data.message),
  });

  // Get Users Profile
  const { data: userProfile, isLoading: isGettingUserProfile } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: ({ username }) => {
      GetUserProfile(username);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  return {
    suggestedUsers,
    isGettingSuggestion,
    myProfile,
    isGettingMyProfile,
    following,
    isGettingFollowing,
    posts,
    isGettingPosts,
    userProfile,
    isGettingUserProfile,
  };
}

export default useQueriesCollections;
