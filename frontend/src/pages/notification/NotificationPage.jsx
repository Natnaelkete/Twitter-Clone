import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import useQueriesCollections from "../../hooks/useQueriesCollections";
import useMutationsCollections from "../../hooks/useMutationsCollection";

const NotificationPage = () => {
  const { notification, isGettingNotification } = useQueriesCollections();
  const { deleteNotifications, isDeletingNotifications } =
    useMutationsCollections();

  const deleteNotification = () => {
    deleteNotifications();
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={deleteNotification}>
                  {isDeletingNotifications
                    ? "Deleting..."
                    : "Delete all notification"}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {isGettingNotification && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notification?.length === 0 && (
          <div className="text-center p-4 font-bold">No notification 🤔</div>
        )}
        {notification?.map((notifications) => (
          <div className="border-b border-gray-700" key={notifications._id}>
            <div className="flex gap-2 p-4">
              {notifications.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notifications.type === "like" && (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}
              <Link to={`/profile/${notifications.from.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notifications.from.profileImg ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notifications.from.username}
                  </span>{" "}
                  {notifications.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
