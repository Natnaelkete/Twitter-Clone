import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  GetDataFromEndpoints,
  GetNotification,
  GetUserProfile,
  Suggested,
  getFollowing,
  getMyProfile,
  getPosts,
} from "../services/api";

function useQueriesCollections({ POST_ENDPOINT, username } = {}) {
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
    queryFn: () => GetUserProfile(username),
    enabled: !!username,
    onError: (err) =>
      toast.error(err.response?.data?.message || "An error occurred"),
  });

  // Get Data from the different endpoints
  const { data: getData, isLoading: isGettingData } = useQuery({
    queryKey: ["userData", POST_ENDPOINT],
    queryFn: () => GetDataFromEndpoints(POST_ENDPOINT),
    enabled: !!POST_ENDPOINT,
    onError: (err) =>
      toast.error(err.response?.data?.message || "An error occurred"),
  });

  // Get All Posts
  const { data: notification, isLoading: isGettingNotification } = useQuery({
    queryKey: ["notification"],
    queryFn: GetNotification,
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
    getData,
    isGettingData,
    notification,
    isGettingNotification,
  };
}

export default useQueriesCollections;
