import { useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(`/users/search/?q=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔍 Search Users</h2>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="space-y-2">
        {results.length === 0 && query && (
          <p className="text-gray-500">No users found.</p>
        )}
        {results.map((user) => (
          <Link
            key={user.id}
            to={`/profile/${user.username}`}
            className="block p-2 border rounded hover:bg-gray-100"
          >
            @{user.username}
          </Link>
        ))}
      </div>
    </div>
  );
}
