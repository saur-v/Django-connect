import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import SuggestedUsers from '../components/SuggestedUsers';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('posts/feed/');
      setPosts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
      } else {
        console.error(err);
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like/`);
      fetchPosts();
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
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Feed 📰</h2>

      {posts.length === 0 ? (
        <>
          <p className="text-gray-500">No posts yet. Follow users to see their posts.</p>
          <SuggestedUsers />
        </>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow p-4">
            <div className="font-bold text-lg text-blue-600 mb-2">
              {post.author.username}
            </div>

            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="rounded mb-3 w-full object-cover"
              />
            )}

            <p className="text-gray-800 mb-2">{post.caption}</p>

            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => handleLike(post.id)}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ❤️ Like
              </button>
              <span className="text-sm text-gray-600">
                {post.likes_count || 0} likes
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="text-sm text-gray-700">
                  <span className="font-semibold">{comment.user.username}:</span>{' '}
                  {comment.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
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
          </div>
        ))
      )}
    </div>
  );
}
