import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { BsFillImageFill, BsImage } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";

import { isLogged } from "../../auth";
import "./post.css";

const Posts = () => {
  const user = isLogged();

  const [newPost, setNewPost] = useState({
    content: "",
    imgURL: "",
  });

  const sendPost = async () => {
    const formData = new FormData();
    formData.append("userId", user.userId);
    formData.append("content", newPost.content);
    formData.append("image", newPost.imgURL);

    if (newPost.content !== "" && newPost.imgURL !== "") {
      const post = await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    }

    getAllPosts();
  };

  const [allPosts, setallPosts] = useState();

  const getAllPosts = async () => {
    const data = await axios.get("http://localhost:5000/api/posts", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setallPosts(data.data);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const [edit, setEdit] = useState(false);
  const [id, setId] = useState();

  const [editPost, setEditPost] = useState({});

  const modifyPost = async (postId) => {
    console.log(editPost)
    const formData = new FormData();
    formData.append("content", editPost.content);
    if(editPost.imgURL){
      formData.append("image", editPost.imgURL);
    }
    

    const post = await axios.put(
      `http://localhost:5000/api/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    setEdit(false);
    setId("");
    setEditPost({});

    getAllPosts();
  };

  const deletePost = async (postId) => {
    const post = await axios.delete(
      `http://localhost:5000/api/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    getAllPosts();
  };

  const likePost = async (postId) => {
    await axios.post(
      `http://localhost:5000/api/posts/${postId}/like`,
      {
        userId: user.userId,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    getAllPosts();
  };

  return (
    <>
      <div className="new">
        <div className="container">
          <div className="new-content">
            <span>Status</span>
            <input
              name="post"
              placeholder="wrtie Your Post"
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            />
            <div className="info">
              <label htmlFor="image">
                <span>
                  <BsFillImageFill />
                </span>
              </label>
              <input
                id="image"
                type="file"
                name="file"
                onChange={(e) =>
                  setNewPost({ ...newPost, imgURL: e.target.files[0] })
                }
              />
              <button onClick={sendPost}>Post</button>
            </div>
          </div>
        </div>
      </div>
      <div className="posts">
        <div className="container">
          {allPosts &&
            allPosts.map((post, index) => {
              return (
                <>
                  {edit && id === post._id ? (
                    // edit Code
                    <div className="post-info" key={index}>
                      <div className="user">
                        <div className="user-info">
                          <img src="images/download.jfif" alt="" />
                          <div className="user-info-info">
                            <h3>
                              {post.userId?.firstName} {post.userId?.lastName}
                            </h3>
                          </div>
                        </div>
                        <div className="post-det">
                          <span>
                            <button
                              className="save"
                              onClick={() => modifyPost(post._id)}
                            >
                              Save Changes
                            </button>
                            <button
                              className="cancel"
                              onClick={() => setEdit(false)}
                            >
                              cancel
                            </button>
                          </span>
                        </div>
                      </div>
                      <div className="post">
                        <input
                          defaultValue={post.content}
                          onChange={(e) =>
                            setEditPost({
                              ...editPost,
                              content: e.target.value,
                            })
                          }
                        />
                        <div className="image-edit img-error">
                          <div className="add-pic">
                            <label htmlFor="img">
                              <BsImage />
                              <span> add Photo</span>
                            </label>
                            <input
                              type="file"
                              id="img"
                              onChange={(e) =>
                                setEditPost({
                                  ...editPost,
                                  imgURL: e.target.files[0],
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Posts Code
                    <div className="post-info" key={index}>
                      <div className="user">
                        <div className="user-info">
                          <img src="images/download.jfif" alt="" />
                          <div className="user-info-info">
                            <h3>
                              {post.userId?.firstName} {post.userId?.lastName}
                            </h3>
                          </div>
                        </div>
                        {user.userId === post.userId?._id ||
                        user.isAdmin === "true" ? (
                          <div className="post-det">
                            <span
                              className="edit"
                              onClick={() => {
                                setId(post._id);
                                setEdit(true);
                                setEditPost({
                                  ...editPost,
                                  content: post.content,
                                })
                              }}
                            >
                              <FiEdit />
                            </span>
                            <span
                              className="delete"
                              onClick={() => deletePost(post._id)}
                            >
                              <MdDelete />
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="post">
                        <p>{post.content}</p>
                        {post.image && <img src={post.image} alt="not found" />}
                      </div>
                      <div className="post-reactions">
                        <div className="likes">
                          <span className="likes-count">
                            {post.likes} likes
                          </span>
                        </div>
                      </div>
                      <div className="features">
                        <div
                          className={
                            post.usersLiked.includes(user.userId)
                              ? "like like-done"
                              : "like"
                          }
                          onClick={() => likePost(post._id)}
                        >
                          <AiFillLike />
                          Like
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Posts;
