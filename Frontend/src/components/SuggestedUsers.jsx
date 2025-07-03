import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("users/suggested/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching suggested users:', err);
      }
    };

    fetchSuggestions();
  }, []);

  if (users.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-lg font-semibold mb-3">Suggested People</h3>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-3">
            <img
              src={user.profile_pic || '/default-avatar.png'} // fallback if no profile_pic
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <Link to={`/profile/${user.user.username}`} className="text-blue-600 hover:underline font-medium">
              @{user.user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
