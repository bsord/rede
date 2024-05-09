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

export const Sidebar = () => {
  const logout = useLogout()
  const { data: user } = useAuthenticatedUser()
  return (
    <div className="h-screen w-full max-w-[20rem] flex flex-col p-4 shadow-sm bg-white border border-blue-gray-100 justify-between rounded-none ">
      <div>
        <div className=" p-2 text-center">
          <Typography variant="h6" color="blue-gray">
            Rede.io
          </Typography>
        </div>
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

        </List>
      </div>

      <div>
        <List>
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
      </div>
    </div>
  )
}
