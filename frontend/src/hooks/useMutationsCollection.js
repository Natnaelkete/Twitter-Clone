import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CommentOnPost,
  CreatePosts,
  DeleteNotification,
  DeletePosts,
  Follow,
  Like,
  Login,
  Logout,
  Signup,
  UpdateProfile,
} from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function useMutationsCollections() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Signup
  const { mutate: signup, isPending: isSigningup } = useMutation({
    mutationFn: (formData) => Signup(formData),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      navigate("/", { replace: true });
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Login
  const { mutate: login, isPending: isLogging } = useMutation({
    mutationFn: (formData) => Login(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["loggedUser"]);
      navigate("/", { replace: true });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Invalid email or password");
      console.log("Invalid email or password");
    },
  });

  // Logout
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login");
      localStorage.removeItem("et-twit_add/info/get...");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Follow Users
  const { mutate: follow, isPending: isFollowing } = useMutation({
    mutationFn: (id) => Follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["follow"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Create Posts
  const {
    mutate: createPost,
    isPending: isCreatingPost,
    error,
  } = useMutation({
    mutationFn: (formData) => CreatePosts(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Posted");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Delete Posts
  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: (id) => DeletePosts(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Deleted");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Update Profile
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (formData) => UpdateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Updated");
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Comment on posts
  const { mutate: commentOnPost, isPending: isCommenting } = useMutation({
    mutationFn: ({ postId, text }) => CommentOnPost(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries(["comment"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Comment on posts
  const { mutate: like, isPending: isLiking } = useMutation({
    mutationFn: (id) => Like(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["like"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Delete all notification
  const { mutate: deleteNotifications, isPending: isDeletingNotifications } =
    useMutation({
      mutationFn: DeleteNotification,
      onSuccess: () => {
        queryClient.invalidateQueries(["notification"]);
      },
      onError: (err) => toast.error(err.response.data.message),
    });

  return {
    signup,
    isSigningup,
    login,
    isLogging,
    logout,
    isLoggingOut,
    follow,
    isFollowing,
    createPost,
    isCreatingPost,
    error,
    deletePost,
    isDeletingPost,
    updateProfile,
    isUpdatingProfile,
    commentOnPost,
    isCommenting,
    like,
    isLiking,
    deleteNotifications,
    isDeletingNotifications,
  };
}

export default useMutationsCollections;
