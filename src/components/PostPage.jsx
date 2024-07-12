import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { editPost } from "../store/PostSlice";
import { useDispatch } from "react-redux";
import { api } from "../api";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const PostPage = ({ posts, handleDelete }) => {
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [edit, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const handleDeleteClick = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      await handleDelete(postId);
      setIsDeleting(false);
      Toast.fire({
        icon: "success",
        title: "Post deleted successfully",
      });
      navigate("/");
    }
  };
  const handleSaveClick = async () => {
    try {
      await api.patch(`/posts/${post.id}`, {
        title,
        body,
      });
      dispatch(editPost({ ...post, title, body }));
    } catch (error) {}
    if (edit) {
      dispatch(editPost({ id: post.id, title, body }));
      navigate("/");
    }
    setEditing(!edit);
  };

  return (
    <main className="PostPage">
      <article className="post">
        {post ? (
          <>
            {edit ? (
              <form>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  name={"title"}
                  type="text"
                  className="form-control"
                  placeholder="Enter title"
                />
                <textarea
                  name={"body"}
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  className="form-control"
                  placeholder="Enter body"
                />
              </form>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p className="postDate">{post.datetime}</p>
                <p className="postBody">{post.body}</p>
              </>
            )}
            <button
              onClick={() => handleDeleteClick(post.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "In Progress" : "Delete Post"}
            </button>
            <button
              style={{ background: "grey" }}
              onClick={() => {
                handleSaveClick();
              }}
            >
              {edit ? "Save" : "Edit"}
            </button>
            <button
              style={{ background: "grey" }}
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to="/">Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
