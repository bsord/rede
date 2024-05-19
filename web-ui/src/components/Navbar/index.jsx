import { useAuthenticatedUser, useLogout } from '../../features/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCog, faListUl, faPlus, faUser, faBars } from '@fortawesome/free-solid-svg-icons';

const AuthenticatedMenu = ({ user, navigate }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const logout = useLogout();

  const getEmailPrefix = (email) => {
    return email ? email.split('@')[0] : '';
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      menuButtonRef.current &&
      !menuButtonRef.current.contains(event.target)
    ) {
      setMenuVisible(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
      setUserMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Add touchstart event listener

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside); // Remove touchstart event listener
    };
  }, [menuVisible, userMenuVisible]);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuVisible((prev) => !prev);
  };

  const toggleUserMenu = (event) => {
    event.stopPropagation();
    setUserMenuVisible((prev) => !prev);
  };

  return (
    <>
      <div className="hidden md:flex items-center space-x-4">
        <button className="flex items-center px-4 py-3 text-lg text-gray-200 hover:bg-gray-800 rounded-md" onClick={() => navigate('/subscriptions/new')}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create
        </button>
        <button className="flex items-center px-4 py-3 text-lg text-gray-200 hover:bg-gray-800 rounded-md" onClick={() => navigate('/subscriptions')}>
          <FontAwesomeIcon icon={faListUl} className="mr-2" /> Subscriptions
        </button>
        <div className="relative border-l border-gray-500 mx-4 pl-4">
          <button
            onMouseDown={toggleUserMenu}
            className={`flex items-center px-6 py-3 text-lg text-gray-200 rounded-md hover:bg-gray-800 ${userMenuVisible ? 'bg-gray-800' : ''}`}
          >
            {getEmailPrefix(user.email)}
            <FontAwesomeIcon icon={faUser} className="ml-2" />
          </button>
          {userMenuVisible && (
            <div ref={userMenuRef} className="absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 w-max" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
              <div className="py-1" role="none">
                <div className="flex items-center px-4 py-2 min-w-0">
                  <img className="h-10 w-10 rounded-full" src="https://via.placeholder.com/100" alt="User Avatar" />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{getEmailPrefix(user.email)}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100"></div>
                <a href="#" className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 w-full" role="menuitem" tabIndex="-1">
                  <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
                </a>
                <div className="border-t border-gray-100"></div>
                <a href="#" className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 w-full" role="menuitem" tabIndex="-1" onClick={() => logout.mutate()}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2 text-red-800" /> Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <button ref={menuButtonRef} onClick={toggleMenu} className="cursor-pointer p-2">
          <FontAwesomeIcon icon={faBars} className={`text-white w-6 h-6 transition-transform transform ${menuVisible ? 'rotate-90 text-blue-500' : 'rotate-0'}`} />
        </button>
        {menuVisible && (
          <div ref={menuRef} className="origin-top-right absolute right-0 w-full mt-4 rounded-b-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
            <div className="py-1" role="none">
              <a href="#" className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" onClick={() => navigate('/subscriptions/new')}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create
              </a>
              <a href="#" className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" onClick={() => navigate('/subscriptions')}>
                <FontAwesomeIcon icon={faListUl} className="mr-2" /> Subscriptions
              </a>
              <div className="flex items-center px-4 py-2 border-t border-gray-100">
                <img className="h-10 w-10 rounded-full" src="https://via.placeholder.com/100" alt="User Avatar" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{getEmailPrefix(user.email)}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className='flex flex-row'>
                <a href="#" className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1">
                  <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
                </a>
                <a href="#" className="flex items-center px-4 py-3 text-lg text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex="-1" onClick={() => logout.mutate()}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2 text-red-800" /> Logout
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const NonAuthenticatedMenu = ({ navigate }) => (
  <>
    <div className="hidden md:flex items-center">
      <button className="px-3 py-2 text-lg text-gray-200 bg-sky-500 hover:bg-sky-600 rounded-md font-bold" onClick={() => navigate('/auth/magic')}>
        SIGN IN
      </button>
    </div>
    <div className="md:hidden">
      <button className="px-3 py-2 text-lg text-gray-200 bg-sky-500 hover:bg-sky-600 rounded-md font-bold" onClick={() => navigate('/auth/magic')}>
        SIGN IN
      </button>
    </div>
  </>
);

export const Navbar = () => {
  const navigate = useNavigate();
  const { data: user } = useAuthenticatedUser();

  return (
    <div className="w-full shadow-md bg-gray-900 justify-between border-b border-b-gray-600">
      <div className="items-center flex justify-center">
        <div className="relative max-w-5xl justify-between w-full">
          <div className="flex flex-row justify-between items-center p-4 md:px-0">
            <div className="flex items-center justify-center text-center hover:cursor-pointer" onClick={() => { navigate('/') }}>
              <img src={logo} alt="Logo" className="w-9 h-9 mr-2 rounded bg-sky-600" />
              <h3 className="font-bold text-gray-200 text-3xl text-center items-center justify-center flex h-9 leading-none">
                Rede
              </h3>
            </div>
            {user ? (
              <AuthenticatedMenu
                user={user}
                navigate={navigate}
              />
            ) : (
              <NonAuthenticatedMenu navigate={navigate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
