import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { useAuthenticatedUser, useLogout } from '../../features/auth'
import { Link, NavLink } from 'react-router-dom'
import {
  Typography,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Button,
} from '../Elements'
import { useState } from 'react'

export const Navbar = () => {
  const logout = useLogout()
  const { data: user } = useAuthenticatedUser()
  const [menuVisible, setMenuVisible] = useState(false)

  return (
    <div className="md:hidden w-full  p-4 shadow-sm bg-white border border-blue-gray-100 justify-between rounded-none ">
      <div>
        <div className=' flex flex-row justify-between items-center'>
          <div className=" p-2 text-center">
            <Typography variant="h6" color="blue-gray">
              Rede.io
            </Typography>
          </div>
          <div onClick={()=>{setMenuVisible(!menuVisible)}}>Menu</div>
        </div>
        {menuVisible &&
          <List>

            <NavLink
              to={'/subscriptions/new'}
              className={({ isActive, isPending }) =>
                isPending ? 'bg-gray-200 rounded-lg' : isActive ? 'bg-gray-300 rounded-lg' : ''
              }
            >
              <ListItem>
                <ListItemPrefix>
                  <FontAwesomeIcon icon={faGoogle} />
                </ListItemPrefix>
                Create new subscription
              </ListItem>
            </NavLink>

            <NavLink
              to={'/subscriptions'}
              end
              className={({ isActive, isPending }) =>
                isPending ? 'bg-gray-200 rounded-lg' : isActive ? 'bg-gray-300 rounded-lg' : ''
              }
            >
              <ListItem>
                <ListItemPrefix>
                  <FontAwesomeIcon icon={faGoogle} />
                </ListItemPrefix>
                Subscriptions
              </ListItem>
            </NavLink>
            <Link to={'/settings'}>
              <ListItem>
                <ListItemPrefix>
                  <FontAwesomeIcon icon={faGoogle} />
                </ListItemPrefix>
                Settings
              </ListItem>
            </Link>
            <ListItem>
              <div className='flex flex-col'>
                {
                user?.email && user.email
              }
              
              <Button
                onClick={() => {
                  logout.mutate()
                }}
              >
                Logout
              </Button>
              </div>
            </ListItem>
          </List>
        }
        
      </div>

    </div>
  )
}
