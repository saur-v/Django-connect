import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { FiUser } from 'react-icons/fi';

export default function Followers() {
  const { username } = useParams();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    axios
      .get(`/users/${username}/followers/`)
      .then((res) => setFollowers(res.data))
      .catch((err) => console.error(err));
  }, [username]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        👥 Followers of @{username}
      </h2>

      {followers.length === 0 ? (
        <p className="text-gray-500 text-sm">No followers yet.</p>
      ) : (
        <div className="space-y-3">
          {followers.map((follow) => (
            <Link
              key={follow.id}
              to={`/profile/${follow.follower.username}`}
              className="flex items-center gap-3 p-3 bg-white shadow rounded hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">
                <FiUser />
              </div>
              <span className="font-medium text-gray-800">
                @{follow.follower.username}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
