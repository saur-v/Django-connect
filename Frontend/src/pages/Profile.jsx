import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/users/${username}/`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axios.delete(`/posts/${postId}/`);
      fetchProfile();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleUpload = async () => {
    if (!profilePic) return alert('Please choose a file first.');
    const formData = new FormData();
    formData.append('profile_pic', profilePic);

    setUploading(true);
    setUploadSuccess(false);

    try {
      await axios.patch('/users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchProfile();
      setUploadSuccess(true);
      setProfilePic(null);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const toggleFollow = async () => {
    try {
      const action = profile.is_following ? 'unfollow' : 'follow';
      await axios.post(`/users/${username}/${action}/`);
      fetchProfile();
    } catch (err) {
      console.error(err);
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
      fetchProfile();
      setCommentInputs({ ...commentInputs, [postId]: '' });
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (!profile) return <div className="p-6 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow p-6 flex items-center gap-6">
        <img
          src={profile.profile_pic}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800">@{profile.user.username}</h2>
          <p className="text-sm text-gray-600 mt-1">
            <Link to={`/profile/${username}/followers`} className="hover:underline">
              {profile.followers_count} followers
            </Link>
            <span className="mx-1">·</span>
            <Link to={`/profile/${username}/following`} className="hover:underline">
              {profile.following_count} following
            </Link>
          </p>

          {!profile.is_self ? (
            <button
              onClick={toggleFollow}
              className={`mt-3 px-4 py-1 text-sm rounded-full font-medium shadow transition ${
                profile.is_following
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </button>
          ) : (
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="bg-gray-100 text-sm px-4 py-2 rounded cursor-pointer shadow hover:bg-gray-200 transition">
                Select Profile Pic
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="hidden"
                />
              </label>

              {profilePic && (
                <span className="text-xs text-gray-700 truncate max-w-xs">{profilePic.name}</span>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`px-4 py-2 text-sm font-medium rounded shadow transition ${
                  uploading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {uploading ? 'Uploading...' : 'Upload Pic'}
              </button>

              {uploadSuccess && (
                <span className="text-green-600 text-sm font-semibold">✓ Uploaded!</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      {profile.posts.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {profile.posts.map((post) =>
            selectedPostId === post.id ? (
              <div
                key={post.id}
                className="col-span-2 md:col-span-4 flex flex-col sm:flex-row bg-white rounded-xl shadow overflow-hidden border"
              >
                <div className="w-full sm:w-1/2">
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-full object-cover"
                  />
                </div>

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

                  <div className="space-y-1 text-sm text-gray-700 max-h-32 overflow-y-auto">
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

                  <p className="text-xs text-gray-400">
                    Posted on {new Date(post.created_at).toLocaleString()}
                  </p>

                  {post.author?.username === localStorage.getItem('username') && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      🗑 Delete
                    </button>
                  )}
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
      )}
    </div>
  );
}
