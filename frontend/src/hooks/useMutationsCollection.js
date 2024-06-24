import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Follow, Login, Logout, Signup } from "../services/api";
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
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  // Follow Users
  const { mutate: follow, isPending: isFollowing } = useMutation({
    mutationFn: ({ id }) => Follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["follow"]);
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
  };
}

export default useMutationsCollections;
