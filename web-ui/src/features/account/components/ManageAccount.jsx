import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserById } from '../api/getUser';
import { useUpdateUser } from '../api/updateUser';
import { useDeleteUser } from '../api/deleteUser';
import { Button, Input } from '../../../components/Elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import storage from '@/utils/storage'

// Helper function to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString(); // Adjust this format as needed
};

const ManageUser = ({ userId, onUserDeleted }) => {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUserById(userId);
  const updateUser = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeletePending, error: deleteError } = useDeleteUser();
  const [userFields, setUserFields] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      setUserFields(user);
    }
  }, [user, isLoading]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setUserFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    updateUser.mutate(userFields, {
      onSuccess: () => {
        setIsUpdating(false);
        storage.auth.setAuthenticatedUser(userFields)
      },
      onError: () => {
        setIsUpdating(false);
      },
    });
  };

  const handleDelete = () => {
    deleteUser(user._id, {
      onSuccess: () => {
        console.log('Deleted user');
        if (onUserDeleted) {
          onUserDeleted(userId);
        }
        navigate('/users');
      },
    });
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error) {
    console.log(error);
    return <span>There was an error</span>;
  }

  return (
    <div className="border p-4 border-gray-300 bg-white rounded-lg shadow-md md:w-1/2 w-full">

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email:</label>
        <span className="text-lg font-semibold">{user.email}</span>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name:</label>
        <Input
          name="name"
          value={userFields.name || ''}
          onChange={handleFieldChange}
          label="Name"
        />
      </div>

      <Button
        onClick={handleUpdate}
        disabled={isUpdating || updateUser.isLoading}
      >
        {isUpdating ? <>Updating <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></> : <>Update</>}
      </Button>

      <Button
        onClick={handleDelete}
        disabled={isDeletePending}
      >
        {isDeletePending ? <>Deleting <FontAwesomeIcon icon={faSpinner} className="ml-2 animate-spin" /></> : <>Delete</>}
      </Button>

      {deleteError && <span className="text-red-600">Delete failed: {deleteError.message}</span>}
      {updateUser.isError && (
        <span className="text-red-600">Update failed: {updateUser.error.message}</span>
      )}
      {updateUser.isSuccess && (
        <span className="text-green-600">Update successful!</span>
      )}
    </div>
  );
};

export default ManageUser;