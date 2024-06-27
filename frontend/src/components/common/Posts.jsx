import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import useQueriesCollections from "../../hooks/useQueriesCollections";

const Posts = () => {
  const { posts, isGettingPosts } = useQueriesCollections();
  return (
    <>
      {isGettingPosts && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isGettingPosts && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isGettingPosts && posts && (
        <div className="w-full">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
