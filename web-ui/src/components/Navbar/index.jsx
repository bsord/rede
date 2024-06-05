import { useAuthenticatedUser, useLogout } from '../../features/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCog, faListUl, faPlus, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

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

          <NavLink
            to={'/subscriptions/new'}
            end
            className={({ isActive, isPending, isTransitioning }) =>
              "rounded-lg px-3 py-2 text-lg text-black hover:bg-gray-100 hover:text-black".concat([
                isPending ? "pending" : "",
                isActive ? "border-b-2 border-sky-400" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" "))
            }
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create
          </NavLink>

          <NavLink
            to={'/subscriptions'}
            end
            className={({ isActive, isPending, isTransitioning }) =>
              "rounded-lg px-3 py-2 text-lg text-black hover:bg-gray-100 hover:text-black".concat([
                isPending ? "pending" : "",
                isActive ? "border-b-2 border-sky-400" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" "))
            }
          >
            <FontAwesomeIcon icon={faListUl} className="mr-2" /> Subscriptions
          </NavLink>


        <div className="flex border-l border-gray-500 mx-4 pl-4">
          <NavLink
            to={'/account'}
            end
            className={({ isActive, isPending, isTransitioning }) =>
              "rounded-lg px-3 py-2 text-lg text-black hover:bg-gray-100 hover:text-black".concat([
                isPending ? "pending" : "",
                isActive ? "border-b-2 border-sky-400" : "",
                isTransitioning ? "transitioning" : "",
              ].join(" "))
            }
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            {user.name && user.name !== "" ? user.name :  getEmailPrefix(user.email)}
          </NavLink>

          <button className='ml-2 rounded-lg p-2 text-lg text-gray-700 hover:bg-gray-100' onClick={() => logout.mutate()}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-red-800" />
          </button>
        </div>
      </div>
      <div className="md:hidden">
        <button ref={menuButtonRef} onClick={toggleMenu} className="cursor-pointer flex items-center justify-center">
          <FontAwesomeIcon icon={faBars} className={`h-7 transition-transform transform ${menuVisible ? 'rotate-90 text-sky-500' : 'text-black rotate-0'}`} />
        </button>
        {menuVisible && (
          <div ref={menuRef} className="origin-top-right absolute right-0 w-full mt-4 rounded-b-xl shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-4" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
            <div className="py-1 text-gray-200 space-y-2" role="none">
              <NavLink
                to={'/subscriptions/new'}
                end
                className={({ isActive, isPending, isTransitioning }) =>
                  "flex items-center px-4 py-3 text-lg text-gray-200 hover:bg-gray-200 hover:text-gray-800 rounded-lg".concat([
                    isPending ? "pending" : "",
                    isActive ? "border-b-2 border-sky-400" : "",
                    isTransitioning ? "transitioning" : "",
                  ].join(" "))
                }
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Create
              </NavLink>
              <NavLink to={"/subscriptions"}
               end
                className={({ isActive, isPending, isTransitioning }) =>
                  "flex items-center px-4 py-3 text-lg text-gray-200 hover:bg-gray-200 hover:text-gray-800 rounded-lg".concat([
                    isPending ? "pending" : "",
                    isActive ? "border-b-2 border-sky-400" : "",
                    isTransitioning ? "transitioning" : "",
                  ].join(" "))
                }>
                <FontAwesomeIcon icon={faListUl} className="mr-2" /> Subscriptions
              </NavLink>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-4">
                <NavLink
                  to={'/account'}
                  end
                  className={({ isActive, isPending, isTransitioning }) =>
                    "rounded-lg px-3 py-2 text-lg text-gray-200 hover:bg-gray-200 hover:text-gray-800".concat([
                      isPending ? "pending" : "",
                      isActive ? "border-b-2 border-sky-400" : "",
                      isTransitioning ? "transitioning" : "",
                    ].join(" "))
                  }
                >
                <div className='flex'>
                  <div className='h-10 w-10 rounded-full bg-sky-500 p-2 items-center justify-center flex'><FontAwesomeIcon icon={faUser} className="h-full" /></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium ">{getEmailPrefix(user.email)}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                </NavLink>
                <button onClick={() => logout.mutate()} className="flex items-center px-4 py-3 text-lg text-gray-200 hover:bg-gray-200 hover:text-gray-800 rounded-lg">
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-red-800" />
                </button>
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
      <button className="px-3 py-2 text-lg text-white bg-amber-500 hover:bg-amber-600 rounded-md font-semibold" onClick={() => navigate('/auth/magic')}>
        SIGN IN
      </button>
    </div>
    <div className="md:hidden">
      <button className="px-3 py-2 text-lg text-white bg-amber-500 hover:bg-amber-600 rounded-md font-semibold" onClick={() => navigate('/auth/magic')}>
        SIGN IN
      </button>
    </div>
  </>
);

export const Navbar = () => {
  const navigate = useNavigate();
  const { data: user } = useAuthenticatedUser();

  return (
    <div className="w-full bg-zinc-50 justify-between">
      <div className="items-center flex justify-center">
        <div className="relative max-w-5xl justify-between w-full">
          <div className="flex flex-row justify-between items-center p-4 md:px-0">
            <div className="flex items-center justify-center text-center hover:cursor-pointer" onClick={() => { navigate('/') }}>
              <img src={logo} alt="Logo" className="w-9 h-9 mr-2 rounded bg-amber-500" />
              <h3 className="font-bold text-black-100 text-3xl text-center items-center justify-center flex h-9 leading-none">
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
