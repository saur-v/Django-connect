import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FiCompass,
  FiSearch,
  FiPlusCircle,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiUserPlus,
  FiHome,
} from 'react-icons/fi';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('access_token'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('access_token'));
    setUsername(localStorage.getItem('username'));
  }, [location]);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" title="Home">
        <FiHome className="text-2xl text-blue-600 hover:text-blue-800 transition" />
      </Link>


      <div className="flex items-center gap-5">
        {isAuth ? (
          <>
            {/* Explore */}
            <Link to="/explore" title="Explore">
              <FiCompass className="text-2xl text-yellow-500 hover:text-yellow-600 transition" />
            </Link>

            {/* Search */}
            <Link to="/search" title="Search">
              <FiSearch className="text-2xl text-purple-500 hover:text-purple-600 transition" />
            </Link>

            {/* Create */}
            <Link to="/create" title="Create">
              <FiPlusCircle className="text-2xl text-green-500 hover:text-green-600 transition" />
            </Link>

            {/* Profile */}
            {username && (
              <Link to={`/profile/${username}`} title="Profile">
                <FiUser className="text-2xl text-gray-600 hover:text-gray-800 transition" />
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              title="Logout"
            >
              <div className="flex items-center gap-2">
                <FiLogOut />
                Logout
              </div>
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <Link to="/login" title="Login">
              <FiLogIn className="text-2xl text-blue-500 hover:text-blue-600 transition" />
            </Link>

            {/* Register */}
            <Link to="/register" title="Register">
              <FiUserPlus className="text-2xl text-blue-500 hover:text-blue-600 transition" />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
