import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { addPost, deletePost, addPosts } from "./store/PostSlice";
import { api } from "./api";

function App() {
  const posts = useSelector((state) => state.postsReducer.posts);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/posts");
        dispatch(addPosts(response.data));
      } catch (error) {
        setError(error.massage);
      } finally {
        setLoading(false);
      }
    }
    setTimeout(() => {
      fetchPosts();
    }, 2000);
  }, []);

  useEffect(() => {
    if (Array.isArray(posts) && posts.length > 0) {
      const filteredResults = posts.filter((post) => {
        const bodyIncludesSearch = post.body
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const titleIncludesSearch = post.title
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return bodyIncludesSearch || titleIncludesSearch;
      });

      setSearchResults(filteredResults.reverse());
    } else {
      setSearchResults([]);
    }
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lastId = posts.length ? Number(posts[posts.length - 1].id, 10) : 0;
    const id = isNaN(lastId) ? 1 : lastId + 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = {
      id: String(id),
      title: postTitle,
      datetime,
      body: postBody,
    };
    try {
      await api.post("/posts", newPost);
      dispatch(addPost(newPost));
      navigate("/");
    } catch (error) {
      setError(error.message);
    }

    setPostTitle("");
    setPostBody("");
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      dispatch(deletePost(id));
      navigate("/");
    } catch (error) {
      setError(error.massage);
    }
  };
  return (
    <div className="App">
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      {loading && <p className="loader"></p>} {error && <p>Error:{error}</p>}
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />
        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path="/post/:id"
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
