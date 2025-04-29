import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlusCircle, FaSignOutAlt } from 'react-icons/fa';
import UploadModal from './UploadModal';

export default function Navbar() {
  const { isAuthenticated, logout, currentUser, token, permissions } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Debug the auth state
  console.log('Navbar render - Auth state:', { 
    token: !!token, 
    tokenValue: token ? token.substring(0, 10) + '...' : 'no token',
    isAuthenticated, 
    currentUser: currentUser ? JSON.stringify(currentUser).substring(0, 50) + '...' : 'no user'
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
    navigate('/');
  };
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10 shadow-sm">
      <div className="max-w-5xl flex items-center justify-between mx-auto p-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-pink-600 tracking-tight">VideoGram</span>
        </Link>
        
        {/* Main Navigation Bar */}
        <div className="flex items-center space-x-4">
          {isAuthenticated && permissions.canUpload && 
            <button 
              onClick={openModal} 
              className="flex items-center text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-4 py-2 text-center transition duration-200"
            >
              <FaPlusCircle className="h-5 w-5 mr-2" />
              Upload
            </button>
          }
          
          {/* Logout Button - Always visible */}
          {isAuthenticated && <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-4 py-2 text-center transition duration-200 disabled:opacity-70 flex items-center ml-2"
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin -ml-1 mr-2 h-4 w-4 text-white">
                  <FaSignOutAlt />
                </div>
                Logging out...
              </>
            ) : (
              <>
                <FaSignOutAlt className="mr-2" />
                Logout
              </>
            )}
          </button>}
        </div>
      </div>
    </nav>
    
    {/* Use the reusable UploadModal component */}
    <UploadModal isOpen={isModalOpen} onClose={closeModal} />
  </>);
}
