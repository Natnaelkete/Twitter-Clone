import { Navigate } from "react-router-dom";
import useQueriesCollections from "../hooks/useQueriesCollections";
import LoadingSpinner from "./common/LoadingSpinner";

function PrivateRoute({ children }) {
  const { myProfile, isGettingMyProfile } = useQueriesCollections();

  if (isGettingMyProfile) {
    return (
      <div className="h-screen flex items-center max-w-6xl mx-auto">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (myProfile) {
    localStorage.setItem(
      "et-twit_add/info/get...",
      JSON.stringify(myProfile._id)
    );
  }
  const authUser = JSON.parse(localStorage.getItem("et-twit_add/info/get..."));

  return authUser ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
