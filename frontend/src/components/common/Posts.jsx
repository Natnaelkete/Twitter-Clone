import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import useQueriesCollections from "../../hooks/useQueriesCollections";

const Posts = ({ feedType, username }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${username}`;
      case "likes":
        return `/api/posts/like`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { getData, isGettingData } = useQueriesCollections({ POST_ENDPOINT });
  return (
    <>
      {isGettingData && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isGettingData && getData?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isGettingData && getData && (
        <div className="w-full">
          {getData?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
