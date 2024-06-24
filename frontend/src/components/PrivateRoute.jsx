import { Navigate } from "react-router-dom";
import useQueriesCollections from "../hooks/useQueriesCollections";
// import LoadingSpinner from "./common/LoadingSpinner";

function PrivateRoute({ children }) {
  const { myProfile,  } = useQueriesCollections();

  return myProfile ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
