import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const res = await axios.get('/posts/explore/');
        setPosts(res.data);
      } catch (err) {
        console.error('Error fetching explore posts:', err);
      }
    };
    fetchExplorePosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like/`);
      const updated = await axios.get(`/posts/${postId}/`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? updated.data : p))
      );
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text) return;

    try {
      await axios.post(`/posts/${postId}/comment/`, { text });
      const updated = await axios.get(`/posts/${postId}/`);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? updated.data : p))
      );
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {!selectedPostId && (
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          🌍 Explore
        </h1>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posts.map((post) =>
          selectedPostId === post.id ? (
            <div
              key={post.id}
              className="col-span-2 md:col-span-4 flex flex-col sm:flex-row bg-white rounded-xl shadow-lg overflow-hidden border"
            >
              {/* Left: Image */}
              <div className="w-full sm:w-1/2">
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Details */}
              <div className="w-full sm:w-1/2 p-4 flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                  <div className="text-blue-700 font-semibold text-sm">
                    @{post.author?.username}
                  </div>
                  <button
                    onClick={() => setSelectedPostId(null)}
                    className="text-gray-500 hover:text-black text-lg"
                  >
                    ✖
                  </button>
                </div>

                <p className="text-gray-800 text-sm">{post.caption}</p>

                <div className="flex items-center justify-between text-sm">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ❤️ Like
                  </button>
                  <span className="text-gray-600">
                    {post.likes_count || 0} likes
                  </span>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1 text-sm text-gray-700">
                  {post.comments?.map((comment) => (
                    <div key={comment.id}>
                      <strong>@{comment.user.username}</strong>: {comment.text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    placeholder="Write a comment..."
                    className="flex-1 border rounded p-2 text-sm"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-right">
                  Posted on {new Date(post.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div
              key={post.id}
              onClick={() => setSelectedPostId(post.id)}
              className="cursor-pointer aspect-square overflow-hidden bg-gray-100 rounded shadow hover:shadow-md transition"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-600 p-2 text-center">
                  {post.caption.slice(0, 80)}...
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
