import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { FiUserCheck } from 'react-icons/fi';

export default function Following() {
  const { username } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    axios
      .get(`/users/${username}/following/`)
      .then((res) => setFollowing(res.data))
      .catch((err) => console.error(err));
  }, [username]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        🔗 @{username} is Following
      </h2>

      {following.length === 0 ? (
        <p className="text-gray-500 text-sm">Not following anyone yet.</p>
      ) : (
        <div className="space-y-3">
          {following.map((follow) => (
            <Link
              key={follow.id}
              to={`/profile/${follow.following.username}`}
              className="flex items-center gap-3 p-3 bg-white shadow rounded hover:bg-gray-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
                <FiUserCheck />
              </div>
              <span className="font-medium text-gray-800">
                @{follow.following.username}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
