import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import useMutationsCollections from "../../hooks/useMutationsCollection";
import useQueriesCollections from "../../hooks/useQueriesCollections";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { createPost, isCreatingPost, error } = useMutationsCollections();
  const { myProfile } = useQueriesCollections();

  const imgRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("text", e.target.text.value);
    img.forEach((image) => {
      formData.append("images", image);
    });

    createPost(formData, {
      onSuccess: () => {
        setImg([]);
        setText("");
      },
    });
  };

  const handleImgChange = (e) => {
    const files = Array.from(e.target.files);
    setImg(files);
    const previewsArray = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewsArray);
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={myProfile?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img.length !== 0 && (
          <div className="relative w-full  flex flex-wrap gap-2">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg([]);
                imgRef.current.value = null;
              }}
            />
            {/* <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            /> */}
            {imagePreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                className=" rounded-full  object-contain mx-auto"
                style={{ width: "70px", height: "70px", objectFit: "cover" }}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            hidden
            ref={imgRef}
            multiple
            onChange={handleImgChange}
          />
          <button
            disabled={isCreatingPost}
            className="btn btn-primary rounded-full btn-sm text-white px-4"
          >
            {isCreatingPost ? "Posting..." : "Post"}
          </button>
        </div>
        {error && <div className="text-red-500">Something went wrong</div>}
      </form>
    </div>
  );
};
export default CreatePost;
