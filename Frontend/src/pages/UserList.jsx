import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function UserList({ type }) {
  const { username } = useParams();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`/users/${username}/${type}/`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, [username, type]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {type === 'followers' ? 'Followers of' : 'Following by'} @{username}
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((follow) => (
            <li key={follow.id} className="border p-2 rounded">
              <Link to={`/profile/${type === 'followers' ? follow.follower.username : follow.following.username}`}>
                @{type === 'followers' ? follow.follower.username : follow.following.username}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
