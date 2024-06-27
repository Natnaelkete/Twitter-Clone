import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreatePosts,
  DeletePosts,
  Follow,
  Login,
  Logout,
  Signup,
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
    onError: (err) => toast.error(err.response.data.message),
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
  };
}

export default useMutationsCollections;
